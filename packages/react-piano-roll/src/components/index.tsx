import styles from "./index.module.scss";
import { CSSProperties, KeyboardEvent, useLayoutEffect, useMemo, useRef } from "react";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import type { PitchRange } from "@/interfaces/piano-roll-range";
import { baseCanvasWidth, baseCanvasHeight } from "@/helpers/conversion";
import { ConfigProvider, PianoRollConfig } from "@/contexts/PianoRollConfigProvider";
import { useScrollToNote } from "@/hooks/useScrollToNote";
import UpperSection from "./Sections/UpperSection";
import MiddleSection from "./Sections/MiddleSection";
import MiddleRightSection from "./PianoRoll";
import LowerSection from "./Sections/LowerSection";
import { ScaleXProvider, useScaleX } from "@/contexts/ScaleXProvider";
import PianoRollThemeContext from "@/contexts/piano-roll-theme-context";
import { defaultPianoRollTheme } from "@/store/pianoRollTheme";
import { PianoRollStoreProvider } from "@/store/pianoRollStore";
import { BeatPerBar, BeatUnit } from "@/interfaces/time-signature";
import { useLeftAnchoredScale } from "@/hooks/useLeftAnchoredScale";

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
  const { scaleX } = useScaleX();
  useScrollToNote(containerRef, initialScrollMiddleNote);
  useLeftAnchoredScale(containerRef);

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
      <UpperSection />
      <MiddleSection>
        <MiddleRightSection attachLyric={attachLyric} playheadPosition={playheadPosition} />
      </MiddleSection>
      <LowerSection />
    </div>
  );
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
