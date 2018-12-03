.SILENT:
.PHONY: test

# Install dependencies
install:
	npm install

# Launch watch
watch:
	./node_modules/.bin/webpack --watch --mode=development

# Build lib
build:
	./node_modules/.bin/webpack --mode=production

# Launch demo
start: demo-client demo-server

# Launch demo client
demo-client:
	php -S 0.0.0.0:8000 -t .

# Launch demo server
demo-server:
	node ./demo-server.js 8002

# Lint and code style fix
lint:
	./node_modules/.bin/eslint src/* --ext .js,.json --fix

# Test
test:
	node_modules/.bin/mocha

# Publish package
publish: build
	npm publish . --access public
