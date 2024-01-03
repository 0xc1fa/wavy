
export function focusNote(e: Event, id: string) {
  const componentRef = e.currentTarget as HTMLDivElement;
  const childElement = componentRef.querySelector(`[data-noteid="${id}"]`) as HTMLInputElement;
  childElement!.focus();
}
