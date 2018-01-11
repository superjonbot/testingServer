#GET config
[[ -s "_config.sh" ]] && source "_config.sh"

# make custom network
docker network create --driver bridge --subnet=172.18.0.0/16 mylocalnet

# run sql and wordpress containers
docker run --net mylocalnet --ip="172.18.0.2" --name wordpressdb -v $(pwd)/SOURCE/sql:/tmp -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=wordpress -d mysql:5.7
docker run --net mylocalnet --ip="172.18.0.3" -p 8080:80 -e WORDPRESS_DB_PASSWORD=password -d --name wordpress -v $(pwd)/SOURCE/html:/var/www/html --link wordpressdb:mysql  aenetworks/wordpress:1.0

# run the haproxy server
docker run --net mylocalnet --ip="172.18.0.5" -p 8000:80 -d --name my-haproxy-container -v $(pwd)/SOURCE/haproxy:/usr/local/etc/haproxy:ro haproxy:1.7

# run the node server and make the symbolic link so everything is in /SOURCE
rm $(pwd)/SOURCE/node
ln -s $(pwd)/node_docker/node $(pwd)/SOURCE
cd node_docker
docker run --net mylocalnet --ip="172.18.0.4" --name nodeJS -d -p 3000:3000 -v $(pwd)/../SOURCE/node:/usr/src/app aenetworks/node:1.0

# nuke unused default wordpress files
cd ..
sleep 10

# nuke files i dont need
rm -rf $(pwd)/SOURCE/html/wp-*
rm -rf $(pwd)/SOURCE/html/index.php
rm -rf $(pwd)/SOURCE/html/license.txt
rm -rf $(pwd)/SOURCE/html/readme.html
rm -rf $(pwd)/SOURCE/html/xmlrpc.php

#restore gpg'd sql backup
rm -rf $(pwd)/SOURCE/sql/backup.sql
ungpg $(pwd)/SOURCE/sql/backup.sql.gpg
docker exec -d wordpressdb sh -c "mysql -ppassword wordpress < tmp/backup.sql"

# type the readme and show the nodeJS log
cat readme.txt
clear
echo "waiting..."

sleep 10
open -a safari http://127.0.0.1:3000
open -a safari http://127.0.0.1:8080

echo "starting nodeJS log..."
docker logs -f nodeJS



