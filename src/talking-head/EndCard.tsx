import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { fontFamily } from "./fonts";

export const EndCard: React.FC<{ cta: string; accent: string }> = ({ cta, accent }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 75% 35%, ${accent} 0%, #2a1416 38%, #111111 75%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 110,
        opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      <Interactive.Div
        name="CTA text"
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 104,
          lineHeight: 1.08,
          color: "white",
          textAlign: "center",
          textWrap: "balance",
          scale: interpolate(frame, [0, 20], [0.85, 1], {
            easing: Easing.out(Easing.back(1.6)),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {cta}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
