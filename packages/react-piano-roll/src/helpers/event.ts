import { PianoRollNote } from "@/types";
import React from "react";

export function getNoteObjectFromEvent(
  notes: PianoRollNote[],
  event: React.PointerEvent<Element> | React.MouseEvent<Element> | PointerEvent | MouseEvent,
): PianoRollNote | null {
  const noteId = getNoteIdFromEvent(event);
  const note = notes.find((note) => note.id === noteId);
  return note ? note : null;
}

export function getNoteIdFromEvent(
  event: React.PointerEvent<Element> | React.MouseEvent<Element> | PointerEvent | MouseEvent,
): string | null {
  const target = event.target as HTMLElement;
  const noteId = target.getAttribute("data-note-id");
  return noteId ? noteId : null;
}

export function getRelativeAxis(axis: "x" | "y") {
  const lookup = {
    x: { client: "clientX", bounding: "left", scroll: "scrollLeft" },
    y: { client: "clientY", bounding: "top", scroll: "scrollTop" },
  } as const;

  return (event: React.PointerEvent<Element> | React.MouseEvent<Element> | PointerEvent | MouseEvent): number => {
    const currentTarget = event.currentTarget as HTMLElement;
    const relative =
      event[lookup[axis].client] -
      currentTarget.getBoundingClientRect()[lookup[axis].bounding] +
      currentTarget[lookup[axis].scroll];
    return relative;
  };
}

export const getRelativeX = getRelativeAxis("x");
export const getRelativeY = getRelativeAxis("y");
export const getRelativeXY = (
  event: React.PointerEvent<Element> | React.MouseEvent<Element> | PointerEvent | MouseEvent,
): [number, number] => {
  return [getRelativeX(event), getRelativeY(event)];
};
