FROM node:10.15.3

# create and set app directory
RUN mkdir -p /usr/src/ag 
WORKDIR /usr/src/ag

# install app dependencies
COPY . /usr/src/ag/ 
RUN npm install

# Bundle app source
COPY . /usr/src/ag 
RUN npm run build

EXPOSE 6379
EXPOSE 9876
EXPOSE 8080

CMD ["npm", "start"]