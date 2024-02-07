import { defaultPianoRollTheme } from "@/store/pianoRollTheme";
import PianoRollThemeContext from "../contexts/piano-roll-theme-context";
import styles from "./index.module.scss";
import useStore from "../hooks/useStore";
import { CSSProperties, KeyboardEvent, useLayoutEffect, useMemo, useRef } from "react";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import type { PitchRange } from "@/interfaces/piano-roll-range";
import { baseCanvasWidth, baseCanvasHeight } from "@/helpers/conversion";
import { ConfigProvider, PianoRollConfig } from "@/contexts/PianoRollConfigProvider";
import { useScrollToNote } from "@/hooks/useScrollToNote";
import UpperSection from "./Sections/UpperSection";
import MiddleSection from "./Sections/MiddleSection";
import MiddleRightSection from "./Sections/MiddleRightSection";
import LowerSection from "./Sections/LowerSection";

interface PianoRollProps {
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
}
function PianoRoll({
  playheadPosition,
  attachLyric = false,
  initialScrollMiddleNote = 60,
  onSpace,
  style,
  tickRange = [0, 480 * 4 * 8],
  pitchRange = { startingNoteNum: 0, numOfKeys: 128 },
}: PianoRollProps) {
  const { pianoRollStore } = useStore();

  const containerRef = useRef<HTMLDivElement>(null);
  useScrollToNote(containerRef, initialScrollMiddleNote);

  const config = useMemo(() => {
    const config: PianoRollConfig = {
      pitchRange: pitchRange,
      tickRange: tickRange,
    };
    return config;
  }, []);

  return (
    <PianoRollThemeContext.Provider value={defaultPianoRollTheme()}>
      <ConfigProvider value={config}>
        <div
          className={`${styles["container"]} piano-roll`}
          ref={containerRef}
          style={
            {
              "--canvas-width": `${baseCanvasWidth(tickRange) * pianoRollStore.pianoLaneScaleX}px`,
              "--canvas-height": `${baseCanvasHeight(pitchRange.numOfKeys)}px`,
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
      </ConfigProvider>
    </PianoRollThemeContext.Provider>
  );
}

export default PianoRoll;
