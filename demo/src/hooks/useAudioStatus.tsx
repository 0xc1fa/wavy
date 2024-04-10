import { useReducer } from "react";

export type AudioStatus = {
  valid: boolean;
  rendering: boolean;
  getIsRenderingDisabled(): boolean;
  getIsUpToDate(): boolean;
};
export type AudioStatusAction = "NOTE_MODIFIED" | "RENDERING_REQUESTED" | "RENDERING_DONE" | "RENDERING_FAILED";

export function useAudioStatus() {
  return useReducer(
    (state: AudioStatus, action: AudioStatusAction) => {
      switch (action) {
        case "RENDERING_REQUESTED":
          return { ...state, valid: true, rendering: true };
        case "RENDERING_DONE":
          return { ...state, rendering: false };
        case "NOTE_MODIFIED":
          return { ...state, valid: false };
        case "RENDERING_FAILED":
          return { ...state, error: true };
      }
    },
    {
      valid: true,
      rendering: false,
      getIsRenderingDisabled() {
        return this.valid || this.rendering;
      },
      getIsUpToDate() {
        return this.valid && !this.rendering;
      },
    },
  );
}
