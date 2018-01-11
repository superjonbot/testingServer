#GET config
[[ -s "_config.sh" ]] && source "_config.sh"

mkdir $(pwd)/ARCHIVE/upload
rm -rf $(pwd)/ARCHIVE/upload/*

# make modified backup.SQL
cp -rf $(pwd)/ARCHIVE/sql/backup.sql $(pwd)/ARCHIVE/upload/modified_backup.sql
sed -i -e 's/utf8mb4_unicode_520_ci/utf8mb4_unicode_ci/g' $(pwd)/ARCHIVE/upload/modified_backup.sql
sed -i -e 's+http://127.0.0.1:8080/wp+http://jonathanrobles.net/'$prod_wordpress_remote_project_directory'+g' $(pwd)/ARCHIVE/upload/modified_backup.sql

# make modified wp-config
cp -rf $(pwd)/ARCHIVE/html/wp/wp-config.php $(pwd)/ARCHIVE/upload/modified_wp-config.php
sed -i -e "s/'$local_SQL_dbname'/'$prod_wordpressSQL_dbname'/g" $(pwd)/ARCHIVE/upload/modified_wp-config.php
sed -i -e "s/'$local_SQL_handle'/'$prod_wordpressSQL_login'/g" $(pwd)/ARCHIVE/upload/modified_wp-config.php
sed -i -e "s/'$local_SQL_password'/'$prod_wordpressSQL_password'/g" $(pwd)/ARCHIVE/upload/modified_wp-config.php
sed -i -e "s/'mysql'/'localhost'/g" $(pwd)/ARCHIVE/upload/modified_wp-config.php

# create archive of wp dir
rm -rf $(pwd)/ARCHIVE/upload/$prod_wordpress_remote_project_directory.tgz
tar -czf $(pwd)/ARCHIVE/upload/$prod_wordpress_remote_project_directory.tgz -C $(pwd)/ARCHIVE/html/wp .
#tar -czf $(pwd)/ARCHIVE/upload/projects.tgz -C $(pwd)/ARCHIVE/html/PROJECTS .

# place files on webserver
scp -P 2222 $(pwd)/ARCHIVE/upload/$prod_wordpress_remote_project_directory.tgz $prod_sshscp_server:~/tmp/devastTMP/
scp -P 2222 $(pwd)/ARCHIVE/upload/modified_backup.sql $prod_sshscp_server:~/tmp/devastTMP/
#scp -P 2222 $(pwd)/ARCHIVE/upload/projects.tgz $prod_sshscp_server:~/tmp/devastTMP/

# restore sql file
ssh -p 2222 $prod_sshscp_server 'mysqladmin -f -u'$prod_handle' -p'$prod_password' drop '$prod_wordpressSQL_dbname
ssh -p 2222 $prod_sshscp_server 'mysqladmin -f -u'$prod_handle' -p'$prod_password' create '$prod_wordpressSQL_dbname
ssh -p 2222 $prod_sshscp_server 'mysql -p'$prod_password' '$prod_wordpressSQL_dbname' < ~/tmp/devastTMP/modified_backup.sql'
ssh -p 2222 $prod_sshscp_server 'rm -rf ~/tmp/devastTMP/modified_backup.sql;rm -rf ~/public_html/'$prod_wordpress_remote_project_directory'_last;  mv ~/public_html/'$prod_wordpress_remote_project_directory' ~/public_html/'$prod_wordpress_remote_project_directory'_last; mkdir ~/public_html/'$prod_wordpress_remote_project_directory';'

# restore projects file
#ssh -p 2222 $prod_sshscp_server 'mkdir ~/public_html/PROJECTS'
#ssh -p 2222 $prod_sshscp_server 'rm -rf ~/public_html/PROJECTS/*'
#ssh -p 2222 $prod_sshscp_server 'tar zxvf ~/tmp/devastTMP/projects.tgz -C ~/public_html/PROJECTS'

# restore wordpress
ssh -p 2222 $prod_sshscp_server 'tar zxvf ~/tmp/devastTMP/'$prod_wordpress_remote_project_directory'.tgz -C ~/public_html/'$prod_wordpress_remote_project_directory

# restore wordpress configuration
scp -P 2222 $(pwd)/ARCHIVE/upload/modified_wp-config.php $prod_sshscp_server:~/public_html/$prod_wordpress_remote_project_directory/wp-config.php

# delete unused
rm -rf $(pwd)/ARCHIVE/upload/*-e

# open 
open -a safari http://$prod_server/$prod_wordpress_remote_project_directory/wp-admin/
