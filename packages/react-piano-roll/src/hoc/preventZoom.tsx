const handleWheel = (event: WheelEvent) => {
  if (event.ctrlKey) {
    event.preventDefault();
  }
};

export function disableZoom() {
  document.addEventListener("wheel", handleWheel, { passive: false });
}

export function enableZoom() {
  document.removeEventListener("wheel", handleWheel);
}

export default function preventZoom<
  T extends {
    onPointerEnter?: React.PointerEventHandler<any>;
    onPointerLeave?: React.PointerEventHandler<any>;
  },
>(Component: React.ComponentType<T>, options?: { keyboardCheck?: boolean; scrollCheck?: boolean }) {
  return (props: T) => {
    return <Component {...props} onPointerEnter={disableZoom} onPointerLeave={enableZoom} />;
  };
}
