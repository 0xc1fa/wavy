import { getSelectedNotes, useNotes } from "../../helpers/notes";
import SelectionPoint from "./SelectionPoint";

type SelectionRangeMode = "single" | "multiple" | "none";

export default function Selections() {
  const notes = useNotes();
  const selectedNotes = getSelectedNotes(notes);

  return <SelectionPoint />;

}
