# Tetris


## Play
Play at <https://tetris.rrain.fvds.ru:40300>

## Controls

1) Desktop (keyboard)
> Summary: WASD, QE or JK, Space
- ◀️ ▶️ Move left or right - press or hold A or D
- 🔽 Soft drop - press or hold S
- 🔼 Move up - press or hold W
- ↶ ↷ Rotate left or right - press Q or E or press J or K
- ⭳ Hard drop - press Space

2) Gamepad (XInput)
> Summary: DPad, XY, A or B or LT
- ◀️ ▶️ Move left or right - press or hold DPadL or DPadR
- 🔽 Soft drop - press or hold DPadD
- 🔼 Move up - press or hold DPadU
- ↶ ↷ Rotate left or right - press X or Y
- ⭳ Hard drop - press A or B or LT

3) Mobile (touchpad):
> Summary: Move left or right, up or down. Use buttons (up, down, hard drop) on the left.
- Inspired by the controls of scrolling shooters.
- ◀️ ▶️ Move left or right - Touch and hold then move left or right
- 🔽 Soft drop - down button on the left.
- 🔼 Move up - up button on the left.
- ↶ ↷ Rotate left or right - Touch and hold then move up or down
- ⭳ Hard drop - hard drop button on the left.
- P.S. The touchpad controls need some work.


## Run & Build Configurations

### Run Dev server
Run only dev server.
#### Before run
- You can customize development config by editing `./deploy-dev/tetris.react.dev.env`.
- You can ignore `${PROXY_*}` env vars for this run configuration.
- You need to install deps by `pnpm i`.

#### Run
Under `./` run <br/>
`make -f deploy-dev.mk dev` <br/>
and go to `http://localhost:${REACT_PORT}` e.g. <http://localhost:40109>


### Run Dev server + proxy
Build & run docker nginx proxy and run dev server.
#### Before run
- You can customize development config by editing `./deploy-dev/tetris.react.dev.env`.
- You need to install certificate from `./deploy-dev` on each device where you want to open site.
- You need to add `${PROXY_HOST}` to your OS hosts or router DHCP config.
- You need to install deps by `pnpm i` and install `docker`.

#### Run
Under `./` run <br/>
`make -f deploy-dev.mk dev-proxy` <br/>
and go to `https://${PROXY_HOST}:${PROXY_PORT}` e.g. <https://tetris.dev.rraindev:40100>


### Run Staging
Build project, build react nginx image, build docker nginx proxy, run project in docker.
#### Before run
- You can customize staging config by editing `./deploy-stg/tetris.react.stg.env`.
- You need to install certificate from `./deploy-stg` on each device where you want to open site.
- You need to add `${PROXY_HOST}` to your OS hosts or router DHCP config.
- You need to install `docker`.

#### Run
Under `./` run <br/>
`make -f deploy-stg.mk stg` <br/>
and go to `https://${PROXY_HOST}:${PROXY_PORT}` e.g. <https://tetris.stg.rraindev:40200>



## What I've used / learned making this pet-project

### React + TS + Tailwind + FSD + Vite + PWA

- Используется React 19 + React Compiler.
- Приложение можно собрать в докер.
- Написал собственный Babel плагин для трансформации cn & st пропсов в className & style.


- Играть можно, очки текут, уровни повышаются.
- Пока что более менее готовы движок и экран самой игры.
- Движок реализован на raf и JS генераторах.
- Пауза пока не поддерживается.
- Сохранение прогресса не реализовано.
- Пока что 1 экран самой игры.
- Вёрстка адаптивная под всё на CSS Container Queries.
- Есть режим полного экрана и установка в качестве PWA.
