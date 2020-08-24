#!/usr/bin/sh
docker-compose -f docker-compose-dev.yml -f docker-compose-dev-gambi.yml up --build "$@"