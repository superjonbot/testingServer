#GET config
[[ -s "_config.sh" ]] && source "_config.sh"

# backup script
dogpg _config.sh

# stop and remove docker containers and custom network
docker stop $(docker ps -a -q)
docker network rm mylocalnet
docker rm $(docker ps -a -q)



