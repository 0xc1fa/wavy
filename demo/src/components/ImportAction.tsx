"use client";
import { PianoRoll, PianoRollData } from "@midi-editor/react";
import { RxOpenInNewWindow } from "react-icons/rx";
import { ChangeEvent, useRef } from "react";
import { PianoRollActionElement } from "@midi-editor/react";

export default function ImportAction() {
  const actionRef = useRef<PianoRollActionElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tempSetter = useRef<((data: PianoRollData) => void) | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
      const text = loadEvent.target?.result;
      try {
        const json = JSON.parse(text as string);
        tempSetter.current?.(json);
        console.log("JSON data:", json);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input type="file" accept=".pianoroll" onChange={handleFileChange} ref={inputRef} hidden />
      <PianoRoll.Action
        name="import"
        onClick={(data, set) => {
          tempSetter.current = set;
          inputRef.current?.click();
        }}
        ref={actionRef}
      >
        <RxOpenInNewWindow />
      </PianoRoll.Action>
    </>
  );
}
