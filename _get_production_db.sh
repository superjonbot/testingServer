#GET config
[[ -s "_config.sh" ]] && source "_config.sh"

# Remotely create the backup sql
ssh -p 2222 $prod_sshscp_server 'mysqldump -p'$prod_password' '$prod_wordpressSQL_dbname' > ~/tmp/devastTMP/serverbackup.sql'

# download via SCP to local
scp -P 2222 $prod_sshscp_server:~/tmp/devastTMP/serverbackup.sql $(pwd)/SOURCE/sql

mv $(pwd)/SOURCE/sql/backup.sql $(pwd)/SOURCE/sql/_backup_$DATE.sql
mv $(pwd)/SOURCE/sql/serverbackup.sql $(pwd)/SOURCE/sql/backup.sql

sed -i -e 's/utf8mb4_unicode_ci/utf8mb4_unicode_520_ci/g' $(pwd)/SOURCE/sql/backup.sql
sed -i -e 's+http://'$prod_server'/'$prod_wordpress_remote_project_directory'+http://127.0.0.1:8080/wp+g' $(pwd)/SOURCE/sql/backup.sql

docker exec -d wordpressdb sh -c "mysql -ppassword wordpress < tmp/backup.sql"
rm $(pwd)/SOURCE/sql/*-e