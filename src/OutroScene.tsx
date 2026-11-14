import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
      }}
    >
      <Interactive.Div
        name="Outro headline"
        style={{
          color: "white",
          fontSize: 160,
          fontWeight: 800,
          scale: interpolate(frame, [0, 1 * fps], [0.6, 1], {
            easing: Easing.spring({ damping: 10 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Now you try.
      </Interactive.Div>
      <Interactive.Div
        name="Outro command"
        style={{
          color: "white",
          fontSize: 56,
          fontFamily: "Menlo, monospace",
          marginTop: 40,
          padding: "20px 40px",
          borderRadius: 20,
          backgroundColor: "rgba(0,0,0,0.25)",
          opacity: interpolate(frame, [20, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        npx create-video@latest
      </Interactive.Div>
    </AbsoluteFill>
  );
};
