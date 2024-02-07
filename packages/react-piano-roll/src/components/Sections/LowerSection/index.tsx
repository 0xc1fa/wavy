import VelocityEditor from "@/components/VelocityEditor";
import styles from "./index.module.scss";

const LowerSection: React.FC = () => {
  
  return (
    <div className={styles["lower-container"]}>
      <VelocityEditor />
    </div>
  );
};

export default LowerSection;
