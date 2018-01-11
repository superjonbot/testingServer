#GET config
[[ -s "_config.sh" ]] && source "_config.sh"

#compress remote html
ssh -p 2222 $prod_sshscp_server 'tar -czf ~/tmp/devastTMP/remote_wp.tgz -C ~/public_html/wp_qa .'

#transfer remote html
scp -P 2222 $prod_sshscp_server:~/tmp/devastTMP/remote_wp.tgz $(pwd)/SOURCE/html/

#move current wp folder
mv $(pwd)/SOURCE/html/wp $(pwd)/SOURCE/html/_wp_$DATE

#make new folder and untar
mkdir $(pwd)/SOURCE/html/wp;
tar zxvf $(pwd)/SOURCE/html/remote_wp.tgz -C $(pwd)/SOURCE/html/wp

sed -i -e "s/'$prod_wordpressSQL_dbname'/'$local_SQL_dbname'/g" $(pwd)/SOURCE/html/wp/wp-config.php
sed -i -e "s/'$prod_wordpressSQL_login'/'$local_SQL_handle'/g" $(pwd)/SOURCE/html/wp/wp-config.php
sed -i -e "s/'$prod_wordpressSQL_password'/'$local_SQL_password'/g" $(pwd)/SOURCE/html/wp/wp-config.php
sed -i -e "s/'localhost'/'mysql'/g" $(pwd)/SOURCE/html/wp/wp-config.php

#remove archive
rm -rf $(pwd)/SOURCE/html/remote_wp.tgz
