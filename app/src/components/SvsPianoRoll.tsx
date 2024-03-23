"use client";
import { useBlobUrl } from "@/hooks/useBlobUrl";
import { useReducer } from "react";
import { PianoRoll } from "react-piano-roll";
import RenderActionItem from "./RenderActionItem";
import { useDebug } from "@/hooks/useDebug";
import { useAudioStatus } from "@/hooks/useAudioStatus";

export interface SvsPianoRollProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function SvsPianoRoll(props: SvsPianoRollProps) {
  const [audioSource, setAudioSource] = useBlobUrl();
  const [audioStatus, audioStatusDispatch] = useAudioStatus();

  useDebug(audioStatus);

  return (
    <>
      <audio controls>
        <source src={audioSource?.url} type="audio/wav" />
      </audio>
      <PianoRoll
        attachLyric
        onNoteUpdate={() => audioStatusDispatch("NOTE_MODIFIED")}
        rendering={!audioStatus.getIsUpToDate()}
      >
        <RenderActionItem
          setAudioSource={setAudioSource}
          audioStatus={audioStatus}
          setAudioStatus={audioStatusDispatch}
        />
      </PianoRoll>
    </>
  );
}
