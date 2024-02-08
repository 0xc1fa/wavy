import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import useStore from "../hooks/useStore";

export function focusNote(e: Event, id: string) {
  const componentRef = e.currentTarget as HTMLDivElement;
  const childElement = componentRef.querySelector(`[data-noteid="${id}"]`) as HTMLInputElement;
  childElement!.focus();
}

export function useNotes() {
  const { pianoRollStore } = useStore();
  return pianoRollStore.notes;
}

export function getStartingTickFromNotes(notes: TrackNoteEvent[]): number {
  const startTick = notes.reduce((min, note) => Math.min(min, note.tick), Infinity);
  return startTick;
}

export function getEndingTickFromNotes(notes: TrackNoteEvent[]) {
  const endTick = notes.reduce((max, note) => Math.max(max, note.tick + note.duration), -Infinity);
  return endTick;
}

export function getSelectionRangeWithSelectedNotes(selectedNotes: TrackNoteEvent[], selectionRange: [number, number]): [number, number] {
  console.log(selectedNotes)

  const startingNoteTick = getStartingTickFromNotes(selectedNotes);
  const endingNoteTick = getEndingTickFromNotes(selectedNotes);
  console.log('startingNoteTick', startingNoteTick);
  console.log('endingNoteTick', endingNoteTick);
  console.log('selectionRange', selectionRange);
  return [Math.min(startingNoteTick, selectionRange[0]), Math.max(endingNoteTick, selectionRange[1])];
}