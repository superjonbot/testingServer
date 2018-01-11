FROM node:argon
 
ARG DEBIAN_FRONTEND=noninteractive

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
 
# Install app dependencies
COPY ./node/package.json /usr/src/app/
RUN npm install
 
# Bundle app source
COPY ./node/ /usr/src/app
 
EXPOSE 3000
CMD [ "npm", "start" ]