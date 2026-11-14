import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./fonts";

export const HookTitle: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ top: 210 }}>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Interactive.Div
        name="Hook card"
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1.05,
          textAlign: "center",
          color: "#111111",
          backgroundColor: "white",
          padding: "26px 44px",
          borderRadius: 28,
          maxWidth: 880,
          textWrap: "balance",
          boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
          borderBottom: `12px solid ${accent}`,
          translate: interpolate(frame, [0, 12], ["0px -60px", "0px 0px"], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          opacity: interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {text}
      </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
