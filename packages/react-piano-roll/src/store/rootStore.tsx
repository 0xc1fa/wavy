import { create } from "zustand";
import { createContext, useContext } from "react";


type Store = {
  bpm: number;
  scaleX: number;
  scaleY: number;
  lastModifiedVelocity: number;
  lastModifiedDuration: number;
  selectionTicksAtom: number | null;
  selectionRangeAtom: [number, number] | null;
};

const createStore = () =>
  create((set) => ({
    bpm: 120,
    scaleX: 1,
    scaleY: 1,
    lastModifiedVelocity: 64,
    lastModifiedDuration: 480,
    selectionTicksAtom: 0,
    selectionRangeAtom: null,
  }));

const Store = createContext(createStore());

export const StoreProvider = ({ children }: { children: React.ReactElement }) => {
  return <Store.Provider value={createStore()}>{children}</Store.Provider>;
};

export const useStore = useContext(Store);
