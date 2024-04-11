import { RefObject } from "react";
import { useEventListener } from "@/hooks/useEventListener";
import { useCopy, useCut, usePaste } from "@/hooks/useClipboard";

export function useClipboardHotkey<T extends HTMLElement>(ref: RefObject<T>) {
  const keyCodeMapping = { KeyC: useCopy(), KeyX: useCut(), KeyV: usePaste() } as const;

  useEventListener(ref, "keydown", (event: KeyboardEvent) => {
    if (!event.metaKey || !(event.code in keyCodeMapping)) return;
    event.preventDefault();
    keyCodeMapping[event.code as keyof typeof keyCodeMapping]();
  });
}
