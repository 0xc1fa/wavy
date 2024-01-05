import { useState } from "react";
import { usePianoRollDispatch } from "../hooks/usePianoRollDispatch";
import useStore from "../hooks/useStore";

enum VelocityEditorMouseHandlerMode {
  Idle,
  SelectAndDrag,
  Pencil,
}

export default function useVelocityEditorMouseHandlers(containerHeight: number) {

  const [isDragging, setIsDragging] = useState(false);
  const [mouseHandlerMode, setMouseHandlerMode] = useState(VelocityEditorMouseHandlerMode.Pencil)
  const dispatch = usePianoRollDispatch();
  const { pianoRollStore } = useStore();

  const onPointerDown: React.PointerEventHandler = (event) => {
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    const offsetX = event.nativeEvent.offsetX
    const offsetY = event.nativeEvent.offsetY
    switch (mouseHandlerMode) {
      case VelocityEditorMouseHandlerMode.Pencil: {
        console.log('pencil mode')
        const notesInPosition = pianoRollStore.getNotesFromOffsetX(offsetX);
        const newVelocityInPercent = offsetY / containerHeight
        const newVelocity = (newVelocityInPercent * 127)
        console.log(offsetX)
        const modifiedNotes = notesInPosition.map(note => ({
          ...note,
          velocity: newVelocity,
        }))
        console.log(modifiedNotes)
        dispatch({ type: 'modifiedNotes', payload: { notes: modifiedNotes }})
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
    const offsetX = event.nativeEvent.offsetX
    const offsetY = event.nativeEvent.offsetY
    switch (mouseHandlerMode) {
      case VelocityEditorMouseHandlerMode.Pencil: {
        console.log('pencil mode')
        const notesInPosition = pianoRollStore.getNotesFromOffsetX(offsetX);
        const newVelocityInPercent = offsetY / containerHeight
        const newVelocity = (newVelocityInPercent * 127)
        console.log(offsetX)
        const modifiedNotes = notesInPosition.map(note => ({
          ...note,
          velocity: newVelocity,
        }))
        console.log(modifiedNotes)
        dispatch({ type: 'modifiedNotes', payload: { notes: modifiedNotes }})
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