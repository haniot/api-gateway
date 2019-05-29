# Download Node image from Docker Hub Repository
FROM node:10.16.0

# Create a new folder in the container
RUN mkdir -p /usr/src/ag 

WORKDIR /usr/src/ag 

COPY . /usr/src/ag/ 
RUN npm install 
COPY . /usr/src/ag 

EXPOSE 6379
EXPOSE 9876
EXPOSE 8080

ENTRYPOINT  npm run start

