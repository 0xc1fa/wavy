import { useRef, useState } from "react";
import { focusNote } from "../helpers/notes";
import { usePianoRollTransform } from "../hooks/usePianoRollTransform";
import { usePianoRollDispatch } from "../hooks/usePianoRollDispatch";
import useStore from "../hooks/useStore";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import { clampDuration, clampTick, clampTo7BitRange, clampTo7BitRangeWithMinOne } from "@/helpers/number";
import _ from "lodash";
import { getGridOffsetOfTick, getNearestAnchor, getNearestGridTick, getNearestGridTickWithOffset, getTickInGrid } from "@/helpers/grid";

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
  const { pianoRollStore } = useStore();
  const transform = usePianoRollTransform();
  const dispatch = usePianoRollDispatch();

  const [mouseHandlerMode, setMouseHandlerMode] = useState(PianoRollLanesMouseHandlerMode.None);
  const [startingPosition, setStartingPosition] = useState({ x: 0, y: 0 });
  const [ongoingPosition, setOngoingPosition] = useState({ x: 0, y: 0 });
  const guardActive = useRef(DraggingGuardMode.UnderThreshold);

  const onPointerDown: React.PointerEventHandler = (event) => {
    event.currentTarget.setPointerCapture(event.nativeEvent.pointerId);
    guardActive.current = DraggingGuardMode.UnderThreshold;

    const noteClicked = pianoRollStore.getNoteFromEvent(event.nativeEvent);
    setNoteSelection(event, noteClicked);
    if (noteClicked) {
      dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: noteClicked.tick } });
      dispatch({ type: "MOVE_NOTE_AS_LATEST_MODIFIED", payload: { noteId: noteClicked.id } });
      setMouseHandlerModeForNote(event, noteClicked);
      dispatch({
        type: "SET_NOTE_MODIFICATION_BUFFER",
        payload: { initX: event.nativeEvent.offsetX, initY: event.nativeEvent.offsetY },
      });
    } else if (event.metaKey) {
      // note creation
      const { ticks, noteNum } = getTickAndNoteNumFromEvent(event.nativeEvent);
      dispatch({ type: "ADD_NOTE", payload: { ticks, noteNum } });
      dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: ticks } });
      // dispatch({ type: 'unsetSelectionRange' })
      dispatch({
        type: "SET_NOTE_MODIFICATION_BUFFER",
        payload: { initX: event.nativeEvent.offsetX, initY: event.nativeEvent.offsetY },
      });
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.DragAndDrop);
    } else {
      // no note clicked
      const selectionTicks = pianoRollStore.getTickFromOffsetX(event.nativeEvent.offsetX);
      dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: selectionTicks } });
      setMouseHandlerMode(PianoRollLanesMouseHandlerMode.MarqueeSelection);
    }
    setStartingPosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
    setOngoingPosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
  };

  const onPointerMove: React.PointerEventHandler = (event) => {
    // const noteClicked = pianoRollStore.getNoteFromEvent(event.nativeEvent);
    // if (noteClicked && mouseHandlerMode !== PianoRollLanesMouseHandlerMode.None) {
    //   dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: noteClicked.tick } });
    // }
    const bufferedNotes = pianoRollStore.noteModificationBuffer.notesSelected;
    const deltaY = event.nativeEvent.offsetY - pianoRollStore.noteModificationBuffer.initY;
    const deltaX = event.nativeEvent.offsetX - pianoRollStore.noteModificationBuffer.initX;
    const deltaTicks = pianoRollStore.getTickFromOffsetX(deltaX);
    const deltaPitch =
      pianoRollStore.getNoteNumFromOffsetY(event.nativeEvent.offsetY) -
      pianoRollStore.getNoteNumFromOffsetY(pianoRollStore.noteModificationBuffer.initY);
    if (Math.abs(deltaTicks) > getTickInGrid(pianoRollStore.pianoLaneScaleX)) {
      guardActive.current = DraggingGuardMode.SnapToGrid;
    } else if (Math.abs(deltaTicks) > 96 && guardActive.current < DraggingGuardMode.FineTune) {
      guardActive.current = DraggingGuardMode.FineTune;
    }

    const noteClicked = _.last(bufferedNotes);
    console.log("gaurd", guardActive.current)
    console.log("tick in grid", getTickInGrid(pianoRollStore.pianoLaneScaleX))
    console.log("delta ticks", Math.abs(deltaTicks))
    // console.log("anchor", getNearestAnchor(Math.min(noteClicked!.tick + noteClicked!.duration - 1, noteClicked!.tick + deltaTicks), pianoRollStore.pianoLaneScaleX, getGridOffsetOfTick(noteClicked!.tick, pianoRollStore.pianoLaneScaleX)))
    // console.log("offset", getGridOffsetOfTick(noteClicked!.tick, pianoRollStore.pianoLaneScaleX))
    // console.log("tickingrid", getTickInGrid(pianoRollStore.pianoLaneScaleX))
    switch (mouseHandlerMode) {
      case PianoRollLanesMouseHandlerMode.None:
        updateCursorStyle(event.nativeEvent);
        break;
      case PianoRollLanesMouseHandlerMode.NotesTrimming: {
        let newNotes;
        if (guardActive.current === DraggingGuardMode.SnapToGrid) {
          const anchor = getNearestAnchor(Math.min(noteClicked!.tick + noteClicked!.duration - 1, noteClicked!.tick + deltaTicks), pianoRollStore.pianoLaneScaleX, getGridOffsetOfTick(noteClicked!.tick, pianoRollStore.pianoLaneScaleX));
          if (anchor.proximity) {
            newNotes = bufferedNotes.map((bufferedNote) => ({
              ...bufferedNote,
              tick: anchor.anchor,
              duration: bufferedNote.duration + (bufferedNote.tick - anchor.anchor),
            }));
          } else {
            return
          }
        } else if (guardActive.current === DraggingGuardMode.FineTune) {
          newNotes = bufferedNotes.map((bufferedNote) => ({
            ...bufferedNote,
            tick: Math.min(bufferedNote.tick + bufferedNote.duration - 1, bufferedNote.tick + deltaTicks),
            duration: bufferedNote.duration - deltaTicks,
          }));
        } else {
          newNotes = bufferedNotes
        }
        if (guardActive.current) {
          // dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: clampTick(Math.min(noteClicked!.tick + noteClicked!.duration - 1, noteClicked!.tick + deltaTicks)) } });
          dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: _.last(newNotes)!.tick } });
        }
        dispatch({ type: "MODIFYING_NOTES", payload: { notes: newNotes } });
        break;
      }
      case PianoRollLanesMouseHandlerMode.NotesExtending: {
        let newNotes;
        if (guardActive.current === DraggingGuardMode.SnapToGrid) {
          const anchor = getNearestAnchor(noteClicked!.tick + noteClicked!.duration + deltaTicks, pianoRollStore.pianoLaneScaleX, getGridOffsetOfTick(noteClicked!.tick + noteClicked!.duration, pianoRollStore.pianoLaneScaleX));
          if (anchor.proximity) {
            newNotes = bufferedNotes.map((bufferedNote) => ({
              ...bufferedNote,
              duration: anchor.anchor - bufferedNote.tick,
            }));
          } else {
            return
          }
        } else if (guardActive.current === DraggingGuardMode.FineTune) {
          newNotes = bufferedNotes.map((bufferedNote) => ({
            ...bufferedNote,
            duration: !guardActive.current ? bufferedNote.duration : bufferedNote.duration + deltaTicks,
          }));
        } else {
          newNotes = bufferedNotes
        }
        if (guardActive.current) {
          dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: _.last(newNotes)!.tick + _.last(newNotes)!.duration } });
          // dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: Math.max(noteClicked!.tick + 1, clampTick(noteClicked!.tick + noteClicked!.duration + deltaTicks)) } });
        }
        dispatch({ type: "MODIFYING_NOTES", payload: { notes: newNotes } });
        break;
      }
      case PianoRollLanesMouseHandlerMode.DragAndDrop: {
        // const newNotes = bufferedNotes.map((bufferedNote) => ({
        //   ...bufferedNote,
        //   noteNumber: bufferedNote.noteNumber + deltaPitch,
        //   tick: !guardActive.current ? bufferedNote.tick : bufferedNote.tick + deltaTicks,
        // }));
        let newNotes;
        if (guardActive.current === DraggingGuardMode.SnapToGrid) {
          const anchor = getNearestAnchor(noteClicked!.tick + deltaTicks, pianoRollStore.pianoLaneScaleX, getGridOffsetOfTick(noteClicked!.tick, pianoRollStore.pianoLaneScaleX));
          if (anchor.proximity) {
            newNotes = bufferedNotes.map((bufferedNote) => ({
              ...bufferedNote,
              noteNumber: bufferedNote.noteNumber + deltaPitch,
              tick: anchor.anchor,
            }));
          } else {
            return
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
          // dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: clampTick(noteClicked!.tick + deltaTicks) } });
        }
        dispatch({ type: "MODIFYING_NOTES", payload: { notes: newNotes } });
        break;
      }
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
    switch (mouseHandlerMode) {
      case PianoRollLanesMouseHandlerMode.MarqueeSelection:
        dispatch({
          type: "SET_NOTE_IN_MARQUEE_AS_SELECTED",
          payload: { startingPosition, ongoingPosition },
        });
        break;
    }
    setMouseHandlerMode(PianoRollLanesMouseHandlerMode.None);
  };

  const onDoubleClick: React.MouseEventHandler = (event) => {
    const noteClicked = pianoRollStore.getNoteFromPosition(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
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
    // TODO: change the 800 to adaptive length
    const minScaleX = (800 - 50) / pianoRollStore.laneLength;
    const multiplier = 0.01;
    const newPianoRollScaleX = transform.pianoLaneScaleX * (1 + event.deltaY * multiplier);
    dispatch({
      type: "SET_PIANO_LANE_SCALE_X",
      payload: { pianoLaneScaleX: Math.max(minScaleX, newPianoRollScaleX) },
    });
  };

  const updateCursorStyle = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    const noteHovered = pianoRollStore.getNoteFromPosition(e.offsetX, e.offsetY);
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
      dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: noteClicked.tick + noteClicked.duration } })
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
