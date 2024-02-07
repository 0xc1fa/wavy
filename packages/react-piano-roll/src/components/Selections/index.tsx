import { getSelectedNotes, useNotes } from "../../helpers/notes";
import SelectionPoint from "./SelectionPoint";
import SelectionRange from "./SelectionRange";

type SelectionRangeMode = "single" | "multiple" | "none";

export default function Selections() {
  const notes = useNotes();
  const selectedNotes = getSelectedNotes(notes);

  const selectionRangeMode: SelectionRangeMode = selectedNotes.length > 1 ? "multiple" : "single";

  return <SelectionPoint />;

  return selectionRangeMode === "multiple" ? (
    <SelectionRange />
  ) : selectionRangeMode === "single" ? (
    <SelectionPoint />
  ) : (
    <></>
  );
}
