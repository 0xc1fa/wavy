import { useState } from "react";
import { focusNote } from "../helpers/notes";
import useStore from "./useStore";

export enum PianoRollLanesMouseHandlerMode {
  DragAndDrop,
  MarqueeSelection,
  NotesTrimming,
  NotesExtending,
  Vibrato,
  None,
}

export type PianoRollMouseHandlersStates = {
  mouseHandlerMode: PianoRollLanesMouseHandlerMode
  startingPosition: {x: number, y: number}
  ongoingPosition: {x: number, y: number}
}

export default function usePianoRollMouseHandler() {

  const { pianoRollStore, ...actions } = useStore()

  const [mouseHandlerMode, setMouseHandlerMode] = useState(PianoRollLanesMouseHandlerMode.None)
  const [startingPosition, setStartingPosition] = useState({x: 0, y: 0})
  const [ongoingPosition, setOngoingPosition] = useState({x: 0, y: 0})

  const getTickAndNoteNumFromEvent = (e: PointerEvent) => {
    const noteNum = pianoRollStore.getNoteNumFromEvent(e);
    const ticks = pianoRollStore.roundDownTickToNearestGrid(pianoRollStore.getTickFromEvent(e));
    return { ticks, noteNum }
  }

  const onPointerDown: React.PointerEventHandler = (event) => {
    console.log("pointer down")
    const setMouseHandlerModeForNote = () => {
      if (pianoRollStore.isNoteLeftMarginClicked(noteClicked!, event.nativeEvent.offsetX, event.nativeEvent.offsetY)) {
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.NotesTrimming);
      } else if (pianoRollStore.isNoteRightMarginClicked(noteClicked!, event.nativeEvent.offsetX, event.nativeEvent.offsetY)) {
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.NotesExtending);
      } else if (event.nativeEvent.altKey) {
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.Vibrato);
      } else {
        // this.oscillatorController.startOscillator(getFrequencyFromNoteNum(noteClicked!.noteNumber));
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.DragAndDrop);
      }
    }

    const setNoteSelection = () => {
      if (!noteClicked!.isSelected && !event.nativeEvent.shiftKey) {
        actions.unselectAllNotes();
        actions.setNoteAsSelected(noteClicked?.id!);
        // pianoRollStore.unselectAllNotesAndSelect(noteClicked!);
      } else {
        actions.setNoteAsSelected(noteClicked?.id!);
      }
    }

    const noteClicked = pianoRollStore.getNoteFromEvent(event.nativeEvent);
    event.currentTarget.setPointerCapture(event.nativeEvent.pointerId)
    if (noteClicked) {
      setMouseHandlerModeForNote();
      setNoteSelection();
    } else {
      if (!event.shiftKey) actions.unselectAllNotes();
      if (event.metaKey) {
        const { ticks, noteNum } = getTickAndNoteNumFromEvent(event.nativeEvent)
        actions.addNote(ticks, noteNum);
        // this.oscillatorController.startOscillator(getFrequencyFromNoteNum(newNote.noteNumber));
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.DragAndDrop);
      } else {
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.MarqueeSelection);
      }
    }
    setStartingPosition({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    setOngoingPosition({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
  }

  const onPointerMove: React.PointerEventHandler = (event) => {
    console.log(`pointer move ${PianoRollLanesMouseHandlerMode[mouseHandlerMode]} ${event.nativeEvent.offsetX} ${event.nativeEvent.offsetY}`)
    const {deltaPitch, deltaTicks, deltaY, deltaX} = calculateDeltas(event.nativeEvent)
    switch (mouseHandlerMode) {
      case PianoRollLanesMouseHandlerMode.None:
        updateCursorStyle(event.nativeEvent); break;
      case PianoRollLanesMouseHandlerMode.NotesTrimming:
        actions.trimSelectedNote(deltaTicks); break;
      case PianoRollLanesMouseHandlerMode.NotesExtending:
        actions.extendSelectedNote(deltaTicks); break;
      case PianoRollLanesMouseHandlerMode.DragAndDrop:
        actions.shiftSelectedNote(deltaPitch, deltaTicks);
        // this.oscillatorController.changeFrequency(getFrequencyFromNoteNum(this.state.getNoteFromEvent(e)!.noteNumber));
        break;
      case PianoRollLanesMouseHandlerMode.Vibrato:
        event.shiftKey ? actions.vibratoRateChangeSelectedNote(deltaY)
          : actions.vibratoDepthDelayChangeSelectedNote(deltaY, deltaX);
        break;
    }
    setOngoingPosition({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
  }

  const onPointerUp: React.PointerEventHandler = () => {
    switch (mouseHandlerMode) {
      case PianoRollLanesMouseHandlerMode.MarqueeSelection:
        actions.setNoteInMarqueeAsSelected(
          startingPosition, ongoingPosition)
        break;
      case PianoRollLanesMouseHandlerMode.DragAndDrop:
        // this.oscillatorController.stopOscillator();
        break;
      case PianoRollLanesMouseHandlerMode.Vibrato:
        break;

    }
    setMouseHandlerMode(PianoRollLanesMouseHandlerMode.None);
  }

  const onDoubleClick: React.MouseEventHandler = (event) => () => {
    const noteClicked = pianoRollStore.getNoteFromPosition(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    if (noteClicked === null) {
      console.log('no note clicked')
    } else if (event.altKey) {
      actions.toggleSelectedNoteVibratoMode()
    } else {
      focusNote(event.nativeEvent, noteClicked.id)
    }
  }

  const onWheel: React.WheelEventHandler = (event) => () => {
    if (event.ctrlKey) {
      event.preventDefault()
      const componentRef = event.currentTarget as HTMLCanvasElement;
      if (pianoRollStore.pianoLaneScaleX * (1 + event.deltaY * 0.01) * pianoRollStore.laneLength > componentRef!.clientWidth) {
        pianoRollStore.pianoLaneScaleX = pianoRollStore.pianoLaneScaleX * (1 + event.deltaY * 0.01)
      } else if (event.deltaY < 0) {
        pianoRollStore.pianoLaneScaleX = pianoRollStore.pianoLaneScaleX * (1 + event.deltaY * 0.01)
      }
    }
  }

  const updateCursorStyle = (e: PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    const noteHovered = pianoRollStore.getNoteFromPosition(e.offsetX, e.offsetY);
    const isBoundaryHovered = noteHovered &&
      (pianoRollStore.isNoteLeftMarginClicked(noteHovered, e.offsetX, e.offsetY) ||
      pianoRollStore.isNoteRightMarginClicked(noteHovered, e.offsetX, e.offsetY));
    target.style.cursor = isBoundaryHovered ? 'col-resize' : 'default';
  };

  const calculateDeltas = (e: PointerEvent) => {
    const previousNote = pianoRollStore.getNoteNumFromOffsetY(ongoingPosition.y)
    const currentNote = pianoRollStore.getNoteNumFromOffsetY(e.offsetY)
    const previousTick = pianoRollStore.getTickFromOffsetX(ongoingPosition.x)
    const currentTick = pianoRollStore.getTickFromOffsetX(e.offsetX)
    const deltaPitch = currentNote - previousNote
    const deltaTicks = currentTick - previousTick
    const deltaY = ongoingPosition.y - e.offsetY
    const deltaX = ongoingPosition.x - e.offsetX
    return {deltaPitch, deltaTicks, deltaY, deltaX}
  }

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
    }
  }

}
