#!/bin/bash

# Start the Docker Compose stack
docker-compose up -d

# Wait for the MySQL container to start up
while [[ -z $(docker ps --format '{{.Names}}' | grep db) ]]
do
    sleep 1
done

container_id=$(docker ps --format '{{.ID}} {{.Names}}' | grep db | awk '{print $1}')

while ! docker exec -it $container_id mysqladmin ping --silent
do
    sleep 1
done

docker exec -it $container_id mysql -u root -padmin -e "CREATE DATABASE solar;"

# # Run Sequelize migrations and seeds
# sequelize db:migrate
# sequelize db:seed:all

# # Start the Node.js server
# npm run start

