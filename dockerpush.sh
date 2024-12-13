#!/bin/bash

# Exit script if any command fails
set -e

# Ensure a version number is provided
if [ -z "$1" ]; then
  echo "Error: No version number provided."
  echo "Usage: ./deploy.sh <version-number>"
  exit 1
fi

VERSION=$1
IMAGE_NAME="chye0001/divexfrontend"

echo "Starting push script..."

# Step 2: Build the Docker image
echo "Building Docker image..."
docker build -t divexfrontend . || { echo "Docker build failed"; exit 1; }

# Step 3: Tag the Docker image
echo "Tagging Docker image with 'latest' and version '${VERSION}'..."
docker tag divexfrontend ${IMAGE_NAME}:latest
docker tag divexfrontend ${IMAGE_NAME}:${VERSION}

# Step 4: Push both tagged versions to Docker Hub
echo "Pushing Docker images to Docker Hub..."
docker push ${IMAGE_NAME}:latest || { echo "Failed to push latest tag"; exit 1; }
docker push ${IMAGE_NAME}:${VERSION} || { echo "Failed to push version tag"; exit 1; }

echo "Oush complete!"