import { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useDelayRender, useVideoConfig } from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";
import { fontFamily } from "./fonts";

// Max time one caption page stays up. Lower = fewer words on screen.
const SWITCH_CAPTIONS_EVERY_MS = 1100;

const CaptionPage: React.FC<{ page: TikTokPage; accent: string }> = ({ page, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteTimeMs = page.startMs + (frame / fps) * 1000;
  const pop = Math.min(1, frame / 4);

  return (
    <AbsoluteFill style={{ alignItems: "center", top: 1230 }}>
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.15,
          textAlign: "center",
          whiteSpace: "pre-wrap",
          maxWidth: 900,
          textWrap: "balance",
          padding: "18px 34px",
          borderRadius: 24,
          backgroundColor: "rgba(17, 17, 17, 0.78)",
          color: "white",
          scale: String(0.92 + 0.08 * pop),
        }}
      >
        {page.tokens.map((token, i) => {
          const active = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          return (
            <span key={`${token.fromMs}-${i}`} style={{ color: active ? accent : "white" }}>
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{ src: string; accent: string }> = ({ src, accent }) => {
  const { fps } = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading captions"));

  useEffect(() => {
    fetch(staticFile(src))
      .then((r) => r.json())
      .then((data: Caption[]) => {
        setCaptions(data);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [src, handle, continueRender, cancelRender]);

  const pages = useMemo(
    () =>
      captions
        ? createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS }).pages
        : [],
    [captions],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const next = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = Math.round(
          Math.min(next ? (next.startMs / 1000) * fps : Infinity, ((page.startMs + page.durationMs) / 1000) * fps + 8),
        );
        if (endFrame - startFrame <= 0) return null;
        return (
          <Sequence key={index} name="Caption" from={startFrame} durationInFrames={endFrame - startFrame}>
            <CaptionPage page={page} accent={accent} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
