import Image from "next/image";
import { PianoRollStoreProvider, PianoRoll } from "react-piano-roll";

export default function Home() {
  return (
    <PianoRollStoreProvider>
      <main>
        <PianoRoll />
      </main>
    </PianoRollStoreProvider>
  );
}
