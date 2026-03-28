


const templateXXInputMapping = {
  XX_A_Push: { },
  XX_B_Push: { },
  XX_X_Push: { },
  XX_Y_Push: { },
  
  XX_View_Push: { },
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
  XX_RYUp_Push: { },
  XX_RYDown_Push: { },
  
  XX_RXLeft_Analog: { },
  XX_RXRight_Analog: { },
  XX_RYUp_Analog: { },
  XX_RYDown_Analog: { },
  
  XX_LSB_Push: { },
  XX_RSB_Push: { },
  
  XX_Home_Push: { },
}

// TODO Use cases
const templateUseCasesMapping = {
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
