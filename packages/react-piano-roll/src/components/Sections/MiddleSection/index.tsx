import PianoKeyboard from "@/components/PianoKeyboard";
import styles from "./index.module.scss";

type Props = {
  children?: React.ReactNode;
};
const MiddleSection: React.FC<Props> = (props) => {
  return (
    <div className={styles["middle-container"]}>
      <PianoKeyboard />
      <div className={styles["lane-container"]}>{props.children}</div>
    </div>
  );
};

export default MiddleSection;
