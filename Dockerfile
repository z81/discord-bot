FROM node:10-alpine
WORKDIR /server
COPY . /server

RUN npm install --production
CMD npm start