#!/bin/bash
docker compose -f docker-compose-prod.yml -f docker-compose-dev.yml up --build
