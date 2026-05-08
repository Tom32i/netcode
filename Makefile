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

# Launch client dev server
start:
	npm run start

# Launch client watcher
watch:
	npm run watch

# Build lib
build:
	npm run build

# Launch NodeJS demo server
server-node:
	node ./demo/server.js 8002

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

test-js:
	npm run test

test-go:
	go test ./go/...

# Publish package
publish: build
	npm publish . --access public
