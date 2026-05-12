
# Define env file
ENV_FILE ?= ./deploy-dev/tetris.react.dev.env

# Load env vars from file to shell
ifneq (,$(wildcard $(ENV_FILE)))
    include $(ENV_FILE)
    export
endif



dev:
	pnpm run dev

dev-proxy:
	$(MAKE) -C ./deploy-dev -f docker-compose.dev.mk docker-compose-dev-build-up
	pnpm run dev
