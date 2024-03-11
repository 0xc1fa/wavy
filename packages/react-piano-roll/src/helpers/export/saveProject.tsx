import { saveAs } from "file-saver";
import { TrackNoteEvent } from "@/types";

type Note = {
  id: string;
  start: number;
  duration: number;
  pitch: number;
  velocity: number;
  lyric: string;
};

type ExportFileFormat = {
  reactPianoRollFileFormatVersion: 1;
  schema: {
    notes: Note[];
  };
};

export function toExportNoteType(notes: TrackNoteEvent[]) {
  return notes.map((n) => ({
    id: n.id,
    start: n.tick,
    duration: n.duration,
    pitch: n.noteNumber,
    velocity: n.velocity,
    lyric: n.lyric,
  }));
}

export async function saveProject(notes: Note[]) {
  const data: ExportFileFormat = {
    reactPianoRollFileFormatVersion: 1,
    schema: {
      notes: notes,
    },
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  saveAs(blob, "Untitled.rpr");
}
