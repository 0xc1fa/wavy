// import { useContext, useMemo } from "react";
// import { PianoRollStoreContext } from "../store/pianoRollStore";

// export function usePianoRollNotes() {
//   const context = useContext(PianoRollStoreContext);

//   if (!context) {
//     throw new Error("usePianoRollNotes must be used within a PianoRollStoreProvider");
//   }

//   const { pianoRollStore } = context;

//   return useMemo(() => pianoRollStore.pianoRollNotes, [pianoRollStore.pianoRollNotes]);
// }
