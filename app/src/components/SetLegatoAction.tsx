"use client";
import { useBlobUrl } from "@/hooks/useBlobUrl";
import { sendAudioProcessingRequest } from "@/utils/sendAudioProcessingRequest";
import { debounce } from "lodash";
import { Dispatch, useState } from "react";
import { TrackNoteEvent } from "react-piano-roll/dist/types";
import { saveAs } from "file-saver";
import { PianoRoll } from "react-piano-roll";
import { RxColumnSpacing } from "react-icons/rx";
import { useAudioStatus } from "@/hooks/useAudioStatus";

export interface SetLegatoActionProps {}
export default function SetLegatoAction(props: SetLegatoActionProps) {
  const debouncedSendAudioProcessingRequest = debounce(sendAudioProcessingRequest, 800);

  const setLegato = (notes: TrackNoteEvent[], setNotes: (notes: TrackNoteEvent[]) => void) => {
    console.log("SetLegatoActionItem clicked");
    let selectedNotes = notes.filter((note) => note.isSelected).sort((a, b) => a.tick - b.tick);
    let unselectedNotes = notes.filter((note) => !note.isSelected);
    for (let i = 0; i < selectedNotes.length - 1; i++) {
      selectedNotes[i].duration = selectedNotes[i + 1].tick - selectedNotes[i].tick;
    }
    setNotes([...unselectedNotes, ...selectedNotes]);
  };

  return (
    <PianoRoll.Action name="legato" onClick={setLegato} controls>
      <RxColumnSpacing />
    </PianoRoll.Action>
  );
}
