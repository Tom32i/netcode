install:
	npm install

watch:
	./node_modules/.bin/webpack --watch --mode=development
build:
	./node_modules/.bin/webpack --mode=production
