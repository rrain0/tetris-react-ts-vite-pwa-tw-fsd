import type { GamepadMapping } from '@lib/gamepad-input/mapped/model/mappedGamepad.model.ts'



const mappingsToNormalized = {
  // Norm_B_A
  Normalized_Button_A: {
    signals: [{ id: 'B2', push: 1 }],
  },
  Normalized_Button_B: {
    signals: [{ id: 'B1', push: 1 }],
  },
  Normalized_Button_X: {
    signals: [{ id: 'B3', push: 1 }],
  },
  Normalized_Button_Y: {
    signals: [{ id: 'B0', push: 1 }],
  },
}
const mappingsToVirtual = {
  // Virt_B_A
  Virtual_Button_A: {
    signals: [{ id: 'Normalized_Button_A', push: true }],
  },
}
const mappingsToXXInput = {
  // XXInput_A_Push
  XX_A_Push: {
  
  },
}


// Use cases
const mappings___ = {
  // Push => Push
  'A_Push__to__A_Push': { },
  
  // Push => Analog
  'DPadR_Push__to__LXRight_Analog': { },
  
  // Analog => Analog
  'LXUp_Analog__to__LXUp_Analog': { },
  
  // Analog => Push
  'LXLeft_Analog__to__DPadL': { },
  'RT_Analog__to__RT_Push': { },
  
  // Push + Push => Push
  'LT_Push_+_A_Push__to__RB_Push': { },
}

// Result buttons:
const mappingsToXXInput__ = {
  XX_A_Push: { },
  XX_B_Push: { },
  XX_X_Push: { },
  XX_Y_Push: { },
  
  XX_Select_Push: { },
  XX_Start_Push: { },
  
  XX_LB_Push: { },
  XX_RB_Push: { },
  XX_LT_Push: { },
  XX_RT_Push: { },
  
  XX_LT_Analog: { },
  XX_RT_Analog: { },
  
  XX_DPadL_Push: { },
  XX_DPadR_Push: { },
  XX_DPadU_Push: { },
  XX_DPadD_Push: { },
  
  XX_LXLeft_Push: { },
  XX_LXRight_Push: { },
  XX_LYUp_Push: { },
  XX_LYDown_Push: { },
  
  XX_LXLeft_Analog: { },
  XX_LXRight_Analog: { },
  XX_LYUp_Analog: { },
  XX_LYDown_Analog: { },
  
  XX_RXLeft_Push: { },
  XX_RXRight_Push: { },
  XX_RXUp_Push: { },
  XX_RXDown_Push: { },
  
  XX_RXLeft_Analog: { },
  XX_RXRight_Analog: { },
  XX_RXUp_Analog: { },
  XX_RXDown_Analog: { },
  
  XX_LSButton_Push: { },
  XX_RSButton_Push: { },
}

// Defines no deadzones for analog signals to allow specific game handle it.
export const DInputSignalToXInputMapping: GamepadMapping = {
  XX_A_Push: { signalId: 'B2', push: 1 },
  XX_B_Push: { signalId: 'B1', push: 1 },
  XX_X_Push: { signalId: 'B3', push: 1 },
  XX_Y_Push: { signalId: 'B0', push: 1 },
  
  XX_Select_Push: { signalId: 'B8', push: 1 },
  XX_Start_Push: { signalId: 'B9', push: 1 },
  
  XX_LB_Push: { signalId: 'B4', push: 1 },
  XX_RB_Push: { signalId: 'B5', push: 1 },
  XX_LT_Push: { signalId: 'B6', pushFrom: 0.5, pushTo: 1, pushOffFrom: 0, pushOffTo: 0.45 },
  XX_RT_Push: { signalId: 'B7', pushFrom: 0.5, pushTo: 1, pushOffFrom: 0, pushOffTo: 0.45 },
  
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
