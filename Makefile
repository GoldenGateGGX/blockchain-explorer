ENVIRONMENT ?=
IMAGE_NAME = block-explorer-test
IMAGE_TAG ?= latest
LATEST_COMMIT := $$(git rev-parse HEAD)
REGISTRY_HOST ?= ghcr.io/boostylabs

IMAGE_BACKUP = $(REGISTRY_HOST)/$(IMAGE_NAME)$(ENVIRONMENT):$(LATEST_COMMIT)
IMAGE_LATEST = $(REGISTRY_HOST)/$(IMAGE_NAME)$(ENVIRONMENT):$(IMAGE_TAG)

build_block_explorer: ## Build block_explorer docker image.
	DOCKER_BUILDKIT=1 docker build --no-cache -f ./docker/Dockerfile -t $(IMAGE_BACKUP) . && DOCKER_BUILDKIT=1 docker build --no-cache -f ./docker/Dockerfile -t $(IMAGE_LATEST) .

push_block_explorer: ## Push block_explorer docker image.
	docker push $(IMAGE_BACKUP) && docker push $(IMAGE_LATEST)

docker: ## Build and push all docker images.
	make build_block_explorer push_block_explorer
