import { getSelectedNotes, usePianoRollNotes } from "../../helpers/notes";
import SelectionPoint from "./SelectionPoint";
import SelectionRange from "./SelectionRange";

type SelectionRangeMode = 'single' | 'multiple' | 'none';

export default function Selections() {

  const pianoRollNotes = usePianoRollNotes()
  const selectedNotes = getSelectedNotes(pianoRollNotes)

  const selectionRangeMode: SelectionRangeMode =
    selectedNotes.length === 1 ? 'single' :
    selectedNotes.length > 1 ? 'multiple' :
    'none'

  return (
    selectionRangeMode === 'multiple' ?
    <SelectionRange />
    : selectionRangeMode === 'none' ?
    <SelectionPoint />
    :
    <></>
  )
}