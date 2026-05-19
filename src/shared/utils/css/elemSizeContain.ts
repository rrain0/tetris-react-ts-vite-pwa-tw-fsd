


// Usage of this applicable only if container of the element has container-type: size;
export function elemSizeContain(elemRatio: number) {
  const elemSizeStyle = {
    // If container is taller, shrink width to fit
    width: `min(100cqw, 100cqh * ${elemRatio})`,
    // If container is wider than desired ratio, shrink height to fit
    height: `min(100cqh, 100cqw / ${elemRatio})`,
  }
  return elemSizeStyle
}
