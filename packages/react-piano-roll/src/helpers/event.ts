import { TrackNoteEvent } from "@/types";
import React from "react";

export function getNoteObjectFromEvent(
  notes: TrackNoteEvent[],
  event: React.PointerEvent<Element> | React.MouseEvent<Element> | PointerEvent | MouseEvent,
): TrackNoteEvent | null {
  const noteId = getNoteIdFromEvent(event);
  const note = notes.find((note) => note.id === noteId);
  return note ? note : null;
}

export function getNoteIdFromEvent(event: React.PointerEvent<Element> | React.MouseEvent<Element> | PointerEvent | MouseEvent): string | null {
  const target = event.target as HTMLElement;
  const noteId = target.getAttribute("data-note-id");
  return noteId ? noteId : null;
}

export function getRelativeX(event: PointerEvent | MouseEvent): number {
  const currentTarget = event.currentTarget as HTMLElement;
  const relativeX = event.clientX - currentTarget.getBoundingClientRect().left + currentTarget.scrollLeft;
  console.log("relativeX" ,relativeX)
  return relativeX;
}

export function getRelativeY(event: PointerEvent | MouseEvent): number {
  const currentTarget = event.currentTarget as HTMLElement;
  const relativeY = event.clientY - currentTarget.getBoundingClientRect().top + currentTarget.scrollTop;
  console.log("relativeY", relativeY)
  return relativeY;
}
