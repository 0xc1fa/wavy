import styles from "./index.module.scss";
import { CSSProperties, forwardRef, KeyboardEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import { PianoRollNote } from "@/types/PianoRollNote";
import type { PitchRange } from "@/types/piano-roll-range";
import { baseCanvasWidth, baseCanvasHeight } from "@/helpers/conversion";
import { ConfigProvider } from "@/contexts/PianoRollConfigProvider";
import { useScrollToNote } from "@/components/handlers/useScrollToNote";
import UpperSection from "./Sections/UpperSection";
import PianoRoll from "./PianoRoll";
import LowerSection from "./Sections/LowerSection";
import { ScaleXProvider, useScaleX } from "@/contexts/ScaleXProvider";
import PianoRollThemeContext from "@/contexts/piano-roll-theme-context";
import { defaultPianoRollTheme } from "@/store/pianoRollTheme";
import { BeatPerBar, BeatUnit } from "@/types/time-signature";
import { useLeftAnchoredScale } from "@/components/handlers/useLeftAnchoredScale";
import PianoKeyboard from "./PianoKeyboard";
import { Provider as JotaiProvider } from "jotai";
import ActionBar, { ActionItem } from "./ActionButtons";
import Menu from "./Menu";
import { useNotes } from "..";
import { useHandleSpaceDown } from "./handlers/useHandleSpaceDown";
import { useEventListener } from "@/hooks/useEventListener";

export interface MidiEditorProps {
  lyric?: boolean;
  initialScrollMiddleNote?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: () => void;
  onNoteUpdate?: (notes: PianoRollNote[]) => void;
  tickRange?: [number, number];
  style?: CSSProperties;
  timeSignature?: [BeatPerBar, BeatUnit];
  pitchRange?: PitchRange;
  loading?: boolean;
  children?: React.ReactNode;
}
export const defaultProps = {
  lyric: false,
  initialScrollMiddleNote: 60,
  loading: false,
  tickRange: [480 * 4 * 0, 480 * 4 * 8] as [number, number],
  pitchRange: { startingNoteNum: 0, numOfKeys: 128 },
  timeSignature: [4, 4] as [BeatPerBar, BeatUnit],
};
type MidiEditorPropsWithDefaults = typeof defaultProps & MidiEditorProps;

export type MidiEditorHandle = {
  get currentTime(): number;
  get paused(): boolean;
  set currentTime(value: number);
  pause(): void;
  play(): void;
};
const MidiEditor = forwardRef<MidiEditorHandle, MidiEditorPropsWithDefaults>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scaleX } = useScaleX();
  const notes = useNotes();
  useScrollToNote(containerRef, props.initialScrollMiddleNote);
  useLeftAnchoredScale(containerRef);
  useHandleSpaceDown(containerRef);

  const paused = useRef(true);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => props.onNoteUpdate?.(notes), [notes]);
  useEventListener(containerRef, "play", (event) => {
    paused.current = false;
    props.onPlay?.();
  });
  useEventListener(containerRef, "pause", (event) => {
    paused.current = true;
    props.onPause?.();
  });
  useEventListener(containerRef, "timeupdate", (event) => props.onTimeUpdate?.());

  useImperativeHandle(
    ref,
    () => {
      const handles: MidiEditorHandle = {
        get currentTime() {
          return currentTime;
        },
        get paused() {
          return paused.current;
        },
        set currentTime(value: number) {
          if (value < 0) {
            value = 0;
          }
          if (value > props.tickRange![1]) {
            value = props.tickRange![1];
          }
          setCurrentTime(value);
          containerRef.current!.dispatchEvent(new CustomEvent("timeupdate"));
        },
        pause() {
          containerRef.current!.dispatchEvent(new CustomEvent("pause"));
        },
        play() {
          containerRef.current!.dispatchEvent(new CustomEvent("play"));
        },
      };
      return handles;
    },
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
          <PianoRoll attachLyric={props.lyric} currentTime={currentTime} />
        </div>
      </div>
      <LowerSection />
      <Menu />
      <ActionBar>{props.children}</ActionBar>
    </div>
  );
});

const MidiEditorWrapper = Object.assign(
  forwardRef<MidiEditorHandle, MidiEditorProps>((props, ref) => {
    const newProps = { ...defaultProps, ...props };
    return (
      <JotaiProvider>
        <ConfigProvider value={newProps}>
          <PianoRollThemeContext.Provider value={defaultPianoRollTheme()}>
            <ScaleXProvider>
              <MidiEditor {...newProps} ref={ref} />
            </ScaleXProvider>
          </PianoRollThemeContext.Provider>
        </ConfigProvider>
      </JotaiProvider>
    );
  }),
  {
    Action: ActionItem,
  },
);

export default MidiEditorWrapper;
