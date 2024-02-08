import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PianoRoll, PianoRollStoreProvider } from "react-piano-roll";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
