"use client";
import { PianoRoll, PianoRollStoreProvider } from "react-piano-roll";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PianoRollStoreProvider>
        <div style={{ width: "800px", height: "600px", boxSizing: "border-box" }}>
          <PianoRoll attachLyric />
        </div>
      </PianoRollStoreProvider>
    </main>
  );
}
