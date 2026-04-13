


// Extend type of React style prop
// to accept CSS Custom Properties names e.g. { --my-prop: ... }
// and any string value e.g. { color: 'var(--my-prop)' }
declare module 'csstype' {
  export interface Properties<TLength = (string & {}) | 0, TTime = string & {}> extends
    StandardProperties<TLength, TTime>,
    VendorProperties<TLength, TTime>,
    ObsoleteProperties<TLength, TTime>,
    SvgProperties<TLength, TTime>
  {
    // { background: 'var(--bg)' }
    [Prop in string]: string | number | undefined
    // { --bg: '#coffee' }
    [Prop in `--${string}`]: string | number | undefined
  }
}
