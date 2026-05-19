
# Define env file
ENV_FILE ?= ./tetris.react.prod.env

# Load env vars from file to make
ifneq (,$(wildcard $(ENV_FILE)))
    include $(ENV_FILE)
endif



docker-prod-build:
	docker build \
		-f ./Dockerfile \
		-t $(DOCKER_IMAGE_NAMESPACE)/tetris-prod-react-react:$(DOCKER_IMAGE_VERSION) \
		../

docker-prod-push:
	docker push \
		$(DOCKER_IMAGE_NAMESPACE)/tetris-prod-react-react:$(DOCKER_IMAGE_VERSION)



docker-compose-prod-pull:
	docker compose \
		-f ./docker-compose.prod.yaml --env-file ./tetris.react.prod.env \
		pull

docker-compose-prod-build:
	docker compose \
		-f ./docker-compose.prod.yaml --env-file ./tetris.react.prod.env \
		build

docker-compose-prod-up:
	docker compose \
		-f ./docker-compose.prod.yaml --env-file ./tetris.react.prod.env \
		up -d --force-recreate



docker-compose-prod-down:
	docker compose \
		-f ./docker-compose.prod.yaml --env-file ./tetris.react.prod.env \
		down
