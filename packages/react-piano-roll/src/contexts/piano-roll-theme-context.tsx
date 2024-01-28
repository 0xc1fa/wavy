import { createContext } from "react";
import { defaultPianoRollTheme } from "../store/pianoRollTheme";

const PianoRollThemeContext = createContext(defaultPianoRollTheme())
export default PianoRollThemeContext;