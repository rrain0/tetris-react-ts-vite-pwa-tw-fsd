
stg:
	$(MAKE) -C ./deploy-stg -f docker-compose.stg.mk \
		docker-compose-stg-build-up
