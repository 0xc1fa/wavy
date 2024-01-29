import { getSelectedNotes, usePianoRollNotes } from "../../helpers/notes";
import SelectionPoint from "./SelectionPoint";
import SelectionRange from "./SelectionRange";

type SelectionRangeMode = "single" | "multiple" | "none";

export default function Selections() {
  const pianoRollNotes = usePianoRollNotes();
  const selectedNotes = getSelectedNotes(pianoRollNotes);

  const selectionRangeMode: SelectionRangeMode = selectedNotes.length > 1 ? "multiple" : "single";

  return (
    <SelectionPoint />
  )

  return selectionRangeMode === "multiple" ? (
    <SelectionRange />
  ) : selectionRangeMode === "single" ? (
    <SelectionPoint />
  ) : (
    <></>
  );
}
