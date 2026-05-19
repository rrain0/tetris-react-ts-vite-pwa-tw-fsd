import type { GamepadMapping } from '@@/lib/input/gamepad-input/mapped/model/mappedGamepad.model.ts'



// Defines no deadzones for analog signals to allow specific game handle them.
export const dInputPS3ToXXInputMapping: GamepadMapping = {
  XX_A_Push: { signalId: 'B2', push: 1 },
  XX_B_Push: { signalId: 'B1', push: 1 },
  XX_X_Push: { signalId: 'B3', push: 1 },
  XX_Y_Push: { signalId: 'B0', push: 1 },
  
  XX_View_Push: { signalId: 'B8', push: 1 },
  XX_Start_Push: { signalId: 'B9', push: 1 },
  
  XX_LB_Push: { signalId: 'B4', push: 1 },
  XX_RB_Push: { signalId: 'B5', push: 1 },
  
  XX_LT_Push: { signalId: 'B6', pushOffTo: 0.45, pushFrom: 0.5 },
  XX_RT_Push: { signalId: 'B7', pushOffTo: 0.45, pushFrom: 0.5 },
  
  XX_LT_Analog: { signalId: 'B6', analog: [0, 1] },
  XX_RT_Analog: { signalId: 'B7', analog: [0, 1] },
  
  XX_DPadL_Push: {
    operator: 'or',
    signals: [
      { signalId: 'A9', push: +0.42857 }, // DownLeft
      { signalId: 'A9', push: +0.71429 }, // Left
      { signalId: 'A9', push: +1.00000 }, // UpLeft
    ],
  },
  XX_DPadR_Push: {
    operator: 'or',
    signals: [
      { signalId: 'A9', push: -0.14286 }, // DownRight
      { signalId: 'A9', push: -0.42857 }, // Right
      { signalId: 'A9', push: -0.71429 }, // UpRight
    ],
  },
  XX_DPadU_Push: {
    operator: 'or',
    signals: [
      { signalId: 'A9', push: +1.00000 }, // UpLeft
      { signalId: 'A9', push: -1.00000 }, // Up
      { signalId: 'A9', push: -0.71429 }, // UpRight
    ],
  },
  XX_DPadD_Push: {
    operator: 'or',
    signals: [
      { signalId: 'A9', push: +0.42857 }, // DownLeft
      { signalId: 'A9', push: +0.14286 }, // Down
      { signalId: 'A9', push: -0.14286 }, // DownRight
    ],
  },
  
  XX_LXLeft_Push: { signalId: 'A0', pushOffFrom: -0.45, pushTo: -0.5 },
  XX_LXRight_Push: { signalId: 'A0', pushOffTo: 0.45, pushFrom: 0.5 },
  XX_LYUp_Push: { signalId: 'A1', pushOffFrom: -0.45, pushTo: -0.5 },
  XX_LYDown_Push: { signalId: 'A1', pushOffTo: 0.45, pushFrom: 0.5 },
  
  XX_LXLeft_Analog: { signalId: 'A0', analog: [0, -1] },
  XX_LXRight_Analog: { signalId: 'A0', analog: [0, 1] },
  XX_LYUp_Analog: { signalId: 'A1', analog: [0, -1] },
  XX_LYDown_Analog: { signalId: 'A1', analog: [0, 1] },
  
  XX_RXLeft_Push: { signalId: 'A2', pushOffFrom: -0.45, pushTo: -0.5 },
  XX_RXRight_Push: { signalId: 'A2', pushOffTo: 0.45, pushFrom: 0.5 },
  XX_RYUp_Push: { signalId: 'A5', pushOffFrom: -0.45, pushTo: -0.5 },
  XX_RYDown_Push: { signalId: 'A5', pushOffTo: 0.45, pushFrom: 0.5 },
  
  XX_RXLeft_Analog: { signalId: 'A2', analog: [0, -1] },
  XX_RXRight_Analog: { signalId: 'A2', analog: [0, 1] },
  XX_RYUp_Analog: { signalId: 'A5', analog: [0, -1] },
  XX_RYDown_Analog: { signalId: 'A5', analog: [0, 1] },
  
  XX_LSB_Push: { signalId: 'B10', push: 1 },
  XX_RSB_Push: { signalId: 'B11', push: 1 },
  
  XX_Home_Push: { signalId: 'B12', push: 1 },
}
