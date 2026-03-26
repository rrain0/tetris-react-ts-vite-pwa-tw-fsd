import type { GamepadMapping } from '@lib/gamepad-input/mapped/model/mappedGamepad.model.ts'



// Defines no deadzones for analog signals to allow specific game handle it.
export const dInputToXXInputMapping: GamepadMapping = {
  XX_A_Push: { signalId: 'B2', push: 1 },
  XX_B_Push: { signalId: 'B1', push: 1 },
  XX_X_Push: { signalId: 'B3', push: 1 },
  XX_Y_Push: { signalId: 'B0', push: 1 },
  
  XX_Select_Push: { signalId: 'B8', push: 1 },
  XX_Start_Push: { signalId: 'B9', push: 1 },
  
  XX_LB_Push: { signalId: 'B4', push: 1 },
  XX_RB_Push: { signalId: 'B5', push: 1 },
  XX_LT_Push: { signalId: 'B6', pushOffTo: 0.45, pushFrom: 0.5 },
  XX_RT_Push: { signalId: 'B7', pushOffTo: 0.45, pushFrom: 0.5 },
  
  XX_LT_Analog: { signalId: 'B6', analogFrom: 0, analogTo: 1 },
  XX_RT_Analog: { signalId: 'B7', analogFrom: 0, analogTo: 1 },
  
  //XX_DPadL_Push: { },
  //XX_DPadR_Push: { },
  //XX_DPadU_Push: { },
  //XX_DPadD_Push: { },
  
  XX_LXLeft_Push: { signalId: 'A0', push: -1 }, // from DPadL
  XX_LXRight_Push: { signalId: 'A0', push: 1 }, // from DPadR
  XX_LYUp_Push: { signalId: 'A1', push: -1 }, // from DPadU
  XX_LYDown_Push: { signalId: 'A1', push: 1 }, // from DPadD
  
  XX_LXLeft_Analog: { signalId: 'A0', analogFrom: 0, analogTo: -1 }, // from DPadL
  XX_LXRight_Analog: { signalId: 'A0', analogFrom: 0, analogTo: 1 }, // from DPadR
  XX_LYUp_Analog: { signalId: 'A1', analogFrom: 0, analogTo: -1 }, // from DPadU
  XX_LYDown_Analog: { signalId: 'A1', analogFrom: 0, analogTo: 1 }, // from DPadD
  
  //XX_RXLeft_Push: { },
  //XX_RXRight_Push: { },
  //XX_RXUp_Push: { },
  //XX_RXDown_Push: { },
  
  //XX_RXLeft_Analog: { },
  //XX_RXRight_Analog: { },
  //XX_RXUp_Analog: { },
  //XX_RXDown_Analog: { },
  
  XX_LSButton_Push: { signalId: 'B10', push: 1 },
  XX_RSButton_Push: { signalId: 'B11', push: 1 },
}
