import { TrackNoteEvent } from "@/types/TrackNoteEvent";

enum MidiFormat {
  SingleTrack,
  MultipleTracksSimultaneous,
  MultipleTracksSequential,
}

export function getMidiByte(
  format: MidiFormat,
  numOfTracks: number,
  ticksPerQuarterNote: number,
) {
  const headerChunk = getHeaderChunk(format, numOfTracks, ticksPerQuarterNote);




}

function getHeaderChunk(
  format: MidiFormat,
  numOfTracks: number,
  ticksPerQuarterNote: number
) {
  const MThd = [0x4d, 0x54, 0x68, 0x64];
  const length = [0x00, 0x00, 0x00, 0x06];
  const formatType = [0x00, format];
  const numOfTracksBytes = [numOfTracks / (16 ** 2), numOfTracks % (16 ** 2)];
  const timeDivision = [ticksPerQuarterNote / (16 ** 2), ticksPerQuarterNote % (16 ** 2)];

  return [...MThd, ...length, ...formatType, ...numOfTracksBytes, ...timeDivision];
}

function getTrackTrunk(data: TrackNoteEvent[]) {
  const MTrk = [0x4d, 0x54, 0x72, 0x6b];
  const noteStartEvents = data.slice().sort((a, b) => a.tick - b.tick)
  const noteEndEvents = data.slice().sort((a, b) => (a.tick + a.duration) - (b.tick + b.duration))
  
  const length = [0x00, 0x00, 0x00, 0x00];


  return [...MTrk, ...length];
}

