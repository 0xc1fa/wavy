// import { TrackNoteEvent } from "@/types/TrackNoteEvent";
// import { Dispatch, useContext, useReducer } from "react";
// import { createContext } from "react";

// export enum PianoRollHistoryItemType {
//   ADD_NOTE,
//   DELETE_NOTE,
//   MODIFY_NOTE
// }


// export type PianoRollHistoryItem = {
//   type: PianoRollHistoryItemType,
//   note: TrackNoteEvent[]
// }

// type PianoRollHistory = {
//   head: number,
//   histories: PianoRollHistoryItem[]
// }


// // const APPEND_HISTORY = 'APPEND_HISTORY'
// type AppendHistoryAction = { type: "APPEND_HISTORY", payload: { type: PianoRollHistoryItemType, note: TrackNoteEvent[] }}
// type UndoAction = { type: 'UNDO' }
// type RedoAction = { type: 'REDO' }

// type HistoryAction =
//   | AppendHistoryAction
//   | UndoAction
//   | RedoAction


// function historyReducer(state: PianoRollHistory, action: HistoryAction) {
//   switch (action.type) {
//     case 'APPEND_HISTORY': {
//       const slicedHistory = state.histories.slice(0, state.head + 1)
//       return ({
//         head: slicedHistory.length,
//         histories: [
//           ...slicedHistory, { type: action.payload.type, note: action.payload.note }
//         ]
//       })
//     }
//     case 'UNDO': {
//       if (state.histories.length === 0 || state.head === 0) {
//         return state
//       } else {
//         return ({
//           ...state,
//           head: state.head - 1
//         })
//       }
//     }
//     case 'REDO': {
//       if (state.histories.length === 0 || state.head === state.histories.length - 1) {
//         return state
//       }
//       return ({
//         ...state,
//         head: state.head + 1
//       })
//     }
//     default:
//       throw Error();
//   }
// }

// // export default function usePianoRollHistory() {
// //   const initPianoRollHistory = {
// //     head: -1,
// //     histories: []
// //   };
// //   const pianoRollHistory = useReducer(historyReducer, initPianoRollHistory);
// //   return pianoRollHistory
// // }

// type historyContextType = [PianoRollHistory, Dispatch<HistoryAction>]
// const defaultHistory: historyContextType = [
//   { head: -1, histories: [] },
//   () => void 0
// ]
// const historyContext = createContext(defaultHistory)

// export function useHistory() {
//   return useContext(historyContext)
// }

// export function HistoryProvider({ children }: { children: React.ReactNode }) {
//   const initPianoRollHistory = { ...defaultHistory[0] }
//   const [history, dispatch] = useReducer(historyReducer, initPianoRollHistory);
//   return (
//     <historyContext.Provider value={[ history, dispatch ]}>
//       {children}
//     </historyContext.Provider>
//   )
// }



// export function getPrevNoteHistory(state: TrackNoteEvent[], history: PianoRollHistory): TrackNoteEvent[] {
//   console.log('undo')
//   const nearestHistory = history.histories[history.head]
//   switch(nearestHistory.type) {
//     case PianoRollHistoryItemType.ADD_NOTE: {
//       return state.filter(note =>
//         !nearestHistory.note.some(hNote => hNote.id === note.id)
//       )
//     }
//     case PianoRollHistoryItemType.DELETE_NOTE: {
//       return [...state, ...nearestHistory.note]
//     }
//     case PianoRollHistoryItemType.MODIFY_NOTE: {
//       const modifiedNoteIds = new Map(nearestHistory.note.map(note => [note.id, note]))
//       return state.map(note => modifiedNoteIds.has(note.id)
//         ? modifiedNoteIds.get(note.id) as TrackNoteEvent
//         : note
//       )
//     }
//     default:
//       throw Error('action not defined')
//   }

// }

// export function getNextNoteHistory(state: TrackNoteEvent[], history: PianoRollHistory): TrackNoteEvent[] {
//   const nearestHistory = history.histories[history.head + 1]
//   switch(nearestHistory.type) {
//     case PianoRollHistoryItemType.ADD_NOTE: {
//       return [...state, ...nearestHistory.note]
//     }
//     case PianoRollHistoryItemType.DELETE_NOTE: {
//       return state.filter(note =>
//         !nearestHistory.note.some(hNote => hNote.id === note.id)
//       )
//     }
//     case PianoRollHistoryItemType.MODIFY_NOTE: {
//       const modifiedNoteIds = new Map(nearestHistory.note.map(note => [note.id, note]))
//       return state.map(note => modifiedNoteIds.has(note.id)
//         ? modifiedNoteIds.get(note.id) as TrackNoteEvent
//         : note
//       )
//     }
//     default:
//       throw Error('action not defined')
//   }
// }