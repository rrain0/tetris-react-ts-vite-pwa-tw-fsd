
# Define env file
ENV_FILE ?= ./deploy-stg/tetris.react.stg.env

# Load env vars from file to shell
ifneq (,$(wildcard $(ENV_FILE)))
    include $(ENV_FILE)
    export
endif



stg:
	$(MAKE) -C ./deploy-stg -f docker-compose.stg.mk docker-compose-stg-build-up
