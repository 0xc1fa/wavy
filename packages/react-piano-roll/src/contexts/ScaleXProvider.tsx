import { createContext, useContext, useState } from "react";

type ScaleXContextType = {
  scaleX: number;
  setScaleX: React.Dispatch<React.SetStateAction<number>>;
};
const ScaleXContext = createContext<ScaleXContextType>(undefined!);

type ScaleXProviderProps = {
  children: React.ReactNode;
};
export const ScaleXProvider: React.FC<ScaleXProviderProps> = ({ children }) => {
  const [scaleX, setScaleX] = useState(1);
  return <ScaleXContext.Provider value={{ scaleX, setScaleX }}>{children}</ScaleXContext.Provider>;
};

export function useScaleX() {
  return useContext(ScaleXContext);
}
