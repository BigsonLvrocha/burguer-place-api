start-db:
	docker compose up db -d

build-lambda: 
	docker image rm burguerplacefunction:rapid-x86_64 || echo "no image"
	sam build

local-run: build-lambda start-db
	sam local start-api --docker-network=burguer-place-api --env-vars=env.json