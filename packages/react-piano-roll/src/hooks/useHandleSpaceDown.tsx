import { MutableRefObject, RefObject, useEffect, useRef } from "react";

export function useHandleSpaceDown<T extends HTMLElement>(ref: RefObject<T>) {
  let spaceDown = useRef(false);

  const spaceDownHandler = (event: KeyboardEvent) => handleSpaceDown(event, spaceDown);
  const spaceUpHandler = (event: KeyboardEvent) => handleSpaceUp(event, spaceDown);

  useEffect(() => {
    ref.current!.addEventListener("keydown", spaceDownHandler);
    ref.current!.addEventListener("keyup", spaceUpHandler);

    return () => {
      ref.current!.removeEventListener("keydown", spaceDownHandler);
      ref.current!.removeEventListener("keyup", spaceUpHandler);
    };
  }, []);
}

function handleSpaceDown(event: KeyboardEvent, spaceDown: MutableRefObject<boolean>) {
  if (event.code === "Space") {
    event.preventDefault();
    if (spaceDown.current) {
      return;
    }
    spaceDown.current = true;
    console.log("space down");
  }
}

function handleSpaceUp(event: KeyboardEvent, spaceDown: MutableRefObject<boolean>) {
  if (event.code === "Space") {
    event.preventDefault();
    spaceDown.current = false;
  }
}
