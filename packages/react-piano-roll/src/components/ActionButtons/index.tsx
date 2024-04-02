import { RxGroup } from "react-icons/rx";
import { RxPencil1 } from "react-icons/rx";
import styles from "./index.module.scss";
import React, { ComponentProps, forwardRef, useImperativeHandle, useState } from "react";
import { RxColumnSpacing } from "react-icons/rx";
import { RxHobbyKnife } from "react-icons/rx";
import { RxDotsHorizontal } from "react-icons/rx";
import { RxDimensions } from "react-icons/rx";
import { RxHand } from "react-icons/rx";
import { RxQuote, RxCopy, RxScissors, RxClipboard } from "react-icons/rx";
import cx from "clsx/lite";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { notesAtom, selectedNoteIdsAtom } from "@/store/note";
import { PianoRollData } from "@/types/PianoRollData";
import { redoHistoryAtom, undoHistoryAtom } from "@/store/history";
import { LuUndo2, LuRedo2 } from "react-icons/lu";
import { useCopy, useCut, usePaste } from "@/hooks/useClipboard";
import { bpmAtom } from "@/store/bpm";

interface ActionButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
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
  const redo = useSetAtom(redoHistoryAtom);
  const undo = useSetAtom(undoHistoryAtom);
  const copy = useCopy();
  const cut = useCut();
  const paste = usePaste();

  return (
    <div {...props} className={styles.container}>
      {props.children}
      <ActionItem name="undo" onClick={undo}>
        <LuUndo2 />
      </ActionItem>
      <ActionItem name="undo" onClick={redo}>
        <LuRedo2 />
      </ActionItem>
      <ActionItem name="copy" onClick={copy}>
        <RxCopy />
      </ActionItem>
      <ActionItem name="cut" onClick={cut}>
        <RxScissors />
      </ActionItem>
      <ActionItem name="paste" onClick={paste}>
        <RxClipboard />
      </ActionItem>
    </div>
  );
}

export type ActionItemElement = React.ReactElement<ComponentProps<typeof ActionItem>>;

type ActionItemGetter = (get: PianoRollData) => void;
type ActionItemGetterSetter = (get: PianoRollData, set: (notes: PianoRollData) => void) => void;
type ActionItemCallback = ActionItemGetter | ActionItemGetterSetter;

export type ActionItemProps = {
  name: string;
  onClick: (data: PianoRollData, set: (notes: Partial<PianoRollData>) => void) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  hotkey?: string;
};

export type PianoRollActionElement = {
  click: () => void;
};

export const ActionItem = forwardRef<PianoRollActionElement, ActionItemProps>((props, ref) => {
  const [notes, setNotes] = useAtom(notesAtom);
  const [bpm, setBpm] = useAtom(bpmAtom);
  const [selectedNoteIds, setSelectedNoteIds] = useAtom(selectedNoteIdsAtom);

  const data: PianoRollData = {
    notes: notes.map((note) => ({ ...note, isSelected: selectedNoteIds.has(note.id) })),
    bpm: bpm,
  };
  const set = (data: Partial<PianoRollData>) => {
    if (data.notes !== undefined) {
      setNotes(data.notes);
      setSelectedNoteIds(new Set(data.notes.filter((note) => note.isSelected).map((note) => note.id)));
    }
    if (data.bpm !== undefined) {
      setBpm(data.bpm);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      click: () => props.onClick(data, set),
    }),
    [data, set, props.onClick],
  );

  return (
    <button
      key={props.name}
      data-name={props.name}
      data-hotkey={props.hotkey}
      className={cx(styles.item)}
      onClick={() => props.onClick(data, set)}
      disabled={props.disabled}
      style={{ pointerEvents: props.disabled ? "none" : undefined, opacity: props.disabled ? 0.5 : undefined }}
      hidden={props.children === undefined}
    >
      {props.children}
    </button>
  );
});

ActionBar.Action = ActionItem;
