#!/bin/bash
set -e

SHA=$(git rev-parse --short HEAD)
IMAGE="ghcr.io/anuale/ada-gunluk"

echo "Building ARM64 image: $IMAGE:$SHA"
docker build --platform linux/arm64 -t "$IMAGE:$SHA" -t "$IMAGE:latest" .
docker push "$IMAGE:$SHA"
docker push "$IMAGE:latest"

echo "Updating docker-compose.yaml to use $IMAGE:$SHA"
sed -i.bak "s|image: ghcr.io/anuale/ada-gunluk:.*|image: ghcr.io/anuale/ada-gunluk:$SHA|" docker-compose.yaml
rm -f docker-compose.yaml.bak

echo "Done. Run: git add docker-compose.yaml && git commit -m 'Update image tag' && git push"
