import { useEffect, useRef, useLayoutEffect } from 'react'

import type { RefObject } from 'react'

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect


type EventMap<T extends EventTarget> = T extends Window ? WindowEventMap :
                                       T extends MediaQueryList ? MediaQueryListEventMap :
                                       T extends HTMLElement ? HTMLElementEventMap :
                                       T extends Document ? DocumentEventMap :
                                       Record<string, Event>; // Default to a generic event map if none of the specified

function useEventListener<T extends EventTarget, K extends keyof EventMap<T>>(
  element: RefObject<MediaQueryList>,
  eventName: K,
  handler: (event: EventMap<T>[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void

// Element Event based useEventListener interface
function useEventListener<
  K extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  T extends Element = K extends keyof HTMLElementEventMap
    ? HTMLDivElement
    : SVGElement,
>(
  element: RefObject<T>,
  eventName: K,
  handler:
    | ((event: HTMLElementEventMap[K]) => void)
    | ((event: SVGElementEventMap[K]) => void),
  options?: boolean | AddEventListenerOptions,
): void

// Document Event based useEventListener interface
function useEventListener<K extends keyof DocumentEventMap>(
  element: RefObject<Document>,
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): void

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | SVGAElement | MediaQueryList = HTMLElement,
>(
  element: RefObject<T>,
  eventName: KW | KH | KM,
  handler: (
    event:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | SVGElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | Event,
  ) => void,
  options?: boolean | AddEventListenerOptions,
) {
  // Create a ref that stores handler
  const savedHandler = useRef(handler)

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current ?? window

    if (!(targetElement && targetElement.addEventListener)) return

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = event => {
      savedHandler.current(event)
    }

    targetElement.addEventListener(eventName, listener, options)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener, options)
    }
  }, [eventName, element, options])
}

export { useEventListener }
