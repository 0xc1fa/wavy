import { useEffect } from "react";
import { BlobWithUrl } from "./useBlobUrl";

export function useLoadAudioSource(audioRef: React.RefObject<HTMLAudioElement>, audioSource: BlobWithUrl | null) {
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (audioSource) {
      if (audioRef.current.paused) {
        audioRef.current.src = audioSource.url;
        audioRef.current.load();
      } else {
        audioRef.current.src = audioSource.url;
        audioRef.current.pause();
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  }, [audioSource]);
}
