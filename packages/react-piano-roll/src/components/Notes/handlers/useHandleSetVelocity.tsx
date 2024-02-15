import { getNoteObjectFromEvent } from "@/helpers/event";
import { useStore } from "@/hooks/useStore";

function useHandleSetVelocity() {

  const { pianoRollStore } = useStore()

  const handleSetVelocityPD: React.PointerEventHandler = (event) => {
    if (!event.metaKey) {
      return;
    }
    const noteClicked = getNoteObjectFromEvent(pianoRollStore.notes, event);
  }

  function handleSetVelocityPM() {

  }

  function handleSetVelocityPU() {

  }
}
