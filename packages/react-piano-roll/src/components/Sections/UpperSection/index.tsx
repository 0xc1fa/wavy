import Ruler from "@/components/Ruler";
import SelectionBar from "@/components/SelectionBar";
import TempoInfo from "@/components/TempoInfo";
import styles from "./index.module.scss";
import { useStore } from "@/index";

const UpperSection: React.FC = () => {
  const { pianoRollStore } = useStore();

  return (
    <div className={styles["container"]}>
      <TempoInfo />
      <div>
        <Ruler scaleX={pianoRollStore.scaleX} />
        <SelectionBar scaleX={pianoRollStore.scaleX} />
      </div>
    </div>
  );
};

export default UpperSection;
