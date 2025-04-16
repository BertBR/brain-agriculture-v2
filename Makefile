dev:
	docker-compose up --build -d

reset:
	docker rm -f $$(docker ps -a -q) && make dev