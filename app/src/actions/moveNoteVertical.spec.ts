import { upOctave } from "./moveNoteVertical";
import { PianoRollData } from "@midi-editor/react";

describe("moveNoteVertical", () => {
  it("should correctly move selected notes by a given semitone", () => {
    const mockData: PianoRollData = {
      notes: [
        {
          id: "6af76967-7828-49a2-8f7f-65ac891cfcf7",
          tick: 960,
          noteNumber: 86,
          velocity: 64,
          lyric: "啦",
          duration: 480,
          isSelected: true,
        },
        {
          id: "5bb25d09-4c3b-41a5-bfc9-25c63ae3f33c",
          tick: 1680,
          noteNumber: 85,
          velocity: 64,
          lyric: "啦",
          duration: 480,
          isSelected: true,
        },
        {
          id: "c129a4d1-2d84-4587-bcd9-dfd1329b38f7",
          tick: 3600,
          noteNumber: 85,
          velocity: 64,
          lyric: "啦",
          duration: 480,
          isSelected: false,
        },
      ],
      bpm: 120,
    };

    const mockSet = jest.fn();
    upOctave(mockData, mockSet);
    expect(mockSet).toHaveBeenCalledWith({
      notes: [
        {
          id: "c129a4d1-2d84-4587-bcd9-dfd1329b38f7",
          tick: 3600,
          noteNumber: 85,
          velocity: 64,
          lyric: "啦",
          duration: 480,
          isSelected: false,
        },
        {
          id: "6af76967-7828-49a2-8f7f-65ac891cfcf7",
          tick: 960,
          noteNumber: 98,
          velocity: 64,
          lyric: "啦",
          duration: 480,
          isSelected: true,
        },
        {
          id: "5bb25d09-4c3b-41a5-bfc9-25c63ae3f33c",
          tick: 1680,
          noteNumber: 97,
          velocity: 64,
          lyric: "啦",
          duration: 480,
          isSelected: true,
        },
      ],
    });
  });
});
