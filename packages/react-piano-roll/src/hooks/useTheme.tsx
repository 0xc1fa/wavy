import { useContext } from "react";
import PianoRollThemeContext from "../contexts/piano-roll-theme-context";

export default function useTheme() {
  const theme = useContext(PianoRollThemeContext)
  return theme;
}