import type { InputLayoutConfig } from '@/entities/input-layout/model/inputLayout.ts'



export const inputLayoutConfigDefault: InputLayoutConfig = {
  ingame: {
    moveLeft: [
      { inputMethod: 'keyboard', key: 'KeyA' },
      { inputMethod: 'gamepad', key: 'XX_DPadL_Push' },
      { inputMethod: 'gamepad', key: 'XX_LXLeft_Push' },
    ],
    moveRight: [
      { inputMethod: 'keyboard', key: 'KeyD' },
      { inputMethod: 'gamepad', key: 'XX_DPadR_Push' },
      { inputMethod: 'gamepad', key: 'XX_LXRight_Push' },
    ],
    moveDown: [
      { inputMethod: 'keyboard', key: 'KeyS' },
      { inputMethod: 'gamepad', key: 'XX_DPadD_Push' },
      { inputMethod: 'gamepad', key: 'XX_LYDown_Push' },
    ],
    moveUp: [
      { inputMethod: 'keyboard', key: 'KeyW' },
      { inputMethod: 'gamepad', key: 'XX_DPadU_Push' },
      { inputMethod: 'gamepad', key: 'XX_LYUp_Push' },
    ],
    rotateLeft: [
      { inputMethod: 'keyboard', key: 'KeyJ' },
      { inputMethod: 'keyboard', key: 'KeyQ' },
      { inputMethod: 'gamepad', key: 'XX_X_Push' },
    ],
    rotateRight: [
      { inputMethod: 'keyboard', key: 'KeyK' },
      { inputMethod: 'keyboard', key: 'KeyE' },
      { inputMethod: 'gamepad', key: 'XX_Y_Push' },
    ],
    hardDrop: [
      { inputMethod: 'keyboard', key: 'Space' },
      { inputMethod: 'gamepad', key: 'XX_RT_Push' },
      { inputMethod: 'gamepad', key: 'XX_A_Push' },
      { inputMethod: 'gamepad', key: 'XX_B_Push' },
    ],
    pause: [
      { inputMethod: 'keyboard', key: 'Escape' },
      { inputMethod: 'gamepad', key: 'XX_Start_Push' },
    ],
  },
  menu: {
    ok: [
      { inputMethod: 'keyboard', key: 'Enter' },
      { inputMethod: 'keyboard', key: 'NumpadEnter' },
      { inputMethod: 'keyboard', key: 'Space' },
      { inputMethod: 'gamepad', key: 'XX_A_Push' },
      { inputMethod: 'gamepad', key: 'XX_Start_Push' },
    ],
    back: [
      { inputMethod: 'keyboard', key: 'Escape' },
      { inputMethod: 'gamepad', key: 'XX_B_Push' },
    ],
    up: [
      { inputMethod: 'keyboard', key: 'KeyW' },
      { inputMethod: 'keyboard', key: 'ArrowUp' },
      { inputMethod: 'gamepad', key: 'XX_DPadU_Push' },
      { inputMethod: 'gamepad', key: 'XX_LYUp_Push' },
    ],
    down: [
      { inputMethod: 'keyboard', key: 'KeyS' },
      { inputMethod: 'keyboard', key: 'ArrowDown' },
      { inputMethod: 'gamepad', key: 'XX_DPadD_Push' },
      { inputMethod: 'gamepad', key: 'XX_LYDown_Push' },
    ],
  },
}


/*
 About drops:
 ⬤ Soft drop - pressing and holding Down to make the piece fall faster than normal gravity.
 After reaching the bottom there is lock delay.
 Pressing Down at the bottom must not remove lock delay.
 ⬤ Firm drop (sonic drop) - instantly send piece to the bottom but with lock delay.
 Pressing Down at the bottom must not remove lock delay.
 ⬤ Hard drop (sonic lock) - instantly send piece to the bottom and instantly lock it.
 ⬤ https://harddrop.com/wiki/Drop
 */


/*
 TO_DO [Overengineering] InputConfig - input layouts
 Игроки.
 1) Можно сделать player 1, 2, 3, 4 (player (number or id) -> type -> action).
 2) Layout by player then by device.
 3) When players enter the game, they button.
 It selects first layout with this button (or i may show a list of matched layouts to select).
 4) Но обычно в современных играх при начале игры игроки поочерёдно нажимают кнопки
 и так выбирается устройство для каждого игрока.
 но есть момент, что на клавиатуре может играть и 2 игрока.
 Тогда можно создать InputLayout и по кнопке атаке при добавлении игроков выбирать InputLayout
 5) Как-то при включении игры надо выбирать layout,
 если ничего не может выбраться - включать дефолтный.
 6) Можно создавать маппинг, потом перевыбирать его для другого устройства,
 а потом из маппинга делать инпут конфиг.
 7) Input devices. Input config.
 8) Один девайс может использоваться несколькими игроками.
 Установить флаги, что что девайс только для одного игрока (геймпад)
 */

// TO_DO [Overengineering] InputConfig - комбинации клавиш (например 2 кнопки вместе)
