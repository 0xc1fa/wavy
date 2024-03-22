import styles from "./index.module.scss";
import cx from "clsx/lite";
import { LuUndo2, LuRedo2, LuAlignJustify } from "react-icons/lu";

interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function Menu(props: MenuProps) {
  const modes = [
    { name: "menu", icon: <LuAlignJustify />, collaspe: false },
    { name: "undo", icon: <LuUndo2 />, collaspe: true },
    { name: "redo", icon: <LuRedo2 />, collaspe: true },
  ] as const;

  return (
    <div {...props} className={styles.container}>
      {modes.map((item) => (
        <div key={item.name} className={cx(styles.item, item.collaspe && styles.collaspeItem)}>
          {item.icon}
        </div>
      ))}
    </div>
  );
}
