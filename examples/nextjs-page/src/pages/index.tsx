import Image from "next/image";
import { Inter } from "next/font/google";
import { PianoRoll, PianoRollStoreProvider } from "react-piano-roll";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
      <PianoRollStoreProvider>
        <div style={{ width: "800px", height: "600px", boxSizing: "border-box" }}>
          <PianoRoll attachLyric />
        </div>
      </PianoRollStoreProvider>
    </main>
  );
}
