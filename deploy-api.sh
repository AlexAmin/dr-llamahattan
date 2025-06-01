#!/bin/bash

gcloud config set project dr-lamahattan &&
docker build . --platform linux/amd64 -t "dr-lamahattan-api-amd64" -t europe-west3-docker.pkg.dev/dr-lamahattan/docker/api -f api.Dockerfile &&
docker push europe-west3-docker.pkg.dev/dr-lamahattan/docker/api &&
gcloud run deploy "dr-lamahattan-api" --image=europe-west3-docker.pkg.dev/dr-lamahattan/docker/api:latest --region europe-west1 &&
exit 0
