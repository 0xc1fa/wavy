import { useEffect, useRef, useState } from "react";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import _ from "lodash";
import { getGridOffsetOfTick, getNearestAnchor, getNearestGridTick, getTickInGrid } from "@/helpers/grid";
import {
  getNoteFromPosition,
  getNoteNumFromEvent,
  getNoteNumFromOffsetY,
  getTickFromEvent,
  getTickFromOffsetX,
  isNoteLeftMarginClicked,
  isNoteRightMarginClicked,
  roundDownTickToNearestGrid,
} from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
import { useAtomValue, useSetAtom } from "jotai";
import { addNoteAtom, modifyingNotesAtom, notesAtom } from "@/atoms/note";
import {
  noteModificationBufferAtom,
  setNoteModificationBufferWithAllNotesAtom,
  setNoteModificationBufferWithSelectedNotesAtom,
} from "@/atoms/note-modification-buffer";
import { selectionTicksAtom } from "@/atoms/selection-ticks";
import { lastModifiedDurationAtom } from "@/atoms/last-modified";

export enum PianoRollLanesMouseHandlerMode {
  DragAndDrop,
  MarqueeSelection,
  NotesTrimming,
  NotesExtending,
  Vibrato,
  Velocity,
  None,
}

export enum DraggingGuardMode {
  UnderThreshold,
  FineTune,
  SnapToGrid,
}

export type PianoRollMouseHandlersStates = {
  mouseHandlerMode: PianoRollLanesMouseHandlerMode;
  startingPosition: { x: number; y: number };
  ongoingPosition: { x: number; y: number };
};

export type NotesModificationBuffer = {
  notesSelected: TrackNoteEvent[];
  initY: number;
  initX: number;
};

