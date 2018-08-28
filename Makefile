install:
	npm install

watch:
	./node_modules/.bin/webpack --watch --mode=development

build:
	./node_modules/.bin/webpack --mode=production

start: demo-client demo-server

demo-client:
	php -S 0.0.0.0:8000 -t .

demo-server:
	node ./demo-server.js 8002

lint:
	./node_modules/.bin/eslint src/* --ext .js,.json --fix

publish: build
	npm publish . --access public
