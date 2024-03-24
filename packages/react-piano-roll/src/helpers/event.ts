import { PianoRollNote } from "@/types";
import React from "react";

export function getNoteObjectFromEvent(
  notes: PianoRollNote[],
  event: React.PointerEvent<Element> | React.MouseEvent<Element>,
): PianoRollNote | null {
  const noteId = getNoteIdFromEvent(event);
  const note = notes.find((note) => note.id === noteId);
  return note ? note : null;
}

export function getNoteIdFromEvent(event: React.PointerEvent<Element> | React.MouseEvent<Element>): string | null {
  const target = event.target as HTMLElement;
  const noteId = target.getAttribute("data-note-id");
  return noteId ? noteId : null;
}

export function getRelativeX(event: React.PointerEvent<Element> | React.MouseEvent<Element>): number {
  const currentTarget = event.currentTarget as HTMLElement;
  const relativeX = event.clientX - currentTarget.getBoundingClientRect().left + event.currentTarget.scrollLeft;
  return relativeX;
}

export function getRelativeY(event: React.PointerEvent<Element> | React.MouseEvent<Element>): number {
  const currentTarget = event.currentTarget as HTMLElement;
  const relativeY = event.clientY - currentTarget.getBoundingClientRect().top + event.currentTarget.scrollTop;
  return relativeY;
}
