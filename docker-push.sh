#!/bin/bash
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"
docker build -t "${DOCKER_USERNAME}"/"${DOCKER_REPO_NAME}:${TRAVIS_BRANCH}" ./
docker push "$DOCKER_USERNAME"/"$DOCKER_REPO_NAME"