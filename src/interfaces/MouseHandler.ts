
interface MouseHandler {
  readonly onActions: {
    onPointerDown?: (e: PointerEvent) => void;
    onPointerUp?: (e: PointerEvent) => void;
    onPointerMove?: (e: PointerEvent) => void;
    onWheel?: (e: WheelEvent) => void;
    onDblClick? : (e: MouseEvent) => void;
  }
}
