all: build run
build:
	docker build -t unix_socket_js .
run:
	docker run --rm --network none --memory 1g -v $(pwd)/sock:/var/run/dev-test unix_socket_js /var/run/dev-test/sock
