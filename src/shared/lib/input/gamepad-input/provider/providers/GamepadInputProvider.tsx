import GamepadChangeProvider
  from '@@/lib/input/gamepad-input/change/providers/GamepadChangeProvider.tsx'
import MappedGamepadProvider
  from '@@/lib/input/gamepad-input/mapped/providers/MappedGamepadProvider.tsx'
import NativeGamepadProvider
  from '@@/lib/input/gamepad-input/native/providers/NativeGamepadProvider.tsx'
import type { Children } from '@@/utils/react/props/propTypes.ts'



function GamepadProvider({ children }: Children) {
  return (
    <NativeGamepadProvider>
      <MappedGamepadProvider>
        <GamepadChangeProvider>
          {children}
        </GamepadChangeProvider>
      </MappedGamepadProvider>
    </NativeGamepadProvider>
  )
}

export default GamepadProvider
