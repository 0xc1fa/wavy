import { RxGroup } from "react-icons/rx";
import { RxPencil1 } from "react-icons/rx";
import styles from "./index.module.scss";
import React, { ComponentProps, useState } from "react";
import { RxColumnSpacing } from "react-icons/rx";
import { RxHobbyKnife } from "react-icons/rx";
import { RxDotsHorizontal } from "react-icons/rx";
import { RxDimensions } from "react-icons/rx";
import { RxHand } from "react-icons/rx";
import { RxQuote } from "react-icons/rx";
import cx from "clsx/lite";

interface ActionButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ActionItemElement | ActionItemElement[];
}
export default function ActionButtons(props: ActionButtonsProps) {
  const modes = [
    { name: "pencil", icon: <RxPencil1 /> },
    { name: "hand", icon: <RxHand /> },
    { name: "lyric", icon: <RxQuote /> },
    { name: "dimensions", icon: <RxDimensions /> },
    { name: "select", icon: <RxGroup /> },
    { name: "legato", icon: <RxColumnSpacing /> },
    { name: "slice", icon: <RxHobbyKnife /> },
    { name: "more", icon: <RxDotsHorizontal /> },
  ] as const;
  const [selected, setSelected] = useState<(typeof modes)[number]["name"]>("pencil");

  // return (
  //   <div {...props} className={styles.container}>
  //     {modes.map((item) => (
  //       <button
  //         key={item.name}
  //         className={cx(styles.item, selected === item.name && styles.selectedItem)}
  //         onClick={() => setSelected(item.name)}
  //       >
  //         {item.icon}
  //       </button>
  //     ))}
  //   </div>
  // );


  return (
    <div {...props} className={styles.container} />
  );
}


export type ActionItemElement = React.ReactElement<ComponentProps<typeof ActionItem>>
export interface ActionItemProps {
  name: string;
  onClick: () => void;
  children: React.ReactNode;
}
export function ActionItem({ name, onClick, children }: ActionItemProps) {
  return (
    <button
      key={name}
      data-name={name}
      className={cx(styles.item)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

ActionButtons.Item = ActionItem;
