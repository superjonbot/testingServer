#GET config
[[ -s "_config.sh" ]] && source "_config.sh"

mkdir $(pwd)/ARCHIVE/upload
rm -rf $(pwd)/ARCHIVE/upload/*

# create archive of PROJECTS
tar -czf $(pwd)/ARCHIVE/upload/projects.tgz -C $(pwd)/ARCHIVE/html/PROJECTS .

# place files on webserver
scp -P 2222 $(pwd)/ARCHIVE/upload/projects.tgz $prod_sshscp_server:~/tmp/devastTMP/

# restore projects file
ssh -p 2222 $prod_sshscp_server 'mkdir ~/public_html/PROJECTS; rm -rf ~/public_html/PROJECTS/*'
ssh -p 2222 $prod_sshscp_server 'tar zxvf ~/tmp/devastTMP/projects.tgz -C ~/public_html/PROJECTS'

# delete unused
rm -rf $(pwd)/ARCHIVE/upload/*-e

