import { TbHandMove } from "react-icons/tb";
import { FaEraser } from "react-icons/fa6";
import { GrSelect } from "react-icons/gr";
import { RiPencilFill } from "react-icons/ri";
import styles from "./index.module.scss";
import React, { useState } from "react";
import { CgNametag } from "react-icons/cg";
import { cn } from "@/helpers/className";

interface ModeSelectProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function ModeSelect(props: ModeSelectProps) {
  const modes = [
    {
      name: "pencil",
      icon: <RiPencilFill />,
    },
    {
      name: "drag",
      icon: <TbHandMove />,
    },
    {
      name: "eraser",
      icon: <FaEraser />,
    },
    {
      name: "select",
      icon: <GrSelect />,
    },
  ] as const;
  const [selected, setSelected] = useState<(typeof modes)[number]["name"]>("pencil");

  return (
    <div {...props} className={styles.container}>
      {modes.map((item) => (
        <div
          key={item.name}
          className={cn(styles.item, selected === item.name && styles.selectedItem)}
          onClick={() => setSelected(item.name)}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}
