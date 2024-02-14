import React, { useRef, useEffect, FC, UIEvent, useLayoutEffect } from "react";
import PianoKeyboard from "./PianoKeyboard";
import PianoRoll from "@/components/PianoRoll";

interface SyncScrollDivsProps {
  pkeyboard: React.ReactNode;
  proll: React.ReactNode;
}
const SyncScrollDivs2: FC<SyncScrollDivsProps> = ({ pkeyboard, proll }) => {
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  let rAFId: number | null = null; // To hold requestAnimationFrame ID

  const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
    if (!rAFId) {
      rAFId = requestAnimationFrame(() => {
        target.scrollTop = source.scrollTop;
        target.scrollLeft = source.scrollLeft;
        rAFId = null; // Reset the ID so it can be called again
      });
    }
  };

  useLayoutEffect(() => {
    const div1 = div1Ref.current;
    const div2 = div2Ref.current;

    if (!div1 || !div2) return; // Ensure both divs are mounted

    const handleScrollDiv1 = (event: Event) => {
      syncScroll(event.currentTarget as HTMLDivElement, div2);
    };

    const handleScrollDiv2 = (event: Event) => {
      syncScroll(event.currentTarget as HTMLDivElement, div1);
    };

    div1.addEventListener("scroll", handleScrollDiv1);
    div2.addEventListener("scroll", handleScrollDiv2);

    return () => {
      if (div1 && div2) {
        div1.removeEventListener("scroll", handleScrollDiv1);
        div2.removeEventListener("scroll", handleScrollDiv2);
      }
      if (rAFId !== null) {
        cancelAnimationFrame(rAFId); // Prevent memory leaks
      }
    };
  }, []);

  // return (
  //   <>
  //     <PianoKeyboard />
  //     <PianoRoll attachLyric={attachLyric!} playheadPosition={playheadPosition} />
  //   </>
  // );

  return (
    <>
      <div ref={div1Ref} style={{ overflow: "scroll", height: "600px" }}>
        {pkeyboard}
      </div>
      <div ref={div2Ref} style={{ overflow: "scroll", height: "600px", width: "800px" }}>
        {proll}
      </div>
    </>
  );
};

export default SyncScrollDivs2;
