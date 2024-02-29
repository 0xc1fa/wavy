import { Provider } from "jotai";

export function PianoRollStoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
