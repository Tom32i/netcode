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

# Launch demo server
demo-server:

	node ./demo-server.js 8002
## Start server
#demo-server-go: export GODEBUG=gctrace=1
demo-server-go:
	go run demo-server.go

# Lint and code style fix
lint:
	npx eslint src/* --ext .js,.json --fix
	gofmt -s -w .

# Test
test: build
	npx mocha

# Publish package
publish: build
	npm publish . --access public
