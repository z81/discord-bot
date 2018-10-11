FROM node:10-alpine
WORKDIR /server
COPY . /server

RUN npm install
RUN npm run postinstall
CMD npm start