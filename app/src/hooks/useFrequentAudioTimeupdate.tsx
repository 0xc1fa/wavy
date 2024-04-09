import { useEffect } from "react";

export function useFrequentAudioTimeupdate(audioRef: React.RefObject<HTMLAudioElement>) {
  useEffect(() => {
    const interval = setInterval(function () {
      if (!audioRef.current?.paused) {
        requestAnimationFrame(() => {
          audioRef.current?.dispatchEvent(new Event("timeupdate"));
        });
      }
    }, 1000 / 60);
    return () => clearInterval(interval);
  });
}
