import { PianoRollNote } from "react-piano-roll/dist/types";

export async function sendAudioProcessingRequest(bpm: number, notes: PianoRollNote[]) {
  const url = "http://127.0.0.1:8000/inference";
  const data = {
    bpm: bpm,
    notes: notes,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    return blob;
  } catch (error) {
    console.error("There was an error!", error);
  }
}
