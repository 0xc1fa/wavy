import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import useStore from "../hooks/useStore";

export function focusNote(e: Event, id: string) {
  const componentRef = e.currentTarget as HTMLDivElement;
  const childElement = componentRef.querySelector(`[data-noteid="${id}"]`) as HTMLInputElement;
  childElement!.focus();
}

export function usePianoRollNotes() {
  const { pianoRollStore } = useStore();
  return pianoRollStore.pianoRollNotes;
}

export function getSelectedNotes(notes: TrackNoteEvent[]) {
  const selectedNotes = notes.filter((note) => note.isSelected);
  return selectedNotes;
}

export function getStartingTickFromNotes(notes: TrackNoteEvent[]): number {
  const startTick = notes.reduce((min, note) => Math.min(min, note.tick), Infinity);
  return startTick;
}

export function getEndingTickFromNotes(notes: TrackNoteEvent[]) {
  const endTick = notes.reduce((max, note) => Math.max(max, note.tick + note.duration), -Infinity);
  return endTick;
}
