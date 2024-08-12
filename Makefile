.SILENT:
.PHONY: test

# Install dependencies
install:
	npm install
	go get

# Launch watch
watch:
	npx webpack --watch --mode=development

# Build lib
build:
	npx webpack --mode=production

# Launch demo client
demo-client:
	php -S 0.0.0.0:8000 -t .

# Launch Node demo server
demo-server-node: build
	node ./demo/server.js 8002

## Launch Golang demo server
#demo-server-go: export GODEBUG=gctrace=1
demo-server-go:
	go run demo/server.go

# Lint and code style fix
lint: lint-js lint-go

lint-js:
	npx eslint demo/**/*.js src/** --fix

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
