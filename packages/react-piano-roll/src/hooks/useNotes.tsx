import { notesAtom } from "@/atoms/note";
import { useAtom } from "jotai";

export function useNotes() {
  const [notes] = useAtom(notesAtom);
  return notes;
}
