import 'react'



declare module 'react' {
  interface HTMLAttributes<T> {
    cn?: string | undefined
    st?: CSSProperties
  }
  interface SVGAttributes<T> {
    cn?: string | undefined
    st?: CSSProperties
  }
}
