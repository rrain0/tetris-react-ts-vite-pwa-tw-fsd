
prod-image-build:
	$(MAKE) -C ./deploy-prod -f docker-compose.prod.mk docker-prod-build

prod-image-push:
	$(MAKE) -C ./deploy-prod -f docker-compose.prod.mk docker-prod-push

prod-image-build-push: prod-image-build prod-image-push



prod-pull:
	$(MAKE) -C ./deploy-prod -f docker-compose.prod.mk docker-compose-prod-pull

prod-build:
	$(MAKE) -C ./deploy-prod -f docker-compose.prod.mk docker-compose-prod-build

prod-up:
	$(MAKE) -C ./deploy-prod -f docker-compose.prod.mk docker-compose-prod-up

prod-pull-build-up: prod-pull prod-build prod-up



prod-down:
	$(MAKE) -C ./deploy-prod -f docker-compose.prod.mk docker-compose-prod-down
