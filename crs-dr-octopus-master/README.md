# crs-dr-octopus


## DEV Setup:
1. git pull
2. populate secrets as needed in docker-compose.yml
3. docker-compose up -d --build
4. docker exec -it crs-dr-octopus bash
5. python3 dr-octopus/app.py


## PROD Deployment
1. git pull
2. populate secrets as needed in docker-compose.yml
3. docker-compose up -d --build


## Setting Cron in container
1. docker exec -it crs-dr-octopus bash
2. service cron start
3. service cron status
4. python3 dr-octopus/scripts/cronjob/cronjob.py


## Setting up fortify SSC app
1. sh dr-octopus/scripts/fortify/ConfigureFortifyServer.sh
2. python3 dr-octopus/fortify_app.py
