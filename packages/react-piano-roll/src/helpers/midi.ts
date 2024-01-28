import { TrackNoteEvent } from "@/types/TrackNoteEvent";

enum MidiFormat {
  SingleTrack,
  MultipleTracksSimultaneous,
  MultipleTracksSequential,
}

type MidiChannelEvent =
  | { type: ChannelEventType.NoteOn; noteNumber: number; velocity: number }
  | { type: ChannelEventType.NoteOff; noteNumber: number; velocity: number }
  | {
      type: ChannelEventType.NoteAftertouch;
      noteNumber: number;
      amount: number;
    }
  | {
      type: ChannelEventType.ControlChange;
      controllerNumber: number;
      value: number;
    }
  | { type: ChannelEventType.ProgramChange; programNumber: number }
  | { type: ChannelEventType.ChannelAftertouch; amount: number }
  | { type: ChannelEventType.PitchBend; value: number };

type AbsoluteTimedMidiChannelEvent = MidiChannelEvent & { tick: number };
type TimedMidiChannelEvent = MidiChannelEvent & { deltaTick: number };

enum ChannelEventType {
  NoteOff = 0x80,
  NoteOn = 0x90,
  NoteAftertouch = 0xa0,
  ControlChange = 0xb0,
  ProgramChange = 0xc0,
  ChannelAftertouch = 0xd0,
  PitchBend = 0xe0,
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
  EndOfTrack = 0x2f,
  SetTempo = 0x51,
  SMPTEOffset = 0x54,
  TimeSignature = 0x58,
  KeySignature = 0x59,
  SequencerSpecific = 0x7f,
}

export default function createMIDIFile(notes: TrackNoteEvent[]) {
  const headerChunk = getHeaderChunk(MidiFormat.SingleTrack, 1, 9600);
  const trackChunk = getTrackChunk(notes);

  const bufferArray = [
    ...headerChunk,
    ...trackChunk.flatMap((trackChunk) => trackChunk),
  ];

  const buffer = new Uint8Array(bufferArray);
  return buffer;
}

export function downloadMidi(notes: TrackNoteEvent[]) {
  const buffer = createMIDIFile(notes);
  const blob = new Blob([buffer], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);

  // Create a link and trigger the download
  const a = document.createElement("a");
  a.href = url;
  a.download = "music.mid";
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getHeaderChunk(
  format: MidiFormat,
  numOfTracks: number,
  ticksPerQuarterNote: number,
) {
  const MThd = [0x4d, 0x54, 0x68, 0x64]; // Header identifier "MThd"
  const length = [0x00, 0x00, 0x00, 0x06]; // Header chunk length (always 6 bytes for standard MIDI files)
  const formatType = [0x00, format]; // MIDI format type (0, 1, or 2)

  // Convert numOfTracks and ticksPerQuarterNote to two bytes each in big-endian format
  const numOfTracksBytes = [(numOfTracks >> 8) & 0xff, numOfTracks & 0xff];
  const timeDivisionBytes = [
    (ticksPerQuarterNote >> 8) & 0xff,
    ticksPerQuarterNote & 0xff,
  ];

  return [
    ...MThd,
    ...length,
    ...formatType,
    ...numOfTracksBytes,
    ...timeDivisionBytes,
  ];
}

function getTrackChunk(data: TrackNoteEvent[]): number[] {
  const MTrk = [0x4d, 0x54, 0x72, 0x6b];
  const noteStartEvents: AbsoluteTimedMidiChannelEvent[] = data
    .slice()
    .filter((note) => note.isActive)
    .map((note) => ({
      type: ChannelEventType.NoteOn,
      noteNumber: note.noteNumber,
      tick: note.tick,
      velocity: note.velocity,
    }));
  const noteEndEvents: AbsoluteTimedMidiChannelEvent[] = data
    .slice()
    .filter((note) => note.isActive)
    .map((note) => ({
      type: ChannelEventType.NoteOff,
      noteNumber: note.noteNumber,
      tick: note.tick + note.duration,
      velocity: 0,
    }));
  const channelEvents = [...noteStartEvents, ...noteEndEvents].sort(
    (a, b) => a.tick - b.tick,
  );
  const timedChannelEvents = insertVLQEvents(channelEvents);
  console.log(timedChannelEvents);

  const encodedEvents = timedChannelEvents.flatMap((event) => {
    switch (event.type) {
      case ChannelEventType.NoteOn:
        return toNoteOnEvent(event);
      case ChannelEventType.NoteOff:
        return toNoteOffEvent(event);
      default:
        throw new Error("Invalid event type");
    }
  });

  const trackLength = encodeTrackLength(encodedEvents.length);

  return [...MTrk, ...trackLength, ...encodedEvents];
}

const insertVLQEvents = (
  channelEvents: AbsoluteTimedMidiChannelEvent[],
): TimedMidiChannelEvent[] => {
  let currentDeltaT = 0;
  let ret: TimedMidiChannelEvent[] = [];
  channelEvents.forEach((event) => {
    ret.push({ ...event, deltaTick: event.tick - currentDeltaT });
    currentDeltaT = event.tick;
  });

  return ret;
};

function encodeNoteOn(noteNumber: number, velocity: number) {
  return [ChannelEventType.NoteOn, noteNumber, velocity];
}

function encodeNoteOff(noteNumber: number) {
  return [ChannelEventType.NoteOn, noteNumber, 0x00];
}

function encodeVlq(number: number) {
  let vlq = [];

  while (true) {
    // Process current segment and determine if it's the last one
    let { segment, isLast } = processSegment(number);

    // Add the processed segment to the VLQ array
    vlq.unshift(segment);

    // Break the loop if this was the last segment
    if (isLast) {
      break;
    }

    // Prepare the number for the next iteration
    number >>= 7;
  }

  return vlq;
}

function processSegment(number: number) {
  // Extract the 7 least significant bits
  let segment = number & 0b0111_1111;

  // Determine if there are more segments to process
  let isLast = (number >>= 7) === 0;

  // If not the last segment, set the high bit (continuation bit)
  if (!isLast) {
    segment |= 0b1000_0000;
  }

  return { segment, isLast };
}

function encodeTrackLength(length: number) {
  return [
    (length >> 24) & 0xff, // Most significant byte
    (length >> 16) & 0xff,
    (length >> 8) & 0xff,
    length & 0xff, // Least significant byte
  ];
}

function toNoteOnEvent(
  note: TimedMidiChannelEvent & { type: ChannelEventType.NoteOn },
) {
  return [
    ...encodeVlq(note.deltaTick),
    ...encodeNoteOn(note.noteNumber, note.velocity),
  ];
}

function toNoteOffEvent(
  note: TimedMidiChannelEvent & { type: ChannelEventType.NoteOff },
) {
  return [...encodeVlq(note.deltaTick), ...encodeNoteOff(note.noteNumber)];
}
