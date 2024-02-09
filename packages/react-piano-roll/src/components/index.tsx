import styles from "./index.module.scss";
import { CSSProperties, KeyboardEvent, useLayoutEffect, useMemo, useRef } from "react";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import type { PitchRange } from "@/interfaces/piano-roll-range";
import { baseCanvasWidth, baseCanvasHeight } from "@/helpers/conversion";
import { ConfigProvider, PianoRollConfig } from "@/contexts/PianoRollConfigProvider";
import { useScrollToNote } from "@/hooks/useScrollToNote";
import UpperSection from "./Sections/UpperSection";
import MiddleSection from "./Sections/MiddleSection";
import PianoRoll from "./PianoRoll";
import LowerSection from "./Sections/LowerSection";
import { ScaleXProvider, useScaleX } from "@/contexts/ScaleXProvider";
import PianoRollThemeContext from "@/contexts/piano-roll-theme-context";
import { defaultPianoRollTheme } from "@/store/pianoRollTheme";
import { PianoRollStoreProvider } from "@/store/pianoRollStore";
import { BeatPerBar, BeatUnit } from "@/interfaces/time-signature";
import { useLeftAnchoredScale } from "@/hooks/useLeftAnchoredScale";
import Rulers from "./Rulers";
import VelocityEditor from "./VelocityEditor";
import PianoKeyboard from "./PianoKeyboard";
import { useSyncScrollTop } from "@/hooks/useLinkScrollTop";

function MidiEditor({
  playheadPosition,
  attachLyric = false,
  initialScrollMiddleNote = 60,
  onSpace,
  style,
  tickRange,
  pitchRange,
  beatsPerBar,
  beatUnit,
}: MidiEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const keybordRef = useRef<HTMLDivElement>(null);
  const pianoRollRef = useRef<HTMLDivElement>(null);
  const { scaleX } = useScaleX();
  // useScrollToNote(containerRef, initialScrollMiddleNote);
  // useLeftAnchoredScale(containerRef);

  useSyncScrollTop(pianoRollRef, keybordRef);

  return (
    <div
      className={`${styles["container"]} piano-roll`}
      ref={containerRef}
      style={
        {
          "--canvas-width": `${baseCanvasWidth(tickRange!) * scaleX}px`,
          "--canvas-height": `${baseCanvasHeight(pitchRange!.numOfKeys)}px`,
          ...style,
        } as React.CSSProperties
      }
      tabIndex={0}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          width: "800px",
        }}
      >
        <div
          ref={keybordRef}
          style={{
            overflowY: "scroll",
            height: "600px",
            overscrollBehavior: "none",
            // willChange: "scroll-position",
          }}
        >
          <div style={{ height: "49px"}}> </div>
          <PianoKeyboard />
        </div>
        <div
          style={{
            display: "grid",
            gridAutoRows: "auto 1fr auto",
            overflowX: "scroll",
            overflowY: "hidden",
            overscrollBehavior: "none",
            height: "600px",
          }}
        >
          <Rulers />
          <div
            ref={pianoRollRef}
            style={{
              overflowY: "scroll",
              // willChange: "scroll-position",
              // width: "fit-content",
              overscrollBehavior: "none",
            }}
          >
            <PianoRoll attachLyric={attachLyric} playheadPosition={playheadPosition} />
          </div>
          <VelocityEditor />
        </div>
      </div>
    </div>
  );
}

interface MidiEditorProps {
  playheadPosition?: number;
  attachLyric?: boolean;
  initialScrollMiddleNote?: number;
  onSpace?: (event: KeyboardEvent<HTMLDivElement>) => void;
  onNoteCreate?: (notes: TrackNoteEvent[]) => void;
  onNoteUpdate?: (notes: TrackNoteEvent[]) => void;
  onNoteSelect?: (notes: TrackNoteEvent[]) => void;
  tickRange?: [number, number];
  style?: CSSProperties;
  pitchRange?: PitchRange;
  beatsPerBar?: BeatPerBar;
  beatUnit?: BeatUnit;
}

const withProvider = (Component: typeof MidiEditor) => {
  return ({
    tickRange = [0, 480 * 4 * 8],
    pitchRange = { startingNoteNum: 0, numOfKeys: 128 },
    beatsPerBar = 4,
    beatUnit = 4,
    ...other
  }: MidiEditorProps) => {
    const config = useMemo(() => {
      const config: PianoRollConfig = {
        pitchRange: pitchRange,
        tickRange: tickRange,
        beatsPerBar: beatsPerBar,
        beatUnit: beatUnit,
      };
      return config;
    }, []);

    return (
      <PianoRollStoreProvider>
        <ConfigProvider value={config}>
          <PianoRollThemeContext.Provider value={defaultPianoRollTheme()}>
            <ScaleXProvider>
              <Component {...other} tickRange={tickRange} pitchRange={pitchRange} beatsPerBar={beatsPerBar} />
            </ScaleXProvider>
          </PianoRollThemeContext.Provider>
        </ConfigProvider>
      </PianoRollStoreProvider>
    );
  };
};

export default withProvider(MidiEditor);
