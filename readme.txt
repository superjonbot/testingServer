DOCUMENTATION
J.Robles 7.25.17

Quickstart ( Prerequisites: nodejs, docker, npm )
—————————————————————————————————————————————————

Install the project with
./Install.sh

docker reference
————————————————
docker ps # list running containers
docker ps -a # list all containers
docker rm [container id] # remove container
docker rm $(docker ps -a -q) # remove all containers
docker stop [container id] # stop container
docker stop $(docker ps -a -q) #stop all containers
docker exec -it [container id] /bin/bash # container shell
docker inspect [container id] # inspect container
docker images -a #list images
docker rmi [image] #remove image
docker rmi $(docker images -q) # remove all images

nodeJS console
——————————————
docker logs -f nodeJS

Local Ports
———————————
localhost:3000 nodeJS
localhost:8080 apache
localhost:8000 apache + /domain/search @ nodeJS

Project Files (under /SOURCE)
—————————————————————————————
• /haproxy : the haproxy config
• /html : the apache root directory
• /node(symbolic link created on startcontainers) : node server files
• /sql : the last sql backup

GET query example:
——————————————————
http://127.0.0.1:8000/search?firstname=barack&lastname=obama&year=2000s&category=U.S.

POST query example:
———————————————————
endpoint: http://127.0.0.1:8000/search
JSON:
{
  "id": "xxx",
  "timestamp": "xxx",
  "lang": "en",
  "result": {
    "source": "agent",
    "resolvedQuery": "play a speech by Obama",
    "action": "speeches.search",
    "actionIncomplete": false,
    "parameters": {
      "given-name": "barack",
      "last-name": "obama",
      "my-action": "search",
      "speech_categories": "U.S.",
      "speech_decades": "2000s"
    },
    "contexts": [...],
    "metadata": {...},
    "fulfillment": {...},
    "score": 0.3700000047683716
  },
  "status": {...},
  "sessionId": "xxx"
}

Before updating this repo
--------------------------
1. dogpg _config.sh - backs up sensitive data
2. dogpg SOURCE/sql/backup.sql - backs up last SQL
3. git add .; git commit -m "update" ; git push origin master
4. .profile bash script is needed for $passwords


Primary SCRIPTS:
----------------
Install - sets up the local docker machines and downloads used repos @ modules
Start_containers - Spin up containers to start working
Build - In the development phase use this script for refreshing js/css/html with gulp/grunt/webpack
Collect_for_Archive - Collect files for Deployment
Deploy_to_dev - send to dev server
Deplot_to_prod - send to production server
Stop_containers - Spin down containers to stop working

Secondary SCRIPTS:
------------------
_make_deploy_to_production - update the production script if there's changes to the deploy_to_dev script
_get_production_html - grab the latest production files and replace the local html
_get_production_db - grab the latest production data and replace the local sql

TAGGING RELEASES
mark release: git tag -a v0.0.2 -m "readme update"
list tags: git tag -n
update tags: git push --tags

Autocommit: *use qgit "comment"
git add . && git commit -m "$1 : date:$DATE[$TIME] v.$cachebuster" && git push origin master