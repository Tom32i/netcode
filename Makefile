install:
	npm install

watch:
	./node_modules/.bin/webpack --watch --mode=development
build:
	./node_modules/.bin/webpack --mode=production

start: demo-client demo-server

demo-client:
	open http://localhost:8000
	php -S 0.0.0.0:8000 -t .

demo-server:
	node ./demo-server.js 8002
