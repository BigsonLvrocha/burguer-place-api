build-ts:
	npm run build

build-lambda: build-ts
	sam build

local-run: build-lambda
	sam local start-api