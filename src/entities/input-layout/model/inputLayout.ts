


export interface InputLayoutConfig {
  ingame: {
    // ◀️
    moveLeft: ActionConfig
    // ▶️
    moveRight: ActionConfig
    // 🔽
    moveDown: ActionConfig
    // 🔼
    moveUp: ActionConfig
    // ⭳
    hardDrop: ActionConfig
    // ↶
    rotateLeft: ActionConfig
    // ↷
    rotateRight: ActionConfig
    // ⏸️
    pause: ActionConfig
  }
  menu: {
    // 🆗
    ok: ActionConfig
    // ↩️
    back: ActionConfig
    // 🔼
    up: ActionConfig
    // 🔽
    down: ActionConfig
  }
}

export type ActionConfig = InputUnit[]

export type InputUnit = KeyboardKey

export interface KeyboardKey {
  inputMethod: 'keyboard' | 'gamepad'
  key: string
}




// TO_DO [Overengineering]
// export interface InputLayout {
//   name: string
//   config: InputLayoutKeys
// }
