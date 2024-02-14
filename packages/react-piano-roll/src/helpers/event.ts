import { TrackNoteEvent } from "@/types";
import React from "react";

export function getNoteObjectFromEvent(
  notes: TrackNoteEvent[],
  event: React.PointerEvent<Element> | React.MouseEvent<Element>,
): TrackNoteEvent | null {
  const noteId = getNoteIdFromEvent(event);
  const note = notes.find((note) => note.id === noteId);
  return note ? note : null;
}

export function getNoteIdFromEvent(event: React.PointerEvent<Element> | React.MouseEvent<Element>): string | null {
  const target = event.target as HTMLElement;
  const noteId = target.getAttribute("data-note-id");
  return noteId ? noteId : null;
}

export function getRelativeX(event: PointerEvent | MouseEvent): number {
  const currentTarget = event.currentTarget as HTMLElement;
  const relativeX = event.clientX - currentTarget.getBoundingClientRect().left + currentTarget.scrollLeft;
  return relativeX;
}

export function getRelativeY(event: PointerEvent | MouseEvent): number {
  const currentTarget = event.currentTarget as HTMLElement;
  const relativeY = event.clientY - currentTarget.getBoundingClientRect().top + currentTarget.scrollTop;
  return relativeY;
}
