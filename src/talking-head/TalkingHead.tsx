import { Video } from "@remotion/media";
import type { Caption } from "@remotion/captions";
import { AbsoluteFill, CalculateMetadataFunction, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "./Captions";
import { EndCard } from "./EndCard";
import { HookTitle } from "./HookTitle";

export type TalkingHeadProps = {
  videoSrc: string; // file inside public/
  captionsSrc: string; // Caption[] JSON inside public/
  hook: string; // big title shown at the start
  hookSeconds: number;
  cta: string; // end card text
  accent: string; // brand highlight colour
  punchIns: number[]; // seconds where the camera "punches in" for emphasis
  footageSeconds?: number; // length of the footage, so the video never runs past it
};

export const END_CARD_FRAMES = 75;
const TAIL_SECONDS = 0.25; // keep a beat after the last word (must not run past the footage)

// Length = last spoken word + a short beat + the end card.
export const calculateTalkingHeadMetadata: CalculateMetadataFunction<TalkingHeadProps> = async ({ props }) => {
  const captions: Caption[] = await fetch(staticFile(props.captionsSrc)).then((r) => r.json());
  const lastMs = captions[captions.length - 1].endMs;
  const fps = 30;
  const speechEnd = Math.min(lastMs / 1000 + TAIL_SECONDS, props.footageSeconds ?? Infinity);
  return { fps, durationInFrames: Math.floor(speechEnd * fps) + END_CARD_FRAMES };
};

const usePunchInScale = (punchIns: number[]) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // Hard "jump cut" zoom held for 3 seconds — feels like a second camera angle.
  return punchIns.some((p) => t >= p && t < p + 3) ? 1.14 : 1;
};

export const TalkingHead: React.FC<TalkingHeadProps> = ({ videoSrc, captionsSrc, hook, hookSeconds, cta, accent, punchIns }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const videoFrames = durationInFrames - END_CARD_FRAMES;
  const scale = usePunchInScale(punchIns);

  return (
    <AbsoluteFill style={{ backgroundColor: "#111111" }}>
      <Sequence name="Footage" durationInFrames={videoFrames}>
        <AbsoluteFill style={{ scale: String(scale), transformOrigin: "50% 38%" }}>
          <Video src={staticFile(videoSrc)} trimAfter={videoFrames} objectFit="cover" style={{ width: "100%", height: "100%" }} />
        </AbsoluteFill>
        <Captions src={captionsSrc} accent={accent} />
      </Sequence>
      <Sequence name="Hook" durationInFrames={Math.round(hookSeconds * fps)}>
        <HookTitle text={hook} accent={accent} />
      </Sequence>
      <Sequence name="End card" from={videoFrames}>
        <EndCard cta={cta} accent={accent} />
      </Sequence>
    </AbsoluteFill>
  );
};
