import useStore from "../hooks/useStore";

export default function usePianoRollClipboardHandlers() {

  const { pianoRollStore } = useStore();

  const onCopy: React.ClipboardEventHandler<HTMLDivElement> = (event) => {
    console.log('copying...')
    event.preventDefault();
    event.stopPropagation();
    const selectedNotes = pianoRollStore.pianoRollNotes.filter(note => note.isSelected);
    if (selectedNotes.length > 0) {
      // const notes = selectedNotes.map(note => {
      //   return {
      //     ...note,
      //     time: note.time - pianoRollStore.scrollLeft
      //   }
      // })
      event.clipboardData?.setData('text/plain', JSON.stringify(selectedNotes));
      navigator.clipboard.writeText(JSON.stringify(selectedNotes))
        .then(() => console.log("Object copied to clipboard"))
        .catch(err => console.error("Error copying object to clipboard: ", err));
    }
  }
  return (
    onCopy
  )
}