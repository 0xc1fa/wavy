"use client";
import { useBlobUrl } from "@/hooks/useBlobUrl";
import { sendAudioProcessingRequest } from "@/utils/sendAudioProcessingRequest";
import { debounce } from "lodash";
import { PianoRoll, PianoRollData } from "react-piano-roll";
import { RxUpload, RxOpenInNewWindow } from "react-icons/rx";
import { IoSaveOutline } from "react-icons/io5";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { PianoRollActionElement } from "react-piano-roll/dist/components/ActionButtons";

interface JsonData {
  // Define the structure of your JSON data here
  // Example:
  // name: string;
  // age: number;
  [key: string]: any; // For a flexible structure
}

export interface ImportActionProps {}
export default function ImportAction(props: ImportActionProps) {
  // const [jsonData, setJsonData] = useState<PianoRollData | null>(null);
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
        // setJsonData(json);
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
