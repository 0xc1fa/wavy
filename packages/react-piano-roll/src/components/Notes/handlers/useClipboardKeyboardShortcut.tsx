import { RefObject } from "react";
import { useEventListener } from "@/hooks/useEventListener";
import { useCopy, useCut, usePaste } from "@/hooks/useClipboard";

export function useClipboardKeyboardShortcut<T extends HTMLElement>(ref: RefObject<T>) {
  const keyCodeMapping = { KeyC: useCopy(), KeyX: useCut(), KeyV: usePaste() } as const;

  useEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      if (!event.metaKey || !(event.code in keyCodeMapping)) return;
      event.preventDefault();
      event.stopPropagation();
      keyCodeMapping[event.code as keyof typeof keyCodeMapping]();
    },
    ref,
  );
}
