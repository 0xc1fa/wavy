import dynamic from "next/dynamic";
import { PianoRoll, PianoRollStoreProvider } from "react-piano-roll";

const PianoRollWrapper: React.FC = () => {
  return (
    <PianoRollStoreProvider>
      <div style={{ width: "800px", height: "600px", boxSizing: "border-box" }}>
        <PianoRoll attachLyric />
      </div>
    </PianoRollStoreProvider>
  );
};



export default PianoRollWrapper;
