import { useRef, useState } from "react";
import { focusNote } from "../helpers/notes";
import useStore from "../hooks/useStore";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import _ from "lodash";
import { getGridOffsetOfTick, getNearestAnchor, getNearestGridTick, getTickInGrid } from "@/helpers/grid";
import { getNoteFromEvent, getNoteFromPosition, getNoteNumFromOffsetY, getTickFromOffsetX } from "@/helpers/conversion";
import { useConfig } from "@/components";

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

export default function usePianoRollMouseHandlers() {
  const { pianoRollStore, dispatch } = useStore();
  const { numOfKeys } = useConfig().range;

  const [mouseHandlerMode, setMouseHandlerMode] = useState(PianoRollLanesMouseHandlerMode.None);
  const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });
  const [ongoingPosition, setOngoingPosition] = useState({ x: 0, y: 0 });
  const guardActive = useRef(DraggingGuardMode.UnderThreshold);

  const onPointerDown: React.PointerEventHandler = (event) => {
    event.currentTarget.setPointerCapture(event.nativeEvent.pointerId);
    guardActive.current = DraggingGuardMode.UnderThreshold;

    const noteClicked = getNoteFromEvent(
      numOfKeys,
      pianoRollStore.pianoLaneScaleX,
      pianoRollStore.pianoRollNotes,
      event.nativeEvent,
    );
    setNoteSelection(event, noteClicked);
    if (noteClicked) {
      dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: noteClicked.tick } });
      dispatch({ type: "MOVE_NOTE_AS_LATEST_MODIFIED", payload: { noteId: noteClicked.id } });
      setMouseHandlerModeForNote(event, noteClicked);
      dispatch({
        type: "SET_NOTE_MODIFICATION_BUFFER_WITH_SELECTED_NOTE",
        payload: { initX: event.nativeEvent.offsetX, initY: event.nativeEvent.offsetY },
      });
    } else if (event.metaKey) {
      const { ticks, noteNum } = getTickAndNoteNumFromEvent(event.nativeEvent);
      dispatch({ type: "ADD_NOTE", payload: { ticks, noteNum } });
      dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: ticks } });
      dispatch({
        type: "SET_NOTE_MODIFICATION_BUFFER_WITH_SELECTED_NOTE",
        payload: { initX: event.nativeEvent.offsetX, initY: event.nativeEvent.offsetY },
      });
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.DragAndDrop);
    } else {
      const selectionTicks = getTickFromOffsetX(event.nativeEvent.offsetX, pianoRollStore.pianoLaneScaleX);
      const snappedSelection = getNearestGridTick(selectionTicks, pianoRollStore.pianoLaneScaleX);
      dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: snappedSelection } });
      dispatch({
        type: "SET_NOTE_MODIFICATION_BUFFER_WITH_ALL_NOTE",
        payload: { initX: event.nativeEvent.offsetX, initY: event.nativeEvent.offsetY },
      });
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.MarqueeSelection);
    }
    setStartingPosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
    setOngoingPosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
  };

  const onPointerMove: React.PointerEventHandler = (event) => {
    const bufferedNotes = pianoRollStore.noteModificationBuffer.notesSelected;
    const deltaY = event.nativeEvent.offsetY - pianoRollStore.noteModificationBuffer.initY;
    const deltaX = event.nativeEvent.offsetX - pianoRollStore.noteModificationBuffer.initX;
    const deltaTicks = getTickFromOffsetX(deltaX, pianoRollStore.pianoLaneScaleX);
    const deltaPitch =
      getNoteNumFromOffsetY(numOfKeys, event.nativeEvent.offsetY) -
      getNoteNumFromOffsetY(numOfKeys, pianoRollStore.noteModificationBuffer.initY);
    if (Math.abs(deltaTicks) > getTickInGrid(pianoRollStore.pianoLaneScaleX)) {
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
            pianoRollStore.pianoLaneScaleX,
            getGridOffsetOfTick(noteClicked!.tick, pianoRollStore.pianoLaneScaleX),
          );
          if (anchor.proximity) {
            newNotes = bufferedNotes.map((bufferedNote) => ({
              ...bufferedNote,
              tick: anchor.anchor - _.last(bufferedNotes)!.tick + bufferedNote.tick,
              duration:
                bufferedNote.duration +
                (bufferedNote.tick - (anchor.anchor - _.last(bufferedNotes)!.tick + bufferedNote.tick)),
            }));
          } else {
            return;
          }
        } else if (guardActive.current === DraggingGuardMode.FineTune) {
          newNotes = bufferedNotes.map((bufferedNote) => ({
            ...bufferedNote,
            tick: Math.min(bufferedNote.tick + bufferedNote.duration - 1, bufferedNote.tick + deltaTicks),
            duration: bufferedNote.duration - deltaTicks,
          }));
        } else {
          newNotes = bufferedNotes;
        }
        if (guardActive.current) {
          dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: _.last(newNotes)!.tick } });
        }
        dispatch({ type: "MODIFYING_NOTES", payload: { notes: newNotes } });
        break;
      }
      case PianoRollLanesMouseHandlerMode.NotesExtending: {
        let newNotes;
        if (guardActive.current === DraggingGuardMode.SnapToGrid) {
          const anchor = getNearestAnchor(
            noteClicked!.tick + noteClicked!.duration + deltaTicks,
            pianoRollStore.pianoLaneScaleX,
            getGridOffsetOfTick(noteClicked!.tick + noteClicked!.duration, pianoRollStore.pianoLaneScaleX),
          );
          if (anchor.proximity) {
            newNotes = bufferedNotes.map((bufferedNote) => ({
              ...bufferedNote,
              duration:
                anchor.anchor - _.last(bufferedNotes)!.tick - _.last(bufferedNotes)!.duration + bufferedNote.duration,
            }));
          } else {
            return;
          }
        } else if (guardActive.current === DraggingGuardMode.FineTune) {
          newNotes = bufferedNotes.map((bufferedNote) => ({
            ...bufferedNote,
            duration: !guardActive.current ? bufferedNote.duration : bufferedNote.duration + deltaTicks,
          }));
        } else {
          newNotes = bufferedNotes;
        }
        if (guardActive.current) {
          dispatch({
            type: "SET_SELECTION_TICKS",
            payload: { ticks: _.last(newNotes)!.tick + _.last(newNotes)!.duration },
          });
        }
        dispatch({ type: "MODIFYING_NOTES", payload: { notes: newNotes } });
        break;
      }
      case PianoRollLanesMouseHandlerMode.DragAndDrop: {
        let newNotes;
        if (guardActive.current === DraggingGuardMode.SnapToGrid) {
          const anchor = getNearestAnchor(
            noteClicked!.tick + deltaTicks,
            pianoRollStore.pianoLaneScaleX,
            getGridOffsetOfTick(noteClicked!.tick, pianoRollStore.pianoLaneScaleX),
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
          dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: _.last(newNotes)!.tick } });
        }
        dispatch({ type: "MODIFYING_NOTES", payload: { notes: newNotes } });
        break;
      }
      case PianoRollLanesMouseHandlerMode.MarqueeSelection:
        dispatch({
          type: "MODIFYING_NOTES",
          payload: {
            notes: bufferedNotes.map((note) => ({
              ...note,
              isSelected: pianoRollStore.inMarquee(note, { startingPosition, ongoingPosition })
                ? !note.isSelected
                : note.isSelected,
            })),
          },
        });
        break;
      case PianoRollLanesMouseHandlerMode.Vibrato:
        event.shiftKey
          ? dispatch({ type: "VIBRATO_RATE_CHANGE_SELECTED_NOTE", payload: { rateOffset: deltaY } })
          : dispatch({
              type: "VIBRATO_DEPTH_DELAY_CHANGE_SELECTED_NOTE",
              payload: { depthOffset: deltaY, delayOffset: deltaX },
            });
        break;
      case PianoRollLanesMouseHandlerMode.Velocity: {
        const newNotes = bufferedNotes.map((bufferedNote) => ({
          ...bufferedNote,
          velocity: bufferedNote.velocity - deltaY / 3,
        }));
        dispatch({ type: "MODIFYING_NOTES", payload: { notes: newNotes } });
      }
    }
    setOngoingPosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
  };

  const onPointerUp: React.PointerEventHandler = () => {
    setMouseHandlerMode(PianoRollLanesMouseHandlerMode.None);
  };

  const onDoubleClick: React.MouseEventHandler = (event) => {
    const noteClicked = getNoteFromPosition(pianoRollStore.pianoLaneScaleX, numOfKeys, pianoRollStore.pianoRollNotes, [
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
    ]);
    if (noteClicked && event.altKey) {
      dispatch({ type: "TOGGLE_SELECTED_NOTE_VIBRATO_MODE" });
    } else if (noteClicked) {
      focusNote(event.nativeEvent, noteClicked.id);
    }
  };

  const onWheel: React.WheelEventHandler = (event) => {
    if (!event.ctrlKey) {
      return;
    }
    event.preventDefault();
    const minScaleX = (800 - 50) / pianoRollStore.laneLength;
    const multiplier = -0.01;
    const newPianoRollScaleX = pianoRollStore.pianoLaneScaleX * (1 + event.deltaY * multiplier);
    dispatch({
      type: "SET_PIANO_LANE_SCALE_X",
      payload: { pianoLaneScaleX: Math.max(minScaleX, newPianoRollScaleX) },
    });
  };

  const updateCursorStyle = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    const noteHovered = getNoteFromPosition(pianoRollStore.pianoLaneScaleX, numOfKeys, pianoRollStore.pianoRollNotes, [
      e.offsetX,
      e.offsetY,
    ]);
    const isBoundaryHovered =
      noteHovered &&
      (pianoRollStore.isNoteLeftMarginClicked(noteHovered, e.offsetX, e.offsetY) ||
        pianoRollStore.isNoteRightMarginClicked(noteHovered, e.offsetX, e.offsetY));
    target.style.cursor = isBoundaryHovered ? "col-resize" : "default";
  };

  const getTickAndNoteNumFromEvent = (e: PointerEvent) => {
    const noteNum = pianoRollStore.getNoteNumFromEvent(e);
    const ticks = pianoRollStore.roundDownTickToNearestGrid(pianoRollStore.getTickFromEvent(e));
    return { ticks, noteNum };
  };

  const setMouseHandlerModeForNote = (event: React.PointerEvent<Element>, noteClicked: TrackNoteEvent) => {
    if (pianoRollStore.isNoteLeftMarginClicked(noteClicked!, event.nativeEvent.offsetX, event.nativeEvent.offsetY)) {
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.NotesTrimming);
    } else if (
      pianoRollStore.isNoteRightMarginClicked(noteClicked!, event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    ) {
      dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: noteClicked.tick + noteClicked.duration } });
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.NotesExtending);
    } else if (event.nativeEvent.altKey) {
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.Vibrato);
    } else if (event.nativeEvent.metaKey) {
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.Velocity);
    } else {
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.DragAndDrop);
    }
  };

  const setNoteSelection = (event: React.PointerEvent<Element>, noteClicked: TrackNoteEvent | null) => {
    if (!noteClicked) {
      if (!event.shiftKey) {
        dispatch({ type: "UNSELECTED_ALL_NOTES" });
      }
    } else if (!noteClicked.isSelected && !event.shiftKey) {
      dispatch({ type: "UNSELECTED_ALL_NOTES" });
      dispatch({
        type: "SET_NOTE_AS_SELECTED",
        payload: { noteId: noteClicked?.id! },
      });
    } else {
      dispatch({
        type: "SET_NOTE_AS_SELECTED",
        payload: { noteId: noteClicked?.id! },
      });
    }
  };

  return {
    pianoRollMouseHandlers: {
      onPointerDown,
      onDoubleClick,
      onPointerMove,
      onPointerUp,
      onWheel,
    },
    pianoRollMouseHandlersStates: {
      mouseHandlerMode,
      startingPosition,
      ongoingPosition,
    },
  };
}
