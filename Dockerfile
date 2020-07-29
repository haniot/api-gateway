FROM node:12-alpine
RUN apk --no-cache add bash curl grep git

# create and set app directory
RUN mkdir -p /usr/src/gtw
WORKDIR /usr/src/gtw

# install app dependencies
COPY . /usr/src/gtw/
RUN npm install

# Copy app source
COPY . /usr/src/gtw

EXPOSE 80
EXPOSE 443

CMD ["npm", "start"]
