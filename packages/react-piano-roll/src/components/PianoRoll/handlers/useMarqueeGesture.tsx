import { notesAtom, selectedNoteIdsAtom, selectedNotesAtom } from "@/store/note";
import { noteModificationBufferAtom } from "@/store/note-modification-buffer";
import { selectionRangeAtom, selectionTicksAtom } from "@/store/selection-ticks";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { inMarquee } from "@/helpers/conversion";
import { getNoteObjectFromEvent, getRelativeX, getRelativeXY, getRelativeY } from "@/helpers/event";
import { getSelectionRangeWithSelectedNotes } from "@/helpers/notes";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { RefObject, useState } from "react";
import { create } from "mutative";
import { useEventListener } from "@/hooks/useEventListener";

export type MarqueePosition = [{ x: number; y: number }, { x: number; y: number }];
function useMarqueeGeometry() {
  const [marqueeGeometry, setMarqueeGeometry] = useState<MarqueePosition | null>(null);

  function setMarqueeEndByEvent(event: PointerEvent) {
    const eventXY = getRelativeXY(event);
    if (!marqueeGeometry) {
      setMarqueeGeometry([eventXY, eventXY].map(([x, y]) => ({ x, y })) as MarqueePosition);
    } else {
      setMarqueeGeometry((prev) => [prev![0], { x: eventXY[0], y: eventXY[1] }]);
    }
  }

  return { marqueeGeometry, setMarqueeEndByEvent, clearMarquee: () => setMarqueeGeometry(null) };
}

export function useMarqueeGesture<T extends HTMLElement>(ref: RefObject<T>) {
  const notes = useAtomValue(notesAtom);
  const selectedNotes = useAtomValue(selectedNotesAtom);
  const selectionRange = useAtomValue(selectionRangeAtom);
  const setSelectionTicks = useSetAtom(selectionTicksAtom);
  const noteModificationBuffer = useAtomValue(noteModificationBufferAtom);
  const [selectedNoteIds, setSelectedNoteIds] = useAtom(selectedNoteIdsAtom);
  const { scaleX } = useScaleX();
  const { numOfKeys } = useConfig().pitchRange;
  const { marqueeGeometry, clearMarquee, setMarqueeEndByEvent } = useMarqueeGeometry();

  useEventListener(ref, "pointerdown", (event: PointerEvent) => {
    const noteClicked = getNoteObjectFromEvent(notes, event);
    if (noteClicked || event.metaKey) {
      return;
    }
    const eventCurrentTarget = event.currentTarget as T;
    eventCurrentTarget.setPointerCapture(event.pointerId);
    setMarqueeEndByEvent(event);
  });

  useEventListener(ref, "pointermove", (event: PointerEvent) => {
    if (!marqueeGeometry) {
      return;
    }

    const bufferedNotes = noteModificationBuffer.notesSelected;
    setMarqueeEndByEvent(event);

    const newNotes = bufferedNotes.filter((note) =>
      inMarquee(numOfKeys, scaleX, note, {
        startingPosition: marqueeGeometry[0],
        ongoingPosition: { x: getRelativeX(event), y: getRelativeY(event) },
      }),
    );
    if (newNotes.length === 0) {
      return;
    }

    bufferedNotes.forEach((note) => {
      const noteIsSelected = selectedNoteIds.has(note.id);
      const isInMarquee = inMarquee(numOfKeys, scaleX, note, {
        startingPosition: marqueeGeometry[0],
        ongoingPosition: marqueeGeometry[1],
      });
      if (isInMarquee) {
        setSelectedNoteIds((prev) => create(prev, (draft) => draft.add(note.id)));
      }
    });
  });

  useEventListener(ref, "pointerup", (event) => {
    if (!marqueeGeometry) {
      return;
    }
    clearMarquee();
    if (selectedNotes.length === 0) {
      return;
    }
    let newSelectionRange = getSelectionRangeWithSelectedNotes(selectedNotes, selectionRange);
    setSelectionTicks(newSelectionRange[1]);
  });

  return {
    marqueeGeometry,
  };
}
