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

export function getRelativeAxis(axis: "x" | "y") {
  const lookup = {
    x: { client: "clientX", bounding: "left", scroll: "scrollLeft" },
    y: { client: "clientY", bounding: "top", scroll: "scrollTop" },
  } as const;

  return (event: React.PointerEvent<Element> | React.MouseEvent<Element>) => {
    const currentTarget = event.currentTarget as HTMLElement;
    const relative =
      event[lookup[axis].client] -
      currentTarget.getBoundingClientRect()[lookup[axis].bounding] +
      event.currentTarget[lookup[axis].scroll];
    return relative;
  };
}

export const getRelativeX = getRelativeAxis("x");
export const getRelativeY = getRelativeAxis("y");
