


docker-compose-stg-build-up:
	docker compose -f docker-compose.stg.yml --env-file tetris.react.stg.env up -d --force-recreate --build
