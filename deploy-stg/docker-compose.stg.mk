
docker-compose-stg-build-up:
	docker compose \
		-f ./docker-compose.stg.yaml --env-file ./tetris.react.stg.env \
		up -d --force-recreate --build

