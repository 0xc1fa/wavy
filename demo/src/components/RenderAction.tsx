"use client";
import { useBlobUrl } from "@/hooks/useBlobUrl";
import { sendAudioProcessingRequest } from "@/utils/sendAudioProcessingRequest";
import { PianoRoll, PianoRollData } from "@midi-editor/react";
import { RxCheck } from "react-icons/rx";
import { RxMagicWand } from "react-icons/rx";
import { useAudioStatus } from "@/hooks/useAudioStatus";

export interface RenderActionProps {
  setAudioSource: ReturnType<typeof useBlobUrl>[1];
  audioStatus: ReturnType<typeof useAudioStatus>[0];
  setAudioStatus: ReturnType<typeof useAudioStatus>[1];
  audioRef: React.RefObject<HTMLAudioElement>;
}
export default function RenderAction(props: RenderActionProps) {
  const renderAudio = (data: PianoRollData) => {
    props.setAudioStatus("RENDERING_REQUESTED");
    sendRenderingRequestWithData(data).then((res) => {
      if (!res) {
        props.setAudioStatus("RENDERING_FAILED");
        return;
      }
      props.setAudioSource(res);
      props.setAudioStatus("RENDERING_DONE");
    });
  };

  return (
    <PianoRoll.Action name="render" onClick={renderAudio} disabled={props.audioStatus.getIsRenderingDisabled()}>
      {props.audioStatus.getIsUpToDate() ? (
        <RxCheck />
      ) : (
        <RxMagicWand style={{ animation: props.audioStatus.rendering ? "wiggle 2s infinite" : "" }} />
      )}
    </PianoRoll.Action>
  );
}

function sendRenderingRequestWithData(data: PianoRollData) {
  return sendAudioProcessingRequest(
    data.bpm,
    data.notes
      .filter((note) => note.lyric)
      .map((note) => ({
        ...note,
        time: note.tick,
        duration: note.duration,
        lyric: note.lyric,
        noteNumber: note.noteNumber,
      }))
      .sort((a, b) => a.tick - b.tick),
  );
}
