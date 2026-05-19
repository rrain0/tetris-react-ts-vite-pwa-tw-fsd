


// Need to define (buttonI or axisI) and (value or min & max)
export interface GamepadInput {
  inputMethod: 'gamepad'
  device: {
    axesCnt: number
    buttonsCnt: number
    id: string
    mapping: string
    index: number
  }
  name: string
  buttonI?: number | undefined
  axisI?: number | undefined
  value?: number | undefined
  min?: number | undefined
  max?: number | undefined
}


/*
  TODO Gamepad
    name (hardware):
    'B20', 'B21[3.24567]', 'B22[1.22222..3.44555]',
    'A10[3.24567]', 'A11[1.22222..3.44555]',
    name (xinput):
    'A', 'B', 'X', 'Y',
    'LSButton', 'LSUp', 'LSLeft',
    'START', 'SELECT',
    'LB', 'LT', ...
    
  TODO Gamepad
    Button combinations mapping.
    Open window to read input.
    If any changes detected then start countdown 3 secs then autosave.
 */
