const dispatchToggle = (element: HTMLElement, newState: 'open' | 'closed') => {
  const event = new Event('toggle');
  Object.defineProperties(event, {
    newState: { value: newState },
    oldState: { value: newState === 'open' ? 'closed' : 'open' },
  });
  element.dispatchEvent(event);
};

const isPopoverOpen = (element: HTMLElement) => element.dataset.popoverOpen === 'true';

const setPopoverOpen = (element: HTMLElement, isOpen: boolean) => {
  if (isPopoverOpen(element) === isOpen) return;

  element.dataset.popoverOpen = String(isOpen);
  element.style.display = isOpen ? 'block' : '';
  dispatchToggle(element, isOpen ? 'open' : 'closed');
};

export const installDomPolyfills = () => {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };

  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.open) return;

    this.open = false;
    this.dispatchEvent(new Event('close'));
  };

  HTMLElement.prototype.showPopover = function showPopover(this: HTMLElement) {
    setPopoverOpen(this, true);
  };

  HTMLElement.prototype.hidePopover = function hidePopover(this: HTMLElement) {
    setPopoverOpen(this, false);
  };

  HTMLElement.prototype.togglePopover = function togglePopover(this: HTMLElement) {
    const isOpen = !isPopoverOpen(this);
    setPopoverOpen(this, isOpen);
    return isOpen;
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element && event.target.closest('[popovertarget]');
    const targetId = trigger ? trigger.getAttribute('popovertarget') : null;

    if (targetId) document.getElementById(targetId)?.togglePopover();
  });

  Element.prototype.scrollIntoView = function scrollIntoView() {};

  Element.prototype.scrollTo = function scrollTo() {};

  window.scrollTo = function scrollTo() {};

  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList;

  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;

  Object.defineProperty(document, 'fonts', {
    value: { ready: Promise.resolve() },
    configurable: true,
  });
};
