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
- You need to install `make`, `node 22`, `pnpm`.
- You need to install deps by `pnpm i`.

#### Run
Under `./` run <br/>
`make -f deploy-dev.mk dev` <br/>
and go to `http://localhost:${REACT_PORT}` e.g. <http://localhost:40109>



### Run Dev proxy
Build & run docker nginx proxy (you need to run dev server manually).
#### Before run
- You can customize development config by editing `./deploy-dev/tetris.react.dev.env`.
- You need to install certificate from `./deploy-dev` on each device where you want to open site.
- You need to add `${PROXY_HOST}` to your OS hosts or router DHCP config.
- You need to install `make`, `docker`.

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
- You need to install `make`, `docker`.

#### Run
Under `./` run <br/>
`make -f deploy-stg.mk stg` <br/>
and go to `https://${PROXY_HOST}:${PROXY_PORT}` e.g. <https://tetris.stg.rraindev:40200>



### Run Production
Build project, build react nginx image, build docker nginx proxy, run project in docker.
#### Before run
- You can customize production config by editing `./deploy-prod/tetris.react.prod.env` (private file).

#### Run
Under `./` run <br/>
`make -f deploy-prod.mk prod-pull-build-up` <br/>
and go to `https://${PROXY_HOST}:${PROXY_PORT}` e.g. <https://tetris.rrain.fvds.ru:40300>



## What I've used / learned making this pet-project

#### Main stack: React + TS + Tailwind + FSD + Vite + PWA

- `React 19` + `React Compiler` is used.
- `Docker` deploy + multiple deploy configurations.
- My own handwritten `Babel plugin` to transform cn & st into className & style.


- For now, you can just play: points flow, levels increase.
- For now, the engine and the single game screen itself are more or less ready.
- The engine is implemented using `raf` and `JS generators`.
- Game pause is not supported yet.
- Saving progress is not implemented.
- Responsive layout for everything using CSS Container Queries.
- Fullscreen mode.
- PWA installation.
- Pull request to squash merge from dev to main + version tag.
