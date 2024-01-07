import { TrackNoteEvent } from "@/types/TrackNoteEvent";

enum MidiFormat {
  SingleTrack,
  MultipleTracksSimultaneous,
  MultipleTracksSequential,
}

type MidiChannelEvent =
  | { type: ChannelEventType.NoteOn, noteNumber: number, velocity: number }
  | { type: ChannelEventType.NoteOff, noteNumber: number, velocity: number }
  | { type: ChannelEventType.NoteAftertouch, noteNumber: number, amount: number }
  | { type: ChannelEventType.ControlChange, controllerNumber: number, value: number }
  | { type: ChannelEventType.ProgramChange, programNumber: number }
  | { type: ChannelEventType.ChannelAftertouch, amount: number }
  | { type: ChannelEventType.PitchBend, value: number }

type AbsoluteTimedMidiChannelEvent = MidiChannelEvent & { tick: number }
type TimedMidiChannelEvent = MidiChannelEvent & { deltaTick: number }

enum ChannelEventType {
  NoteOff = 0x80,
  NoteOn = 0x90,
  NoteAftertouch = 0xA0,
  ControlChange = 0xB0,
  ProgramChange = 0xC0,
  ChannelAftertouch = 0xD0,
  PitchBend = 0xE0,
}

enum MetaEvent {
  SequenceNumber = 0x00,
  Text = 0x01,
  CopyrightNotice = 0x02,
  SequenceTrackName = 0x03,
  InstrumentName = 0x04,
  Lyric = 0x05,
  Marker = 0x06,
  CuePoint = 0x07,
  ChannelPrefix = 0x20,
  EndOfTrack = 0x2F,
  SetTempo = 0x51,
  SMPTEOffset = 0x54,
  TimeSignature = 0x58,
  KeySignature = 0x59,
  SequencerSpecific = 0x7F,
}

export default function createMIDIFile(notes: TrackNoteEvent[]) {

  const headerChunk = getHeaderChunk(MidiFormat.SingleTrack, 1, 9600);
  const trackChunk = getTrackChunk(notes);

  const bufferArray = [...headerChunk, ...trackChunk.flatMap(trackChunk => trackChunk)]

  const buffer = new Uint8Array(bufferArray);
  return buffer

}


function getHeaderChunk(
  format: MidiFormat,
  numOfTracks: number,
  ticksPerQuarterNote: number
) {
  const MThd = [0x4d, 0x54, 0x68, 0x64]; // Header identifier "MThd"
  const length = [0x00, 0x00, 0x00, 0x06]; // Header chunk length (always 6 bytes for standard MIDI files)
  const formatType = [0x00, format]; // MIDI format type (0, 1, or 2)

  // Convert numOfTracks and ticksPerQuarterNote to two bytes each in big-endian format
  const numOfTracksBytes = [(numOfTracks >> 8) & 0xFF, numOfTracks & 0xFF];
  const timeDivisionBytes = [(ticksPerQuarterNote >> 8) & 0xFF, ticksPerQuarterNote & 0xFF];

  return [...MThd, ...length, ...formatType, ...numOfTracksBytes, ...timeDivisionBytes];
}

function getTrackChunk(data: TrackNoteEvent[]): number[] {
  const MTrk = [0x4d, 0x54, 0x72, 0x6b];
  const noteStartEvents: AbsoluteTimedMidiChannelEvent[] = data.slice()
    .filter(note => note.isActive)
    .map(note => ({ type: ChannelEventType.NoteOn, noteNumber: note.noteNumber, tick: note.tick, velocity: note.velocity }))
  const noteEndEvents: AbsoluteTimedMidiChannelEvent[] = data.slice()
    .filter(note => note.isActive)
    .map(note => ({ type: ChannelEventType.NoteOff, noteNumber: note.noteNumber, tick: note.tick + note.duration, velocity: 0 }))
  const channelEvents = [...noteStartEvents, ...noteEndEvents].sort((a, b) => a.tick - b.tick);
  const timedChannelEvents = insertVLQEvents(channelEvents);
  console.log(timedChannelEvents)

  const encodedEvents = timedChannelEvents.flatMap(event => {
    switch (event.type) {
      case ChannelEventType.NoteOn:
        return toNoteOnEvent(event)
      case ChannelEventType.NoteOff:
        return toNoteOffEvent(event)
      default:
        throw new Error("Invalid event type")
    }
  })

  const trackLength = encodeTrackLength(encodedEvents.length)

  return [...MTrk, ...trackLength, ...encodedEvents];

}

const insertVLQEvents = (channelEvents: AbsoluteTimedMidiChannelEvent[]): TimedMidiChannelEvent[] => {
  let currentDeltaT = 0
  let ret: TimedMidiChannelEvent[] = []
  channelEvents.forEach(event => {
    ret.push({ ...event, deltaTick: event.tick - currentDeltaT })
    currentDeltaT = event.tick
  })

  return ret;
};

function encodeNoteOn(noteNumber: number, velocity: number) {
  return [ChannelEventType.NoteOn, noteNumber, velocity]
}

function encodeNoteOff(noteNumber: number) {
  return [ChannelEventType.NoteOn, noteNumber, 0x00]
}

function encodeVlq(number: number) {
  let vlq = [];

  // Start with the least significant 7 bits
  let segment = number & 0x7F;
  number >>= 7;

  // Process remaining bits in groups of 7
  while (number > 0) {
    // Add previous segment to the VLQ with continuation bit
    vlq.unshift(segment | 0x80);

    // Get next 7 bits
    segment = number & 0x7F;
    number >>= 7;
  }

  // Add the last segment without continuation bit
  vlq.push(segment);

  return vlq;
}

function encodeTrackLength(length: number) {
  return [
      (length >> 24) & 0xFF, // Most significant byte
      (length >> 16) & 0xFF,
      (length >> 8) & 0xFF,
      length & 0xFF          // Least significant byte
  ];
}

function toNoteOnEvent(note: TimedMidiChannelEvent & { type: ChannelEventType.NoteOn }) {
  return [...encodeVlq(note.deltaTick), ...encodeNoteOn(note.noteNumber, note.velocity)];
}

function toNoteOffEvent(note: TimedMidiChannelEvent & { type: ChannelEventType.NoteOff }) {
  return [...encodeVlq(note.deltaTick), ...encodeNoteOff(note.noteNumber)];
}

