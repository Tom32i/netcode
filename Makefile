.SILENT:
.PHONY: test

# Install dependencies
install:
	npm install
	go get all

# Update dependencies
update:
	npm update
	go get -u all

# Launch watcher
watch:
	npm run watch

# Launch dev server
start:
	npm run start

# Build lib
build: build-client build-server

build-client:
	npm run build

build-server:
	npm run node-build

# Preview lib
preview:
	npm run preview

# Launch NodeJS demo server
server-node:
	node ./demo/server.js 8002

# Launch NodeJS demo server
server-node-common: build
	node ./demo/server.cjs 8002

## Launch Golang demo server
server-go:
	go run demo/server.go

# Lint and code style fix
lint: lint-js lint-go

lint-js:
	npm run lint

lint-go:
	gofmt -s -w .

# Test
test: test-js test-go

test-js: build
	npx mocha

test-go:
	go test ./go/...

# Publish package
publish: build
	npm publish . --access public
