import { useRef, useState } from "react";
import { PianoRollNote } from "@/types/PianoRollNote";
import _ from "lodash";
import { getGridOffsetOfTick, getNearestAnchor, getTickInGrid } from "@/helpers/grid";
import {
  getNoteNumFromEvent,
  getNoteNumFromOffsetY,
  getTickFromEvent,
  getTickFromOffsetX,
  roundDownTickToNearestGrid,
} from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
import { useAtomValue, useSetAtom } from "jotai";
import { addNoteAtom, modifyingNotesAtom, notesAtom } from "@/store/note";
import {
  noteModificationBufferAtom,
  setNoteModificationBufferWithSelectedNotesAtom,
} from "@/store/note-modification-buffer";
import { selectionTicksAtom } from "@/store/selection-ticks";
import { useEventListener } from "@/hooks/useEventListener";

export enum PianoRollLanesMouseHandlerMode {
  DragAndDrop,
  MarqueeSelection,
  NotesTrimming,
  NotesExtending,
  Vibrato,
  Velocity,
  None,
}

export enum DraggingGuardMode {
  UnderThreshold,
  FineTune,
  SnapToGrid,
}

export type PianoRollMouseHandlersStates = {
  mouseHandlerMode: PianoRollLanesMouseHandlerMode;
  startingPosition: { x: number; y: number };
  ongoingPosition: { x: number; y: number };
};

export type NotesModificationBuffer = {
  notesSelected: PianoRollNote[];
  initY: number;
  initX: number;
};

export function useNoteCreationGesture(ref: React.RefObject<HTMLElement>) {
  const notes = useAtomValue(notesAtom);
  const noteModificationBuffer = useAtomValue(noteModificationBufferAtom);

  const addNote = useSetAtom(addNoteAtom);
  const setSelectionTicks = useSetAtom(selectionTicksAtom);
  const setNoteModificationBufferWithSelectedNotes = useSetAtom(setNoteModificationBufferWithSelectedNotesAtom);
  const modifyingNotes = useSetAtom(modifyingNotesAtom);

  const { scaleX } = useScaleX();
  const { numOfKeys } = useConfig().pitchRange;
  const guardActive = useRef(DraggingGuardMode.UnderThreshold);

  const currentPointerPos = useRef({ clientX: 0, clientY: 0 });
  const [active, setActive] = useState(false);

  useEventListener(ref, "pointerdown", (event: PointerEvent) => {
    guardActive.current = DraggingGuardMode.UnderThreshold;
    const relativeX = getRelativeX(event);
    const relativeY = getRelativeY(event);

    const noteClicked = getNoteObjectFromEvent(notes, event);
    if (noteClicked || !event.metaKey) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    setActive(true);
    const { ticks, noteNum } = getTickAndNoteNumFromEvent(event);
    addNote({ ticks, noteNum });
    setSelectionTicks(ticks);
    setNoteModificationBufferWithSelectedNotes({ initX: relativeX, initY: relativeY });
  });

  useEventListener(ref, "pointermove", (event: PointerEvent) => {
    if (!active) {
      return;
    }
    const relativeX = getRelativeX(event);
    const relativeY = getRelativeY(event);
    const bufferedNotes = noteModificationBuffer.notesSelected;
    const deltaY = relativeY - noteModificationBuffer.initY;
    const deltaX = relativeX - noteModificationBuffer.initX;
    const deltaTicks = getTickFromOffsetX(scaleX, deltaX);
    const deltaPitch =
      getNoteNumFromOffsetY(numOfKeys, relativeY) - getNoteNumFromOffsetY(numOfKeys, noteModificationBuffer.initY);

    currentPointerPos.current = { clientX: event.clientX, clientY: event.clientY };
    if (Math.abs(deltaTicks) > getTickInGrid(scaleX)) {
      guardActive.current = DraggingGuardMode.SnapToGrid;
    } else if (Math.abs(deltaTicks) > 96 && guardActive.current < DraggingGuardMode.FineTune) {
      guardActive.current = DraggingGuardMode.FineTune;
    }

    const noteClicked = _.last(bufferedNotes);

    let newNotes;
    if (guardActive.current === DraggingGuardMode.SnapToGrid) {
      const anchor = getNearestAnchor(
        noteClicked!.tick + deltaTicks,
        scaleX,
        getGridOffsetOfTick(noteClicked!.tick, scaleX),
      );
      if (anchor.proximity) {
        newNotes = bufferedNotes.map((bufferedNote) => ({
          ...bufferedNote,
          noteNumber: bufferedNote.noteNumber + deltaPitch,
          tick: anchor.anchor - _.last(bufferedNotes)!.tick + bufferedNote.tick,
        }));
      } else {
        return;
      }
    } else if (guardActive.current === DraggingGuardMode.FineTune) {
      newNotes = bufferedNotes.map((bufferedNote) => ({
        ...bufferedNote,
        noteNumber: bufferedNote.noteNumber + deltaPitch,
        tick: bufferedNote.tick + deltaTicks,
      }));
    } else {
      newNotes = bufferedNotes.map((bufferedNote) => ({
        ...bufferedNote,
        noteNumber: bufferedNote.noteNumber + deltaPitch,
      }));
    }
    if (guardActive.current) {
      setSelectionTicks(_.last(newNotes)!.tick);
    }
    modifyingNotes(newNotes);
  });

  useEventListener(ref, "pointerup", () => {
    setActive(false);
  });

  const getTickAndNoteNumFromEvent = (e: PointerEvent) => {
    const noteNum = getNoteNumFromEvent(numOfKeys, e);
    const ticks = roundDownTickToNearestGrid(getTickFromEvent(scaleX, e), scaleX);
    return { ticks, noteNum };
  };
}
