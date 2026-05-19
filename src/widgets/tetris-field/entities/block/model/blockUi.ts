


export type BlockUiColor =
  | 'blue'
  | 'green'
  | 'lightBlue'
  | 'orange'
  | 'red'
  | 'violet'
  | 'yellow'

export type BlockUiType = BlockUiColor | undefined

export type BlockUiData = {
  type?: BlockUiType | undefined
  translucent?: boolean | undefined
  pixeled?: boolean | undefined
}
