#GET config
[[ -s "_config.sh" ]] && source "_config.sh"

echo "clearing ARCHIVE folder"
rm -rf ARCHIVE/*

echo "copying project in ARCHIVE"
cd ARCHIVE

# update  sql
    rm -rf ../SOURCE/sql/*
    docker exec -ti wordpressdb sh -c "mysqldump -p"$local_SQL_password" "$local_SQL_dbname" > tmp/backup.sql"

#update and copy haproxy
    mkdir -p haproxy
    cp -rf ../SOURCE/haproxy/ haproxy/

#update and copy html
    mkdir -p html
    cp -rf ../SOURCE/html/ html/

#copy node
    mkdir -p node
    cp -rf ../node_docker/node/ node/

# update and copy sql
    dogpg ../SOURCE/sql/backup.sql
    mkdir -p sql
    cp -rf ../SOURCE/sql/ sql/

#gitignore file
    cd ..
    cp -rf SOURCE/.gitignore ARCHIVE/

#refresh git
    git rm -rf --cached .
    git add .
