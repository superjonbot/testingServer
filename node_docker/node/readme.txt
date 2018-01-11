Documentation by J.Robles 7.25.17

Prerequisites:
nodejs, express.js, docker, nodemon

Build & Run:
> cd [base directory]
> npm install
> docker build -t [name]/[path]:[node] .    ie."docker build -t aenetworks/node:1.0 ."
> docker run -it -p 3000:3000 -v $(pwd)/:/usr/src/app [name]/[path]:[node]      ie."docker run -it -p 3000:3000 -v $(pwd)/:/usr/src/app aenetworks/node:1.0"

