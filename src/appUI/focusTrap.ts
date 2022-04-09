export const FOCUSABLE_ELEMENTS_SELECTOR = 'a[href], :enabled:not([type="hidden"]), [tabindex="0"]';

export default function focusTrap(wrapper: HTMLElement): { destroy: () => void } {
  function onKeyPress(e: KeyboardEvent): void {
    if (e.key === "Tab") {
      const focusable = Array.from(wrapper.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR));
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (!e.shiftKey && e.target === last) {
        first.focus();
        e.preventDefault();
      } else if (e.shiftKey && e.target === first) {
        last.focus();
        e.preventDefault();
      }
    }
  }

  wrapper.addEventListener("keydown", onKeyPress, true);

  return {
    destroy(): void {
      wrapper.removeEventListener("keydown", onKeyPress, true);
    },
  };
}
