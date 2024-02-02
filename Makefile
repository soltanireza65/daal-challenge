SHELL := /bin/bash

.PHONY: help up down

help:
	@grep -E '^[1-9a-zA-Z_-]+:.*?## .*$$|(^#--)' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m %-43s\033[0m %s\n", $$1, $$2}' \
	| sed -e 's/\[32m #-- /[33m/'

build: ## Build and Up the container images with --build
	docker-compose up --build

up: ## Up the container images
	docker-compose up -d

down: ## Down the container images
	docker-compose down

test: ## Run the tests
	pnpm run test