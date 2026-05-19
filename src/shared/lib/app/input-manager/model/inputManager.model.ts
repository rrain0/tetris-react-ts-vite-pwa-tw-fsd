


export type PointerId = number

export type PointerInputData = { type: 'pointer', pointerId: PointerId }

export type InputData =
  | PointerInputData

export type InputId = string | number

export type InputIdData = { inputId: InputId } & InputData
