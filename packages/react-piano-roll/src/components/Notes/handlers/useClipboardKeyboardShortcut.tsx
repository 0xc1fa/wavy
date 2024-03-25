import { RefObject } from "react";
import { useEventListener } from "@/hooks/useEventListener";
import { useCopy, useCut, usePaste } from "@/hooks/useClipboard";

export function useClipboardKeyboardShortcut<T extends HTMLElement>(ref: RefObject<T>) {
  const keyCodeMapping = { KeyC: useCopy(), KeyX: useCut(), KeyV: usePaste() };

  function isValidKeys<T extends keyof typeof keyCodeMapping>(code: string): code is T {
    return code in keyCodeMapping;
  }

  const clipbaordHandler = (event: KeyboardEvent) => {
    if (!event.metaKey || !isValidKeys(event.code)) return;
    event.preventDefault();
    event.stopPropagation();
    keyCodeMapping[event.code]();
  };

  useEventListener(ref, "keydown", clipbaordHandler);
}
