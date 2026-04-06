


export function elemSizeContain(elemRatio: number) {
  const containerRatio = '(100cqw / 100cqh)'
  const elemSizeStyle = {
    width: `calc(min(1, ${elemRatio} / ${containerRatio}) * 100cqw)`,
    height: `calc(min(1, ${containerRatio} / ${elemRatio}) * 100cqh)`,
  }
  return elemSizeStyle
}
