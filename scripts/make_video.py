"""Script -> finished talking-head video, in one command.

  python3 scripts/make_video.py --name my-video --script script.txt \
      --hook "Bold one-liner" --cta "Follow for more." [--base public/source/clip3.mp4 --base-start 0] [--punch 7 19]

Steps: ElevenLabs voice -> Whisper word timings (captions use the script's own spelling)
-> Sync lip sync onto the base clip -> Remotion render (house style) -> out/<name>.mp4
API keys are injected by the environment's network proxy; nothing secret is stored here.
"""
import argparse, difflib, json, re, subprocess, sys, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((ROOT / "voice.config.json").read_text())
KEY = "proxy-injected"  # the proxy replaces this with the real key


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


def duration(path):
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)], capture_output=True, text=True)
    return float(out.stdout.strip())


def tts(text, dest):
    body = {"text": text, "model_id": CFG["modelId"], "voice_settings": CFG["voiceSettings"]}
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{CFG['voiceId']}", data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json", "xi-api-key": KEY})
    dest.write_bytes(urllib.request.urlopen(req).read())


def word_timings(audio):
    import numpy as np
    from faster_whisper import WhisperModel
    pcm = run(["ffmpeg", "-v", "error", "-i", str(audio), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
    segs, _ = WhisperModel("small.en", device="cpu", compute_type="int8").transcribe(np.frombuffer(pcm, np.float32), word_timestamps=True)
    words = []
    for w in (w for s in segs for w in s.words):
        if w.word.startswith("-") and words:  # "non" + "-profit"
            words[-1] = (words[-1][0] + w.word, words[-1][1], w.end)
        else:
            words.append((w.word.strip(), w.start, w.end))
    return words


def norm(w):
    return re.sub(r"[^a-z0-9]", "", w.lower())


def align(script, heard):
    """Give each word of the script (exact spelling) the timing of the matching heard word."""
    spoken = re.sub(r"\[[^\]]*\]", " ", script).split()  # drop delivery cues like [confident]
    times = [None] * len(spoken)
    sm = difflib.SequenceMatcher(a=[norm(w) for w in spoken], b=[norm(w[0]) for w in heard], autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            times[a + k] = (heard[b + k][1], heard[b + k][2])
    # fill gaps (misheard words) by interpolating between known neighbours
    for i, t in enumerate(times):
        if t is None:
            prev = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0.0)
            nxt_i = next((j for j in range(i + 1, len(times)) if times[j]), None)
            nxt = times[nxt_i][0] if nxt_i is not None else prev + 0.4
            gap = (nxt_i - i + 1) if nxt_i is not None else 1
            times[i] = (prev, prev + max(0.12, (nxt - prev) / gap))
    caps = []
    for w, (s, e) in zip(spoken, times):
        c = {"text": " " + w, "startMs": int(s * 1000), "endMs": int(e * 1000), "timestampMs": int((s + e) * 500), "confidence": None}
        if w.rstrip("”’\"'").endswith((".", ",", "?", "!", ":", ";")):
            c["pageBreakAfter"] = True
        caps.append(c)
    return caps


def lipsync(base, audio, dest):
    out = run(["curl", "-sS", "-X", "POST", "https://api.sync.so/v2/generate", "-H", f"x-api-key: {KEY}",
               "-F", f"model={CFG['lipsync']['model']}", "-F", f"video=@{base}", "-F", f"audio=@{audio}",
               "-F", 'options={"sync_mode":"bounce"}'], capture_output=True, text=True).stdout
    job = json.loads(out)
    if "id" not in job:
        sys.exit(f"Sync refused the job: {out}")
    while True:
        req = urllib.request.Request(f"https://api.sync.so/v2/generate/{job['id']}?wait=true&timeout=10", headers={"x-api-key": KEY})
        job = json.load(urllib.request.urlopen(req))
        if job["status"] in ("COMPLETED", "FAILED", "REJECTED", "CANCELED"):
            break
        print("  lip sync:", job["status"], flush=True)
        time.sleep(2)
    if job["status"] != "COMPLETED":
        sys.exit(f"Lip sync {job['status']}: {job.get('error')}")
    urllib.request.urlretrieve(job["outputUrl"], dest)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--script", required=True, help="text file with the script")
    ap.add_argument("--hook", required=True)
    ap.add_argument("--cta", default="Follow for more.")
    ap.add_argument("--base", default="public/source/clip3.mp4")
    ap.add_argument("--base-start", type=float, default=0)
    ap.add_argument("--say", nargs="*", default=[], help='pronunciation fixes for the voice only, e.g. AREAi=Area-eye')
    ap.add_argument("--punch", type=float, nargs="*", default=None, help="seconds to punch in; default: start of the 2nd and last sentences")
    a = ap.parse_args()

    script = Path(a.script).read_text().strip()
    work = ROOT / "work" / a.name
    work.mkdir(parents=True, exist_ok=True)
    voice = ROOT / "public/voiceover" / f"{a.name}.mp3"
    caps_path = ROOT / "public/captions" / f"{a.name}.json"
    footage = ROOT / "public/source" / f"{a.name}-lipsync.mp4"

    spoken = script
    for pair in a.say:
        k, v = pair.split("=", 1)
        spoken = spoken.replace(k, v)
    print("1/4 voice"); tts(spoken, voice)
    speech = duration(voice)
    print(f"    {speech:.1f}s")

    print("2/4 captions"); caps = align(script, word_timings(voice))
    caps_path.write_text(json.dumps(caps, indent=1))

    print("3/4 lip sync")
    base = work / "base.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-ss", str(a.base_start), "-t", f"{speech + 0.5:.2f}", "-i", str(ROOT / a.base),
         "-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", str(base)])
    lipsync(base, voice, footage)

    starts = [c["startMs"] / 1000 for i, c in enumerate(caps) if i > 0 and caps[i - 1].get("pageBreakAfter") and caps[i - 1]["text"].rstrip().endswith((".", "?", "!"))]
    punch = a.punch if a.punch is not None else ([starts[0], starts[-1]] if len(starts) >= 2 else starts)

    print("4/4 render")
    props = {"videoSrc": f"source/{footage.name}", "captionsSrc": f"captions/{caps_path.name}", "footageSeconds": round(duration(footage), 2),
             "hook": a.hook, "hookSeconds": 3.5, "cta": a.cta, "accent": "#FF4D5E", "punchIns": [round(p, 2) for p in punch]}
    (work / "props.json").write_text(json.dumps(props, indent=1))
    run(["npx", "remotion", "render", "ScriptVideo", f"out/{a.name}.mp4", f"--props={work / 'props.json'}"], cwd=ROOT)
    print(f"Done: out/{a.name}.mp4")


if __name__ == "__main__":
    main()
