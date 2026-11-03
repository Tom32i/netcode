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

# Bump the version, commit and tag it: version@patch, version@minor, version@major
version@%:
	npm version $* -m "v%s"

# Publish package
publish: build
	npm publish . --access public

# Create the GitHub release of the latest tag, once it is pushed
release:
	gh release create "$$(git describe --tags --abbrev=0)" --verify-tag --generate-notes
