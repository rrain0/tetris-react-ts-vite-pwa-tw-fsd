import 'react'



// Modern browser treat 'click' event as pointer event
// so native 'click' event must be pointer event.

type NativePointerEvent = PointerEvent

declare module 'react' {
  declare namespace React {
    interface DOMAttributes<T> {
      onClick?: MouseEventHandler<T, NativePointerEvent> | undefined
    }
  }
}
