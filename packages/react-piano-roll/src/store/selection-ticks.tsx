import { atom } from "jotai";

export const selectionTicksAtom = atom<number | null>(0);

export const selectionRangeAtom = atom<[number, number] | null>(null);
