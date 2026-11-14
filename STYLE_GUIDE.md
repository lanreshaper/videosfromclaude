# Talking-Head Video Style Guide

Built from five reference videos in `public/source/` (clip1–clip5). Read this before making any new video.

## 1. Filming setup (keep identical every time)

| Element | What it looks like now |
|---|---|
| Format | Vertical 9:16, phone camera, recorded 720×1280 @ 30fps (export 1080×1920) |
| Framing | Chest-up, centred. Eyes about 1/3 down the frame, head roughly 30–45% of frame height |
| Background | Warm off-white walls with a corner (left third), soft grey left wall |
| Signature light | Red/pink vertical neon floor lamp, **right of the head**, glowing on the wall |
| Props | Gold/amber flowers low on the right edge |
| Wardrobe | Plain, solid tops (cream/white or charcoal) + a baseball cap + glasses + beaded bracelet |
| Audio | Clip-on mic on the chest; loudness about −16 LUFS (good, leave as is) |
| Takes | One continuous take per video, no cuts, 40–76 seconds |

**Watch out:** cream tops + light walls = white captions disappear. That's why captions always sit on a dark pill (see §3).

## 2. Voice & tone (from the transcripts)

- **Audience:** non-profit founders, social entrepreneurs, "emerging and evolving leaders", young changemakers.
- **Themes:** scaling impact, funding diversification, knowledge management & documentation, continuous learning.
- **Register:** authoritative mentor. Confident, direct, strong rhythmic delivery.
- **Signature devices:**
  - **Bold one-line truths:** "Data is the new oil." / "Growth exposes every gap you choose not to document."
  - **Direct imperatives:** "Do not allow…", "You need to…", "You cannot afford to…"
  - **Contrast pairs:** "scaling is not about doing more. It's about…", "systemised and not siloed"
  - **Lists of "between X and Y":** builds rhythm before the point lands
  - **Personal proof:** "In 2019, when we designed…", "going back to the University of Geneva…"
  - **Credible references:** Stanford Social Innovation Review, NYU, award-winning programmes
- **Shape of a video:** Hook truth → personal story/proof → the insight → (CTA: link in bio / drop a comment / DM)
- **Spelling:** British ("organisation", "maximise").

## 3. Edit style (the template)

| Element | Rule |
|---|---|
| Hook card | First 4s, top of frame over the wall. White card, black Montserrat Black, red underline. Max ~6 words — use the strongest one-liner from the script |
| Captions | Word-by-word, 2–5 words per page, Montserrat Black 76px, white on dark pill (78% black), **current word in accent red**. Sit just under the chin |
| Accent colour | `#FF4D5E` — matches the neon lamp |
| Punch-ins | Hard 14% zoom held 3s on the key line(s) — fakes a second camera angle. 1–3 per video |
| End card | 2.5s, dark background with red glow (echoes the lamp), one-line CTA |
| Pace | No b-roll needed; captions + punch-ins carry the energy |

## 4. Making a new video

1. Drop the new clip in `public/source/`.
2. Transcribe it → `public/captions/<name>.json` (Whisper; see `analysis/`). **Check names & jargon** — Whisper mishears them.
3. Add a `<Composition>` in `src/Root.tsx` copying `DataIsTheNewOil`: change `videoSrc`, `captionsSrc`, `hook`, `cta`, `punchIns`.
4. `npx remotion render <Id> out/<Id>.mp4`

Length is automatic: it ends 0.6s after the last spoken word, then the end card.

## 5. Open questions

- Organisation: **Aid for Rural Education Access Initiative (AREAi)**. Whisper mishears it as "Area High" / "ERI" — always correct it in captions. Still to confirm: "Caught Fast Track" (clip3), "rootlegs execution" (clip1), "All blue unicorns" (clip3).
- Logo file and name/title for an optional name tag.
- Voice clone (ElevenLabs) — for text-only videos without filming.

## 6. Approved voice (ElevenLabs)

- **Voice:** `v1_from_videos` (`GhOJa8R7VeLElgvBJEcB`), cloned from the five on-camera clips.
- **Model & settings:** `eleven_v3`, stability 0.5, similarity 0.9, speed 0.85 (natural pace ≈ 155 wpm).
- Chosen by ear over the studio-recording clone (`v2_from_recording`, kept for reference).
- Optional delivery cues in scripts: `[confident]`, `[emphatic]`, `[warmly]`, `[pause]`.

## 7. Lip sync & one-command videos

- **Lip sync:** Sync (sync.so) model `sync-3` — chosen over `lipsync-2-pro` in a side-by-side test.
- **Base footage:** a stretch of an existing clip where hands stay below the chin (clip3 0–25s and 26s+ work well).
  Better base footage = better lips: record base clips in 1080p/4K, facing camera, hands low.
- **Make a video from a script:**

  ```bash
  python3 scripts/make_video.py --name my-video --script my-script.txt \
      --hook "Bold one-liner" --cta "Follow for more." --base public/source/clip3.mp4 --base-start 0
  ```

  Voice (ElevenLabs) → captions aligned to the script's exact spelling (Whisper timings) → lip sync (Sync) → render `out/my-video.mp4`.
  Punch-ins default to the 2nd and last sentences; override with `--punch 7 19`.
- Mark the post as **AI-generated** when publishing (TikTok / Instagram / YouTube require it for realistic synthetic video).
