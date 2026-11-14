import { Composition, Folder } from "remotion";
import { MyVideo } from "./MyVideo";
import { OutroScene } from "./OutroScene";
import { StepsScene } from "./StepsScene";
import { TitleScene } from "./TitleScene";
import { calculateTalkingHeadMetadata, TalkingHead } from "./talking-head/TalkingHead";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Your talking-head template — one <Composition> per video */}
      <Folder name="Talking-head">
        <Composition
          id="DataIsTheNewOil"
          component={TalkingHead}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={1300}
          calculateMetadata={calculateTalkingHeadMetadata}
          defaultProps={{
            videoSrc: "source/clip3.mp4",
            captionsSrc: "captions/clip3.json",
            hook: "Data is the new oil.",
            hookSeconds: 4,
            cta: "Build systems that outlast you. Follow for more.",
            accent: "#FF4D5E",
            punchIns: [5.4, 33.1],
          }}
        />
        <Composition
          id="LipSyncTest1"
          component={TalkingHead}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={530}
          calculateMetadata={calculateTalkingHeadMetadata}
          defaultProps={{
            videoSrc: "source/lipsync-A-sync3.mp4",
            captionsSrc: "captions/test1-full.json",
            footageSeconds: 23.86,
            hook: "Hard work won't scale your impact.",
            hookSeconds: 3.5,
            cta: "Build systems that outlast you. Follow for more.",
            accent: "#FF4D5E",
            punchIns: [7.06, 19.7],
          }}
        />
      </Folder>

      {/* Earlier demo */}
      <Folder name="Demo">
        <Composition id="Title" component={TitleScene} width={1920} height={1080} fps={30} durationInFrames={90} />
        <Composition id="Steps" component={StepsScene} width={1920} height={1080} fps={30} durationInFrames={120} />
        <Composition id="Outro" component={OutroScene} width={1920} height={1080} fps={30} durationInFrames={90} />
        <Composition id="MyVideo" component={MyVideo} width={1920} height={1080} fps={30} durationInFrames={270} />
      </Folder>
    </>
  );
};
