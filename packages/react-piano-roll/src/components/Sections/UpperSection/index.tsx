import Ruler from "@/components/Ruler";
import SelectionBar from "@/components/SelectionBar";
import TempoInfo from "@/components/TempoInfo";
import styles from "./index.module.scss";
import { useStore } from "@/index";
import { useScaleX } from "@/contexts/ScaleXProvider";

const UpperSection: React.FC = () => {
  const { scaleX } = useScaleX()

  return (
    <div className={styles["container"]}>
      <TempoInfo />
      <div>
        <Ruler scaleX={scaleX} />
        <SelectionBar scaleX={scaleX} />
      </div>
    </div>
  );
};

export default UpperSection;
