import { RxGroup } from "react-icons/rx";
import { RxPencil1 } from "react-icons/rx";
import styles from "./index.module.scss";
import React, { ComponentProps, forwardRef, useImperativeHandle, useState } from "react";
import { RxColumnSpacing } from "react-icons/rx";
import { RxHobbyKnife } from "react-icons/rx";
import { RxDotsHorizontal } from "react-icons/rx";
import { RxDimensions } from "react-icons/rx";
import { RxHand } from "react-icons/rx";
import { RxQuote } from "react-icons/rx";
import cx from "clsx/lite";
import { useNotes } from "@/hooks/useNotes";
import { TrackNoteEvent } from "@/types";
import { useAtom } from "jotai";
import { setNotesAtom } from "@/store/note";

interface ActionButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ActionItemElement | ActionItemElement[];
}
export default function ActionBar(props: ActionButtonsProps) {
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

  return <div {...props} className={styles.container} />;
}

export type ActionItemElement = React.ReactElement<ComponentProps<typeof ActionItem>>;

type ActionItemGetter = (get: TrackNoteEvent[]) => void;
type ActionItemGetterSetter = (get: TrackNoteEvent[], set: (notes: TrackNoteEvent[]) => void) => void;
type ActionItemCallback = ActionItemGetter | ActionItemGetterSetter;

export type ActionItemProps = {
  name: string;
  onClick: ActionItemCallback;
  disabled?: boolean;
  controls?: boolean;
  children: React.ReactNode;
} & ({ controls: true; children: React.ReactNode } | { controls: false | undefined });
export const ActionItem = forwardRef((props: ActionItemProps, ref) => {
  const notes = useNotes();
  const [, setNotes] = useAtom(setNotesAtom);

  useImperativeHandle(
    ref,
    () => ({
      exec() {
        props.onClick(notes, setNotes);
      },
    }),
    [notes, setNotes],
  );

  return (
    <button
      key={props.name}
      data-name={props.name}
      className={cx(styles.item)}
      onClick={() => props.onClick(notes, setNotes)}
      disabled={props.disabled}
      style={{ pointerEvents: props.disabled ? "none" : undefined, opacity: props.disabled ? 0.5 : undefined }}
      hidden={!props.controls}
    >
      {props.children}
    </button>
  );
});

ActionBar.Action = ActionItem;
