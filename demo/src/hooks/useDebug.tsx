import { useEffect } from "react";

export function useDebug<T>(state: T) {
  useEffect(() => {
    console.log(state);
  }, [state]);
}
