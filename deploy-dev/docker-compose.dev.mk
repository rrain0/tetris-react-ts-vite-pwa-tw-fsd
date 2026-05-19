


docker-compose-dev-build-up:
	docker compose \
		-f ./docker-compose.dev.yaml --env-file ./tetris.react.dev.env \
		up -d --force-recreate --build

