import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 30% 30%, #1e3a8a 0%, #0b1020 70%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
      }}
    >
      <Interactive.Div
        name="Logo ring"
        style={{
          width: 220,
          height: 220,
          borderRadius: 110,
          border: "18px solid #38bdf8",
          marginBottom: 60,
          scale: interpolate(frame, [0, 1 * fps], [0, 1], {
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="Headline"
        style={{
          color: "white",
          fontSize: 140,
          fontWeight: 800,
          letterSpacing: -3,
          opacity: interpolate(frame, [10, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [10, 40], ["0px 60px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Videos in Code
      </Interactive.Div>
      <Interactive.Div
        name="Subtitle"
        style={{
          color: "#94a3b8",
          fontSize: 64,
          marginTop: 24,
          opacity: interpolate(frame, [30, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Built with React and Remotion
      </Interactive.Div>
    </AbsoluteFill>
  );
};
