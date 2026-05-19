import type { Children } from '@@/utils/react/props/propTypes.ts'
import { createPortal } from 'react-dom'



export default function ModalPortal({ children }: Children) {
  const modalView = document.getElementById('modal-outlet')
  
  return modalView && createPortal(children, modalView)
}
