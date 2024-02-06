import { PianoRoll, usePreventZoom } from "react-piano-roll";

function App() {
  usePreventZoom();
  return (
    <>
      <div style={{ width: "800px", height: "600px", boxSizing: "border-box" }}>
        <PianoRoll attachLyric />
      </div>
    </>
  );
}

export default App;
