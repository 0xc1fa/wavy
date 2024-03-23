import styles from "./index.module.scss";
import { CSSProperties, forwardRef, KeyboardEvent, useEffect, useImperativeHandle, useRef } from "react";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import type { PitchRange } from "@/interfaces/piano-roll-range";
import { baseCanvasWidth, baseCanvasHeight } from "@/helpers/conversion";
import { ConfigProvider } from "@/contexts/PianoRollConfigProvider";
import { useScrollToNote } from "@/components/handlers/useScrollToNote";
import UpperSection from "./Sections/UpperSection";
import PianoRoll from "./PianoRoll";
import LowerSection from "./Sections/LowerSection";
import { ScaleXProvider, useScaleX } from "@/contexts/ScaleXProvider";
import PianoRollThemeContext from "@/contexts/piano-roll-theme-context";
import { defaultPianoRollTheme } from "@/store/pianoRollTheme";
import { BeatPerBar, BeatUnit } from "@/interfaces/time-signature";
import { useLeftAnchoredScale } from "@/components/handlers/useLeftAnchoredScale";
import PianoKeyboard from "./PianoKeyboard";
import { Provider as JotaiProvider } from "jotai";
import ActionBar, { ActionItem, ActionItemElement } from "./ActionButtons";
import Menu from "./Menu";
import { useNotes } from "..";
import { useHandleSpaceDown } from "./handlers/useHandleSpaceDown";
import { useEventListener } from "@/hooks/useEventListener";

export interface MidiEditorProps {
  playheadPosition?: number;
  attachLyric?: boolean;
  initialScrollMiddleNote?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: () => void;
  onNoteUpdate?: (notes: TrackNoteEvent[]) => void;
  tickRange?: [number, number];
  style?: CSSProperties;
  pitchRange?: PitchRange;
  beatsPerBar?: BeatPerBar;
  beatUnit?: BeatUnit;
  rendering?: boolean;
  children?: ActionItemElement | ActionItemElement[];
}
const defaultProps = {
  attachLyric: false,
  initialScrollMiddleNote: 60,
  rendering: false,
  tickRange: [480 * 4 * 0, 480 * 4 * 8] as [number, number],
  pitchRange: { startingNoteNum: 0, numOfKeys: 128 },
  beatsPerBar: 4 as BeatPerBar,
  beatUnit: 4 as BeatUnit,
};
type MidiEditorPropsWithDefaults = typeof defaultProps & MidiEditorProps;

const MidiEditor = forwardRef((props: MidiEditorPropsWithDefaults, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scaleX } = useScaleX();
  const notes = useNotes();
  useScrollToNote(containerRef, props.initialScrollMiddleNote);
  useLeftAnchoredScale(containerRef);
  useHandleSpaceDown(containerRef);

  useEffect(() => props.onNoteUpdate?.(notes), [notes]);
  useEventListener(containerRef, "play", (event) => {
    console.log("play");
    props.onPlay?.();
  });
  useEventListener(containerRef, "pause", (event) => props.onPause?.());
  useEventListener(containerRef, "timeupdate", (event) => props.onTimeUpdate?.());

  useImperativeHandle(
    ref,
    () => ({
      get currentTime() {
        return containerRef.current;
      },
      get paused() {
        return 0;
      },
    }),
    [],
  );

  return (
    <div
      className={`${styles["container"]} piano-roll`}
      ref={containerRef}
      style={
        {
          "--canvas-width": `${baseCanvasWidth(props.tickRange!) * scaleX}px`,
          "--canvas-height": `${baseCanvasHeight(props.pitchRange!.numOfKeys)}px`,
          ...props.style,
        } as React.CSSProperties
      }
      tabIndex={0}
    >
      <UpperSection />
      <div className={styles["middle-container"]}>
        <PianoKeyboard />
        <div className={styles["lane-container"]}>
          <PianoRoll attachLyric={props.attachLyric} playheadPosition={props.playheadPosition} />
        </div>
      </div>
      <LowerSection />
      <Menu />
      <ActionBar>{props.children}</ActionBar>
    </div>
  );
});

function MidiEditorWrapper(props: MidiEditorProps) {
  const newProps = { ...defaultProps, ...props };
  return (
    <JotaiProvider>
      <ConfigProvider value={newProps}>
        <PianoRollThemeContext.Provider value={defaultPianoRollTheme()}>
          <ScaleXProvider>
            <MidiEditor {...newProps} />
          </ScaleXProvider>
        </PianoRollThemeContext.Provider>
      </ConfigProvider>
    </JotaiProvider>
  );
}

MidiEditorWrapper.Action = ActionItem;
export default MidiEditorWrapper;
