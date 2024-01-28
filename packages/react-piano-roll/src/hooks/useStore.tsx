import { useContext } from "react";
import { PianoRollStoreContext } from "../store/pianoRollStore";

export default function useStore() {
  const store = useContext(PianoRollStoreContext);
  if (!store) throw new Error("PianoRollStoreContext is null");
  return store;
}
