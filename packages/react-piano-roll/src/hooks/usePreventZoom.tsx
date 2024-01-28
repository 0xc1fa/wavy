import { useEffect } from "react";

function usePreventZoom(scrollCheck = true, keyboardCheck = true) {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (
        keyboardCheck &&
        event.ctrlKey &&
        (event.keyCode == 61 ||
          event.keyCode == 107 ||
          event.keyCode == 173 ||
          event.keyCode == 109 ||
          event.keyCode == 187 ||
          event.keyCode == 189)
      ) {
        event.preventDefault();
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (scrollCheck && event.ctrlKey) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [scrollCheck, keyboardCheck]);
}

export default usePreventZoom;
