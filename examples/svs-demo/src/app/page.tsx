import { PianoRollStoreProvider, PianoRoll } from "react-piano-roll";

export default function Home() {
  return (
    <PianoRollStoreProvider>
      <main>
        <PianoRoll attachLyric />
      </main>
    </PianoRollStoreProvider>
  );
}
