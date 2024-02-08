import styles from "./index.module.scss";
import { CSSProperties, KeyboardEvent, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import type { PitchRange } from "@/interfaces/piano-roll-range";
import { baseCanvasWidth, baseCanvasHeight, getTickFromEvent, getTickFromOffsetX } from "@/helpers/conversion";
import { ConfigProvider, PianoRollConfig } from "@/contexts/PianoRollConfigProvider";
import { useScrollToNote } from "@/hooks/useScrollToNote";
import UpperSection from "./Sections/UpperSection";
import MiddleSection from "./Sections/MiddleSection";
import MiddleRightSection from "./Sections/MiddleRightSection";
import LowerSection from "./Sections/LowerSection";
import { ScaleXProvider, useScaleX } from "@/contexts/ScaleXProvider";
import PianoRollThemeContext from "@/contexts/piano-roll-theme-context";
import { defaultPianoRollTheme } from "@/store/pianoRollTheme";
import { basePixelsPerTick } from "@/constants";
import { PianoRollStoreContext, PianoRollStoreProvider } from "@/store/pianoRollStore";

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
  tickRange,
  pitchRange,
}: PianoRollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollToNote(containerRef, initialScrollMiddleNote);
  const { scaleX } = useScaleX();

  const offsetX = useRef(0);

  const prevScaleX = useRef(scaleX);
  useLayoutEffect(() => {
    const scaleDifference = scaleX / prevScaleX.current;
    const scrollLeft = containerRef.current!.scrollLeft + 0.5;
    containerRef.current!.scrollTo({ left: scrollLeft * scaleDifference });
    prevScaleX.current = scaleX;
  }, [scaleX]);

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

const withProvider = (Component: typeof PianoRoll) => {
  return ({
    tickRange = [0, 480 * 4 * 8],
    pitchRange = { startingNoteNum: 0, numOfKeys: 128 },
    ...other
  }: PianoRollProps) => {
    const config = useMemo(() => {
      const config: PianoRollConfig = {
        pitchRange: pitchRange,
        tickRange: tickRange,
      };
      return config;
    }, []);

    return (
      <PianoRollStoreProvider>
        <ConfigProvider value={config}>
          <PianoRollThemeContext.Provider value={defaultPianoRollTheme()}>
            <ScaleXProvider>
              <Component {...other} tickRange={tickRange} pitchRange={pitchRange} />
            </ScaleXProvider>
          </PianoRollThemeContext.Provider>
        </ConfigProvider>
      </PianoRollStoreProvider>
    );
  };
};

export default withProvider(PianoRoll);