export function useHandleNoteCreationAndModification() {
  // const { pianoRollStore, dispatch } = useStore();
  const notes = useAtomValue(notesAtom);
  const noteModificationBuffer = useAtomValue(noteModificationBufferAtom);

  const addNote = useSetAtom(addNoteAtom);
  const setSelectionTicks = useSetAtom(selectionTicksAtom);
  const setNoteModificationBufferWithSelectedNotes = useSetAtom(setNoteModificationBufferWithSelectedNotesAtom);
  const setNoteModificationBufferWithAllNotes = useSetAtom(setNoteModificationBufferWithAllNotesAtom);
  const setLastModifiedDuration = useSetAtom(lastModifiedDurationAtom);
  const modifyingNotes = useSetAtom(modifyingNotesAtom);

  const { scaleX } = useScaleX();
  const { numOfKeys } = useConfig().pitchRange;

  const [cursorStyle, setCursorStyle] = useState<"default" | "col-resize">("default");
  const [mouseHandlerMode, setMouseHandlerMode] = useState(PianoRollLanesMouseHandlerMode.None);
  const guardActive = useRef(DraggingGuardMode.UnderThreshold);

  const currentPointerPos = useRef({ clientX: 0, clientY: 0 });

  useEffect(() => {
    document.body.style.cursor = cursorStyle;
  }, [cursorStyle]);

  const useHandleNoteCreationAndModificationPD: React.PointerEventHandler = (event) => {
    guardActive.current = DraggingGuardMode.UnderThreshold;
    const relativeX = getRelativeX(event);
    const relativeY = getRelativeY(event);

    const noteClicked = getNoteObjectFromEvent(notes, event);
    if (noteClicked) {
      setSelectionTicks(noteClicked.tick);
      setMouseHandlerModeForNote(event, noteClicked);
      setNoteModificationBufferWithSelectedNotes({ initX: relativeX, initY: relativeY });
    } else if (event.metaKey) {
      const { ticks, noteNum } = getTickAndNoteNumFromEvent(event.nativeEvent);
      addNote({ ticks, noteNum });
      setSelectionTicks(ticks);
      setNoteModificationBufferWithSelectedNotes({ initX: relativeX, initY: relativeY });
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.DragAndDrop);
    } else {
      const selectionTicks = getTickFromOffsetX(scaleX, relativeX);
      const snappedSelection = getNearestGridTick(scaleX, selectionTicks);
      setSelectionTicks(snappedSelection);
      setNoteModificationBufferWithAllNotes({ initX: relativeX, initY: relativeY });
    }
  };

  const useHandleNoteCreationAndModificationPM: React.PointerEventHandler = (event) => {
    const relativeX = getRelativeX(event);
    const relativeY = getRelativeY(event);
    const bufferedNotes = noteModificationBuffer.notesSelected;
    const deltaY = relativeY - noteModificationBuffer.initY;
    const deltaX = relativeX - noteModificationBuffer.initX;
    const deltaTicks = getTickFromOffsetX(scaleX, deltaX);
    const deltaPitch =
      getNoteNumFromOffsetY(numOfKeys, relativeY) - getNoteNumFromOffsetY(numOfKeys, noteModificationBuffer.initY);

    currentPointerPos.current = { clientX: event.nativeEvent.clientX, clientY: event.nativeEvent.clientY };
    if (Math.abs(deltaTicks) > getTickInGrid(scaleX)) {
      guardActive.current = DraggingGuardMode.SnapToGrid;
    } else if (Math.abs(deltaTicks) > 96 && guardActive.current < DraggingGuardMode.FineTune) {
      guardActive.current = DraggingGuardMode.FineTune;
    }

    const noteClicked = _.last(bufferedNotes);
    switch (mouseHandlerMode) {
      case PianoRollLanesMouseHandlerMode.None:
        updateCursorStyle(event.nativeEvent);
        break;
      case PianoRollLanesMouseHandlerMode.NotesTrimming: {
        let newNotes;
        if (guardActive.current === DraggingGuardMode.SnapToGrid) {
          const anchor = getNearestAnchor(
            Math.min(noteClicked!.tick + noteClicked!.duration - 1, noteClicked!.tick + deltaTicks),
            scaleX,
            getGridOffsetOfTick(noteClicked!.tick, scaleX),
          );
          if (anchor.proximity) {
            newNotes = bufferedNotes.map((bufferedNote) => ({
              ...bufferedNote,
              tick: anchor.anchor - _.last(bufferedNotes)!.tick + bufferedNote.tick,
              duration:
                bufferedNote.duration +
                (bufferedNote.tick - (anchor.anchor - _.last(bufferedNotes)!.tick + bufferedNote.tick)),
            }));
            setLastModifiedDuration(
              _.last(bufferedNotes)!.duration +
                (_.last(bufferedNotes)!.tick -
                  (anchor.anchor - _.last(bufferedNotes)!.tick + _.last(bufferedNotes)!.tick)),
            );
          } else {
            return;
          }
        } else if (guardActive.current === DraggingGuardMode.FineTune) {
          newNotes = bufferedNotes.map((bufferedNote) => ({
            ...bufferedNote,
            tick: Math.min(bufferedNote.tick + bufferedNote.duration - 1, bufferedNote.tick + deltaTicks),
            duration: bufferedNote.duration - deltaTicks,
          }));
          setLastModifiedDuration(_.last(bufferedNotes)!.duration - deltaTicks);
        } else {
          newNotes = bufferedNotes;
        }
        if (guardActive.current) {
          setSelectionTicks(_.last(newNotes)!.tick);
        }
        modifyingNotes(newNotes);
        break;
      }
      case PianoRollLanesMouseHandlerMode.NotesExtending: {
        let newNotes;
        if (guardActive.current === DraggingGuardMode.SnapToGrid) {
          const anchor = getNearestAnchor(
            noteClicked!.tick + noteClicked!.duration + deltaTicks,
            scaleX,
            getGridOffsetOfTick(noteClicked!.tick + noteClicked!.duration, scaleX),
          );
          if (anchor.proximity) {
            newNotes = bufferedNotes.map((bufferedNote) => ({
              ...bufferedNote,
              duration:
                anchor.anchor - _.last(bufferedNotes)!.tick - _.last(bufferedNotes)!.duration + bufferedNote.duration,
            }));
            setLastModifiedDuration(
              anchor.anchor -
                _.last(bufferedNotes)!.tick -
                _.last(bufferedNotes)!.duration +
                _.last(bufferedNotes)!.duration,
            );
          } else {
            return;
          }
        } else if (guardActive.current === DraggingGuardMode.FineTune) {
          newNotes = bufferedNotes.map((bufferedNote) => ({
            ...bufferedNote,
            duration: bufferedNote.duration + deltaTicks,
          }));
          setLastModifiedDuration(_.last(bufferedNotes)!.duration + deltaTicks)
        } else {
          newNotes = bufferedNotes;
          setLastModifiedDuration(_.last(bufferedNotes)!.duration)
        }
        if (guardActive.current) {
          setSelectionTicks(Math.max(_.last(newNotes)!.tick + _.last(newNotes)!.duration, _.last(newNotes)!.tick))
        }
        modifyingNotes(newNotes);
        break;
      }
      case PianoRollLanesMouseHandlerMode.DragAndDrop: {
        let newNotes;
        if (guardActive.current === DraggingGuardMode.SnapToGrid) {
          const anchor = getNearestAnchor(
            noteClicked!.tick + deltaTicks,
            scaleX,
            getGridOffsetOfTick(noteClicked!.tick, scaleX),
          );
          if (anchor.proximity) {
            newNotes = bufferedNotes.map((bufferedNote) => ({
              ...bufferedNote,
              noteNumber: bufferedNote.noteNumber + deltaPitch,
              tick: anchor.anchor - _.last(bufferedNotes)!.tick + bufferedNote.tick,
            }));
          } else {
            return;
          }
        } else if (guardActive.current === DraggingGuardMode.FineTune) {
          newNotes = bufferedNotes.map((bufferedNote) => ({
            ...bufferedNote,
            noteNumber: bufferedNote.noteNumber + deltaPitch,
            tick: bufferedNote.tick + deltaTicks,
          }));
        } else {
          newNotes = bufferedNotes.map((bufferedNote) => ({
            ...bufferedNote,
            noteNumber: bufferedNote.noteNumber + deltaPitch,
          }));
        }
        if (guardActive.current) {
          setSelectionTicks(_.last(newNotes)!.tick)
        }
        modifyingNotes(newNotes)
        break;
      }
      // case PianoRollLanesMouseHandlerMode.Vibrato:
      //   event.shiftKey
      //     ? dispatch({ type: "VIBRATO_RATE_CHANGE_SELECTED_NOTE", payload: { rateOffset: deltaY } })
      //     : dispatch({
      //         type: "VIBRATO_DEPTH_DELAY_CHANGE_SELECTED_NOTE",
      //         payload: { depthOffset: deltaY, delayOffset: deltaX },
      //       });
        break;
    }
  };

  const useHandleNoteCreationAndModificationPU: React.PointerEventHandler = () => {
    setMouseHandlerMode(PianoRollLanesMouseHandlerMode.None);
  };

  const updateCursorStyle = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    const noteHovered = getNoteFromPosition(scaleX, numOfKeys, notes, [e.offsetX, e.offsetY]);
    const isBoundaryHovered =
      noteHovered &&
      (isNoteLeftMarginClicked(numOfKeys, scaleX, noteHovered, {
        x: e.offsetX,
        y: e.offsetY,
      }) ||
        isNoteRightMarginClicked(numOfKeys, scaleX, noteHovered, {
          x: e.offsetX,
          y: e.offsetY,
        }));
    setCursorStyle(isBoundaryHovered ? "col-resize" : "default");
  };

  const getTickAndNoteNumFromEvent = (e: PointerEvent) => {
    const noteNum = getNoteNumFromEvent(numOfKeys, e);
    const ticks = roundDownTickToNearestGrid(getTickFromEvent(scaleX, e), scaleX);
    return { ticks, noteNum };
  };

  const setMouseHandlerModeForNote = (event: React.PointerEvent<Element>, noteClicked: TrackNoteEvent) => {
    const relativeX = getRelativeX(event);
    const relativeY = getRelativeY(event);
    if (isNoteRightMarginClicked(numOfKeys, scaleX, noteClicked!, [relativeX, relativeY])) {
      setSelectionTicks(noteClicked.tick + noteClicked.duration)
      // dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: noteClicked.tick + noteClicked.duration } });
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.NotesExtending);
    } else if (
      isNoteLeftMarginClicked(numOfKeys, scaleX, noteClicked!, {
        x: relativeX,
        y: relativeY,
      })
    ) {
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.NotesTrimming);
    } else if (event.nativeEvent.altKey) {
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.Vibrato);
    } else if (event.nativeEvent.metaKey) {
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.Velocity);
    } else {
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.DragAndDrop);
    }
  };

  return {
    useHandleNoteCreationAndModificationPD,
    useHandleNoteCreationAndModificationPM,
    useHandleNoteCreationAndModificationPU,
  };
}
