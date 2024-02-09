import { useRef, useEffect } from "react";
import throttle from "lodash/throttle";

export function useSyncScrollTop<T extends HTMLElement, U extends HTMLElement>(
  refA: React.RefObject<T>,
  refB: React.RefObject<U>,
) {
  useEffect(() => {
    const handleScrollA = () => {
      // requestAnimationFrame(() => {
      refB.current?.removeEventListener("scroll", handleScrollB);
      refB.current?.scrollTo({ behavior: "instant", top: refA.current?.scrollTop });
      window.requestAnimationFrame(() => refB.current?.addEventListener("scroll", handleScrollB));
      // });
    }; // Adjust throttle time as needed

    const handleScrollB = () => {
      // requestAnimationFrame(() => {
      refA.current?.removeEventListener("scroll", handleScrollA);
      refA.current?.scrollTo({ behavior: "instant", top: refB.current?.scrollTop });
      window.requestAnimationFrame(() => refA.current?.addEventListener("scroll", handleScrollA));
      // });
    }; // Adjust throttle time as needed

    const elementA = refA.current;
    const elementB = refB.current;

    if (elementA) {
      elementA.addEventListener("scroll", handleScrollA);
    }
    if (elementB) {
      elementB.addEventListener("scroll", handleScrollB);
    }

    return () => {
      if (elementA) {
        elementA.removeEventListener("scroll", handleScrollA);
      }
      if (elementB) {
        elementB.removeEventListener("scroll", handleScrollB);
      }
    };
  }, [refA, refB]); // Ensure effect re-runs if refs change
}
