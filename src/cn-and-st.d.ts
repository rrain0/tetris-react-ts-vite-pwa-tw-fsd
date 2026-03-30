import 'react'



declare module 'react' {
  interface HTMLAttributes<T> {
    cn?: string | undefined
    st?: Record<string, string | number | undefined>
  }
  interface SVGAttributes<T> {
    cn?: string | undefined
    st?: Record<string, string | number | undefined>
  }
}
