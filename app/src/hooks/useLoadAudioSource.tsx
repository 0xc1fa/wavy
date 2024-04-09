import { useEffect } from "react";
import { BlobWithUrl } from "./useBlobUrl";

export function useLoadAudioSource(audioRef: React.RefObject<HTMLAudioElement>, audioSource: BlobWithUrl | null) {
  useEffect(() => {
    if (audioSource) {
      if (audioRef.current?.paused) {
        audioRef.current?.load();
      } else {
        audioRef.current?.pause();
        audioRef.current?.load();
        audioRef.current?.play();
      }
    }
  }, [audioSource]);
}
