.SILENT:
.PHONY: test

# Install dependencies
install:
	npm install

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

# Lint and code style fix
lint:
	npx eslint src/* --ext .js,.json --fix

# Test
test:
	npx mocha

# Publish package
publish: build
	npm publish . --access public
