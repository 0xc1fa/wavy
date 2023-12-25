
export function focusNote(e: Event, id: string) {
  const componentRef = e.currentTarget as HTMLDivElement;
  const childElement = componentRef.querySelector(`[data-index="${id}"]`) as HTMLInputElement;
  childElement!.focus();
}
