import type { ComponentProps } from 'react'



export default function IngameControlsButton(props: ComponentProps<'button'>) {
  return <button type='button' cn={ingameControlsButtonCn} {...props}/>
}

const ingameControlsButtonCn = `
  rel
  isolate
  cl-[var(--cl-hud-tx)]
  cursor-[pointer]
  
  before:content-['']
  before:abs
  before:a-[-10%]
  before:z-[-1000]
  before:rad-[16%]
  before:transition-all-200
  
  in-focus:before:bg-cl-[color-mix(in_srgb,currentColor_20%,transparent)]
`
