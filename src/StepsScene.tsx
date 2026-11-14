import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";

export const StepsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b1020",
        justifyContent: "center",
        padding: 160,
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
      }}
    >
      <Interactive.Div
        name="Steps title"
        style={{
          color: "#38bdf8",
          fontSize: 96,
          fontWeight: 800,
          marginBottom: 80,
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Three steps
      </Interactive.Div>
      <Interactive.Div
        name="Step 1"
        style={{
          color: "white",
          fontSize: 72,
          marginBottom: 40,
          opacity: interpolate(frame, [15, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [15, 40], ["-120px 0px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        1 · Write React components
      </Interactive.Div>
      <Interactive.Div
        name="Step 2"
        style={{
          color: "white",
          fontSize: 72,
          marginBottom: 40,
          opacity: interpolate(frame, [35, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [35, 60], ["-120px 0px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        2 · Animate with frames
      </Interactive.Div>
      <Interactive.Div
        name="Step 3"
        style={{
          color: "white",
          fontSize: 72,
          opacity: interpolate(frame, [55, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [55, 80], ["-120px 0px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        3 · Render to MP4
      </Interactive.Div>
    </AbsoluteFill>
  );
};
