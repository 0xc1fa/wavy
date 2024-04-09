"use client";
import { useBlobUrl } from "@/hooks/useBlobUrl";
import { MidiEditorHandle, PianoRoll } from "react-piano-roll";
import RenderAction from "./RenderAction";
import { saveAs } from "file-saver";
import { useAudioStatus } from "@/hooks/useAudioStatus";
import {
  RxChevronUp,
  RxChevronDown,
  RxDoubleArrowLeft,
  RxDoubleArrowRight,
  RxDownload,
  RxColumnSpacing,
} from "react-icons/rx";
import { downOctave, upOctave } from "@/actions/moveNoteVertical";
import { setLegato } from "@/actions/setLegato";
import { useEffect, useRef } from "react";
import { halfTime, doubleTime } from "@/actions/scaleNoteTime";
import ImportAction from "./ImportAction";
import { IoSaveOutline } from "react-icons/io5";
import { useLoadAudioSource } from "@/hooks/useLoadAudioSource";
import { useFrequentAudioTimeupdate } from "@/hooks/useFrequentAudioTimeupdate";
import { exportData } from "@/utils/exportData";

export interface SvsPianoRollProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function SvsPianoRoll(props: SvsPianoRollProps) {
  const [audioSource, setAudioSource] = useBlobUrl();
  const [audioStatus, audioStatusDispatch] = useAudioStatus();
  const audioRef = useRef<HTMLAudioElement>(null);
  const pianorollRef = useRef<MidiEditorHandle>(null);

  useLoadAudioSource(audioRef, audioSource);
  useFrequentAudioTimeupdate(audioRef);

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (pianorollRef.current) {
            pianorollRef.current.currentTime = audioRef.current?.currentTime! * 960;
          }
        }}
        onEnded={() => pianorollRef.current?.pause()}
      >
        <source src={audioSource?.url} type="audio/wav" />
      </audio>
      <PianoRoll
        lyric
        onNoteUpdate={() => audioStatusDispatch("NOTE_MODIFIED")}
        loading={!audioStatus.getIsUpToDate()}
        onPlay={() => audioRef.current && ((audioRef.current.currentTime = 0), audioRef.current.play())}
        onPause={() => audioRef.current?.pause()}
        ref={pianorollRef}
      >
        <RenderAction
          setAudioSource={setAudioSource}
          audioStatus={audioStatus}
          setAudioStatus={audioStatusDispatch}
          audioRef={audioRef}
        />
        <PianoRoll.Action
          name="download"
          onClick={() => saveAs(audioSource?.blob!, "audio.wav")}
          disabled={audioSource === null}
        >
          <RxDownload />
        </PianoRoll.Action>

        <ImportAction />

        <PianoRoll.Action
          name="save"
          onClick={(data) => {
            console.log(JSON.stringify(data));
            exportData(data);
          }}
        >
          <IoSaveOutline />
        </PianoRoll.Action>

        <PianoRoll.Action name="upOctave" onClick={upOctave}>
          <RxChevronUp />
        </PianoRoll.Action>

        <PianoRoll.Action name="downOctave" onClick={downOctave}>
          <RxChevronDown />
        </PianoRoll.Action>

        <PianoRoll.Action name="halfTime" onClick={halfTime}>
          <RxDoubleArrowLeft />
        </PianoRoll.Action>

        <PianoRoll.Action name="doubleTime" onClick={doubleTime}>
          <RxDoubleArrowRight />
        </PianoRoll.Action>

        <PianoRoll.Action name="legato" onClick={setLegato}>
          <RxColumnSpacing />
        </PianoRoll.Action>
      </PianoRoll>
    </>
  );
}
