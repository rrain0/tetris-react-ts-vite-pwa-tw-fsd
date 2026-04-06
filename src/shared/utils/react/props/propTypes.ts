import React, { type ComponentProps, type ReactNode } from 'react'



export type StylePropType = React.CSSProperties
export type ClassNamePropType = string
export type ChildrenPropType = ReactNode

export type DivProps = ComponentProps<'div'>
export type StyleProp = { style?: StylePropType | undefined }
export type ClassNameProp = { className?: ClassNamePropType | undefined }
export type ChildrenProp = { children?: ChildrenPropType | undefined }

// Short aliases
export type Div = DivProps
export type Children = ChildrenProp
export type CnSt = ClassNameProp & StyleProp
export type CnStCh = ClassNameProp & StyleProp & ChildrenProp
