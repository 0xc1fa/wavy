import { useEffect, useRef, useState } from "react";
import { focusNote, getSelectedNotes } from "../helpers/notes";
import { usePianoRollTransform } from "../hooks/usePianoRollTransform";
import { usePianoRollDispatch } from "../hooks/usePianoRollDispatch";
import useStore from "../hooks/useStore";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";

export enum PianoRollLanesMouseHandlerMode {
  DragAndDrop,
  MarqueeSelection,
  NotesTrimming,
  NotesExtending,
  Vibrato,
  Velocity,
  None,
}

export type PianoRollMouseHandlersStates = {
  mouseHandlerMode: PianoRollLanesMouseHandlerMode
  startingPosition: {x: number, y: number}
  ongoingPosition: {x: number, y: number}
}

export type NotesModificationBuffer = {
  notesSelected: TrackNoteEvent[]
  initY: number
  initX: number
}

export default function usePianoRollMouseHandlers() {

  const { pianoRollStore } = useStore();
  const transform = usePianoRollTransform()
  const dispatch = usePianoRollDispatch()
  // const shouldUpdateBuffer = useRef(false);

  // useEffect(() => {
  //   if (!shouldUpdateBuffer) {
  //     return;
  //   }



  // }, [pianoRollStore.pianoRollNotes])

  const [mouseHandlerMode, setMouseHandlerMode] = useState(PianoRollLanesMouseHandlerMode.None)
  const [startingPosition, setStartingPosition] = useState({x: 0, y: 0})
  const [ongoingPosition, setOngoingPosition] = useState({x: 0, y: 0})

  // const [notesModificationBuffer, setNotesModificationBuffer] = useState<NotesModificationBuffer>({
  //   notesSelected: [],
  //   initY: 0,
  //   initX: 0,
  // })

  const getTickAndNoteNumFromEvent = (e: PointerEvent) => {
    const noteNum = pianoRollStore.getNoteNumFromEvent(e);
    const ticks = pianoRollStore.roundDownTickToNearestGrid(pianoRollStore.getTickFromEvent(e));
    return { ticks, noteNum }
  }

  const onPointerDown: React.PointerEventHandler = (event) => {
    event.currentTarget.setPointerCapture(event.nativeEvent.pointerId)
    console.log("pointer down", event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    const setMouseHandlerModeForNote = () => {
      if (pianoRollStore.isNoteLeftMarginClicked(noteClicked!, event.nativeEvent.offsetX, event.nativeEvent.offsetY)) {
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.NotesTrimming);
      } else if (pianoRollStore.isNoteRightMarginClicked(noteClicked!, event.nativeEvent.offsetX, event.nativeEvent.offsetY)) {
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.NotesExtending);
      } else if (event.nativeEvent.altKey) {
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.Vibrato);
      } else if (event.nativeEvent.metaKey) {
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.Velocity);
      } else {
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.DragAndDrop);
        console.log("drag and drop")
      }
    }

    const setNoteSelection = () => {
      if (!noteClicked!.isSelected && !event.nativeEvent.shiftKey) {
        dispatch({ type: 'unselectAllNotes' })
        dispatch({ type: 'setNoteAsSelected', payload: { noteId: noteClicked?.id! }})
        // pianoRollStore.unselectAllNotesAndSelect(noteClicked!);
      } else {
        dispatch({ type: 'setNoteAsSelected', payload: { noteId: noteClicked?.id! }})
      }
    }

    const noteClicked = pianoRollStore.getNoteFromEvent(event.nativeEvent);
    event.currentTarget.setPointerCapture(event.nativeEvent.pointerId)
    console.log("note clicked", noteClicked)
    if (noteClicked) {
      dispatch({ type: 'moveNoteAsLatestModified', payload: { noteId: noteClicked.id } })
      setMouseHandlerModeForNote();
      setNoteSelection();
      dispatch({ type: 'setNoteModificationBuffer', payload: { initX: event.nativeEvent.offsetX, initY: event.nativeEvent.offsetY}})


    } else {
      if (!event.shiftKey) {
        dispatch({ type: 'unselectAllNotes' });
      }
      if (event.metaKey) {
        const { ticks, noteNum } = getTickAndNoteNumFromEvent(event.nativeEvent)
        dispatch({ type: 'addNote', payload: { ticks, noteNum }})
        // dispatch({ type: 'unsetSelectionRange' })
        dispatch({ type: 'setNoteModificationBuffer', payload: { initX: event.nativeEvent.offsetX, initY: event.nativeEvent.offsetY}})
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.DragAndDrop);
      } else {
        const selectionTicks = pianoRollStore.getTickFromOffsetX(event.nativeEvent.offsetX)
        dispatch({ type: 'setSelectionTicks', payload: { ticks: selectionTicks } })
        // dispatch({ type: 'setSelectionPoint', payload: { start: event.nativeEvent.offsetX / pianoRollStore.pixelsPerTick } })
        setMouseHandlerMode(PianoRollLanesMouseHandlerMode.MarqueeSelection);
      }
    }
    setStartingPosition({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
    setOngoingPosition({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
  }

  const onPointerMove: React.PointerEventHandler = (event) => {
    console.log(`pointer move ${PianoRollLanesMouseHandlerMode[mouseHandlerMode]} ${event.nativeEvent.offsetX} ${event.nativeEvent.offsetY}`)
    // const {deltaPitch, deltaTicks, deltaY, deltaX} = calculateDeltas(event.nativeEvent)
    const deltaY = event.nativeEvent.offsetY - pianoRollStore.noteModificationBuffer.initY
    const deltaX = event.nativeEvent.offsetX - pianoRollStore.noteModificationBuffer.initX
    const deltaTicks = pianoRollStore.getTickFromOffsetX(deltaX)
    const deltaPitch = pianoRollStore.getNoteNumFromOffsetY(event.nativeEvent.offsetY) - pianoRollStore.getNoteNumFromOffsetY(pianoRollStore.noteModificationBuffer.initY)
    switch (mouseHandlerMode) {
      case PianoRollLanesMouseHandlerMode.None:
        updateCursorStyle(event.nativeEvent);
        break;
      case PianoRollLanesMouseHandlerMode.NotesTrimming: {
        const newNotes = pianoRollStore.noteModificationBuffer.notesSelected.map(bufferedNote => ({
          ...bufferedNote,
          tick: bufferedNote.tick + deltaTicks,
          duration: Math.max(10, bufferedNote.duration - deltaTicks)
        }))
        dispatch({ type: 'modifiedNotes', payload: { notes: newNotes }});
        break;
      }
      case PianoRollLanesMouseHandlerMode.NotesExtending: {
        const newNotes = pianoRollStore.noteModificationBuffer.notesSelected.map(bufferedNote => ({
          ...bufferedNote,
          duration: Math.max(10, bufferedNote.duration + deltaTicks)
        }))
        dispatch({ type: 'modifiedNotes', payload: { notes: newNotes }})
        break;
      }
      case PianoRollLanesMouseHandlerMode.DragAndDrop: {
        const newNotes = pianoRollStore.noteModificationBuffer.notesSelected.map(bufferedNote => ({
          ...bufferedNote,
          noteNumber: Math.min(127, Math.max(0, bufferedNote.noteNumber + deltaPitch)),
          tick: bufferedNote.tick + deltaTicks
        }))
        dispatch({ type: 'modifiedNotes', payload: { notes: newNotes }});
        break;
      }
      case PianoRollLanesMouseHandlerMode.MarqueeSelection:
        break;
      case PianoRollLanesMouseHandlerMode.Vibrato:
        event.shiftKey ?
        dispatch({ type: 'vibratoRateChangeSelectedNote', payload: { rateOffset: deltaY }})
        :
        dispatch({ type: 'vibratoDepthDelayChangeSelectedNote', payload: { depthOffset: deltaY, delayOffset: deltaX }})
        break;
      case PianoRollLanesMouseHandlerMode.Velocity: {
        const newNotes = pianoRollStore.noteModificationBuffer.notesSelected.map(bufferedNote => ({
          ...bufferedNote,
          velocity: Math.max(1, Math.min(127,bufferedNote.velocity + deltaY))
        }))
        dispatch({ type: 'modifiedNotes', payload: { notes: newNotes } })
      }
    }
    setOngoingPosition({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
  }

  const onPointerUp: React.PointerEventHandler = () => {
    switch (mouseHandlerMode) {
      case PianoRollLanesMouseHandlerMode.MarqueeSelection:
        dispatch({ type: 'setNoteInMarqueeAsSelected', payload: { startingPosition, ongoingPosition }})
        break;
      case PianoRollLanesMouseHandlerMode.DragAndDrop:
        // this.oscillatorController.stopOscillator();
        break;
      case PianoRollLanesMouseHandlerMode.Vibrato:
        break;

    }
    setMouseHandlerMode(PianoRollLanesMouseHandlerMode.None);
  }

  const onDoubleClick: React.MouseEventHandler = (event) => {
    const noteClicked = pianoRollStore.getNoteFromPosition(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    if (noteClicked === null) {
      console.log('no note double clicked')
    } else if (event.altKey) {
      console.log('note double clicked with alt key')
      dispatch({ type: 'toggleSelectedNoteVibratoMode' })
    } else {
      console.log('note double clicked')
      focusNote(event.nativeEvent, noteClicked.id)
    }
  }

  const onWheel: React.WheelEventHandler = (event) => {
    console.log(pianoRollStore.pianoLaneScaleX)
    console.log('width', pianoRollStore.canvasWidth)
    console.log('calculated width', pianoRollStore.pianoLaneScaleX * pianoRollStore.laneLength)
    const minScaleX = (800 - 50) / pianoRollStore.laneLength;
    if (event.ctrlKey) {
      console.log(event.deltaX, event.deltaY)
      console.log("on wheel")
      const componentRef = event.currentTarget as HTMLCanvasElement;
      if (transform.pianoLaneScaleX * (1 + event.deltaY * 0.01) * transform.laneLength > componentRef!.clientWidth) {
        const newPianoRollScaleX = transform.pianoLaneScaleX * (1 + event.deltaY * 0.01)
        console.log('newPianoRollScaleX', newPianoRollScaleX)
        dispatch({ type: 'setPianoLaneScaleX' , payload: { pianoLaneScaleX: Math.max(minScaleX, newPianoRollScaleX) } })
      } else if (event.deltaY < 0) {
        const newPianoRollScaleX = transform.pianoLaneScaleX * (1 + event.deltaY * 0.01)
        dispatch({ type: 'setPianoLaneScaleX' , payload: { pianoLaneScaleX: Math.max(minScaleX, newPianoRollScaleX) } })
      }
      event.preventDefault()
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
