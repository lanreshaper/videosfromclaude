import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { OutroScene } from "./OutroScene";
import { StepsScene } from "./StepsScene";
import { TitleScene } from "./TitleScene";

export const MyVideo: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Title" durationInFrames={90}>
      <TitleScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 15 })} />
    <TransitionSeries.Sequence name="Steps" durationInFrames={120}>
      <StepsScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
    <TransitionSeries.Sequence name="Outro" durationInFrames={90}>
      <OutroScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
