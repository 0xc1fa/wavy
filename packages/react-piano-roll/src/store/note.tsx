import { defaultNoteLyric } from "@/constants";
import { TrackNoteEvent, VibratoMode } from "@/types";
import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { PianoRollHistoryItemType, getChoppedHistoryAfterHead, notesHistoryAtom } from "./history";
import { lastModifiedDurationAtom, lastModifiedVelocityAtom } from "./last-modified";
import { clampDuration, clampNoteNumber, clampTick, clampVelocity } from "@/helpers/number";
import _ from "lodash";
import { noteModificationBufferAtom } from "./note-modification-buffer";

export const notesAtom = atom(new Array<TrackNoteEvent>());
export const setNotesAtom = atom(null, (get, set, payload: TrackNoteEvent[]) => {
  set(notesAtom, payload);
})

export const selectedNotesAtom = atom((get) => get(notesAtom).filter((note) => note.isSelected));

export const addNoteAtom = atom(null, (get, set, payload: { ticks: number; noteNum: number }) => {
  const notesHisotry = get(notesHistoryAtom);
  const newNote = createNote(
    payload.ticks,
    payload.noteNum,
    get(lastModifiedVelocityAtom),
    get(lastModifiedDurationAtom),
  );
  set(notesAtom, [...get(notesAtom), newNote]);
  set(notesHistoryAtom, {
    head: notesHisotry.head + 1,
    history: [
      ...getChoppedHistoryAfterHead(notesHisotry),
      { type: PianoRollHistoryItemType.ADD_NOTE, note: [newNote] },
    ],
  });
});

export function createNote(
  ticks: number,
  noteNum: number,
  lastModifiedVelocity: number,
  lastModifiedDuration: number,
): TrackNoteEvent {
  return {
    id: uuidv4(),
    tick: ticks,
    noteNumber: noteNum,
    velocity: lastModifiedVelocity,
    lyric: defaultNoteLyric,
    duration: lastModifiedDuration,
    isSelected: true,
    isActive: true,
    vibratoDepth: 10,
    vibratoRate: 30,
    vibratoDelay: lastModifiedDuration * 0.3,
    vibratoMode: VibratoMode.Normal,
  };
}

export const addNotesAtom = atom(null, (get, set, payload: TrackNoteEvent[]) => {
  set(notesAtom, [...get(notesAtom), ...payload]);
});

export const modifyingNotesAtom = atom(null, (get, set, payload: TrackNoteEvent[]) => {
  const notesHistory = get(notesHistoryAtom);
  const notes = get(notesAtom);
  const noteModificationBuffer = get(noteModificationBufferAtom);

  const prevHistory = notesHistory.history[notesHistory.head]?.note;
  const notesIdsToBeModified = payload.map((note) => note.id);
  const notesNotModified = notes.filter((note) => !notesIdsToBeModified.includes(note.id));
  const notesModifiedWithClampValue = payload.map((note) => ({
    ...note,
    noteNumber: clampNoteNumber(note.noteNumber),
    velocity: clampVelocity(note.velocity),
    tick: clampTick(note.tick),
    duration: clampDuration(note.duration),
  }));
  set(notesAtom, [...notesNotModified, ...notesModifiedWithClampValue]);
  if (!_.isEqual(prevHistory, noteModificationBuffer.notesSelected)) {
    set(notesHistoryAtom, {
      head: notesHistory.head + 1,
      history: [
        ...getChoppedHistoryAfterHead(notesHistory),
        {
          type: PianoRollHistoryItemType.MODIFY_NOTE,
          note: noteModificationBuffer.notesSelected,
        },
      ],
    });
  }
});

export const deleteSelectedNotesAtom = atom(null, (get, set) => {
  const notesToBeDeleted = get(notesAtom).filter((note) => note.isSelected);

  const notesHistory = get(notesHistoryAtom);

  set(
    notesAtom,
    get(notesAtom).filter((note) => !note.isSelected),
  );
  set(notesHistoryAtom, {
    head: notesHistory.head + 1,
    history: [
      ...getChoppedHistoryAfterHead(notesHistory),
      { type: PianoRollHistoryItemType.DELETE_NOTE, note: notesToBeDeleted },
    ],
  });
});

export const updateNoteLyricAtom = atom(null, (get, set, payload: { noteId: string; lyric: string }) => {
  set(
    notesAtom,
    get(notesAtom).map((note) => (note.id === payload.noteId ? { ...note, lyric: payload.lyric } : note)),
  );
});

export const moveNoteAsLatestModifiedAtom = atom(null, (get, set, noteId: string) => {
  const notes = get(notesAtom);
  set(notesAtom, notes.filter((note) => note.id !== noteId).concat(notes.filter((note) => note.id === noteId)));
});

export const setNoteAsSelectedAtom = atom(null, (get, set, noteId: string) => {
  set(
    notesAtom,
    get(notesAtom).map((note) => ({
      ...note,
      isSelected: note.isSelected || note.id === noteId,
    })),
  );
});

export const unselectAllNotesAtom = atom(null, (get, set) => {
  set(
    notesAtom,
    get(notesAtom).map((note) => ({
      ...note,
      isSelected: false,
    })),
  );
});
