import Ruler from "@/components/Ruler";
import SelectionBar from "@/components/SelectionBar";
import TempoInfo from "@/components/TempoInfo";
import styles from "./index.module.scss";

const UpperSection: React.FC = () => {
  return (
    <div className={styles["container"]}>
      <TempoInfo />
      <div>
        <Ruler />
        <SelectionBar />
      </div>
    </div>
  );
};

export default UpperSection;
