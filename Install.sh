[[ -s "/Volumes/PersonalFiles/.profile" ]] && source "/Volumes/PersonalFiles/.profile" #passwords
[[ -s "$HOME/.common_profile" ]] && source "$HOME/.common_profile"

# Uncompress configuration and database
rm -rf _config.sh
ungpg _config.sh.gpg
rm -rf SOURCE/sql/backup.sql
ungpg SOURCE/sql/backup.sql.gpg
#rm -rf SOURCE/html/wp/wp-config.php
#ungpg SOURCE/html/wp/wp-config.php.gpg

# Get NPM dependencies
cd node_docker/node/
npm install
cd ../..

# Get current stacks
cd SOURCE/html/
#rm -rf _webpack_stack1.0
#git clone https://superjonbot@bitbucket.org/superjonbot/webpack_stack1.0.git _webpack_stack1.0
#rm -rf _require_stack1.0
#git clone https://superjonbot@bitbucket.org/superjonbot/monarch_dev.git _require_stack1.0
#rm -rf _require_stack2.0
#git clone https://superjonbot@bitbucket.org/superjonbot/chrysalis.git _require_stack2.0
cd ../..

# Build node container
cd node_docker
docker build -t aenetworks/node:1.0 .
cd ..
# make symbolic link
rm $(pwd)/SOURCE/node
ln -s $(pwd)/node_docker/node $(pwd)/SOURCE

# build lamp container
cd html_docker/php7.1/apache
docker build -t aenetworks/wordpress:1.0 .
cd ../../..



# nuke lamp files i dont need
rm -rf $(pwd)/SOURCE/html/wp-*
rm $(pwd)/SOURCE/html/index.php
rm $(pwd)/SOURCE/html/license.txt
rm $(pwd)/SOURCE/html/readme.html
rm $(pwd)/SOURCE/html/xmlrpc.php

#create import/export directory and get last export
#mkdir ARCHIVE
