import Ruler from "@/components/Ruler";
import SelectionBar from "@/components/SelectionBar";
import TempoInfo from "@/components/TempoInfo";
import styles from "./index.module.scss";
import { useScaleX } from "@/contexts/ScaleXProvider";
import SelectionRangeIndicator from "@/components/SelectionRangeIndicator";

const Rulers: React.FC = () => {
  const { scaleX } = useScaleX();

  return (
    <div style={{ position: "relative" }}>
      <Ruler scaleX={scaleX} />
      <SelectionBar scaleX={scaleX} />
      <SelectionRangeIndicator />
    </div>
  );
};

export default Rulers;
