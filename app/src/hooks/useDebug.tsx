import { useEffect } from "react";

export function useDebug(state: any) {
  useEffect(() => {
    console.log(state)
  }, [state])
}
