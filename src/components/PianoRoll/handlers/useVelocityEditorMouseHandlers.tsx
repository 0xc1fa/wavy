import { useState } from "react";
import { usePianoRollDispatch } from "../hooks/usePianoRollDispatch";
import useStore from "../hooks/useStore";

enum VelocityEditorMouseHandlerMode {
  Idle,
  SelectAndDrag,
  Pencil,
}

export default function useVelocityEditorMouseHandlers() {

  const [isDragging, setIsDragging] = useState(false);
  const [mouseHandlerMode, setMouseHandlerMode] = useState(VelocityEditorMouseHandlerMode.Pencil)
  const dispatch = usePianoRollDispatch();
  const { pianoRollStore } = useStore();

  const onPointerDown: React.PointerEventHandler = (event) => {
    const containerHeight = event.currentTarget.clientHeight
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    const offsetX = event.nativeEvent.offsetX
    const offsetY = event.nativeEvent.offsetY
    switch (mouseHandlerMode) {
      case VelocityEditorMouseHandlerMode.Pencil: {
        const notesInPosition = pianoRollStore.getNotesFromOffsetX(offsetX);
        const newVelocityInPercent = 1 - (offsetY / containerHeight)
        const newVelocity = (newVelocityInPercent * 127)
        console.log(offsetX)
        const modifiedNotes = notesInPosition.map(note => ({
          ...note,
          velocity: newVelocity,
        }))
        console.log(modifiedNotes)
        dispatch({ type: 'MODIFYING_NOTES', payload: { notes: modifiedNotes }})
        break;
      }
      case VelocityEditorMouseHandlerMode.SelectAndDrag: {
        const noteClicked = pianoRollStore.getNotesFromOffsetX(offsetX)[0];
        const noteClickedIsSelected = noteClicked?.isSelected
        if (noteClicked) {
          if (!noteClicked.isSelected) {
            dispatch({ type: 'unselectAllNotes' })
            dispatch({ type: 'setNoteAsSelected', payload: { noteId: noteClicked.id }})
          }
          dispatch({ type: 'setNoteModificationBuffer',
            payload: { initX: event.nativeEvent.offsetX, initY: event.nativeEvent.offsetY }
          })
        }
        break;
      }
    }
    dispatch({ type: 'setNoteModificationBuffer',
      payload: { initX: event.nativeEvent.offsetX, initY: event.nativeEvent.offsetY }
    })
  }

  const onPointerMove: React.PointerEventHandler = (event) => {
    if (!isDragging) {
      return;
    }
    const containerHeight = event.currentTarget.clientHeight
    const offsetX = event.nativeEvent.offsetX
    const offsetY = event.nativeEvent.offsetY
    switch (mouseHandlerMode) {
      case VelocityEditorMouseHandlerMode.Pencil: {
        const notesInPosition = pianoRollStore.getNotesFromOffsetX(offsetX);
        const newVelocityInPercent = 1 - (offsetY / containerHeight)
        const newVelocity = (newVelocityInPercent * 127)
        console.log(offsetX)
        const modifiedNotes = notesInPosition.map(note => ({
          ...note,
          velocity: newVelocity,
        }))
        console.log(modifiedNotes)
        dispatch({ type: 'MODIFYING_NOTES', payload: { notes: modifiedNotes }})
      }
    }
  }

  const onPointerUp: React.PointerEventHandler = (event) => {
    setIsDragging(false)
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}