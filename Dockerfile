FROM node:10-alpine
WORKDIR /server
COPY . /server

RUN npm install --production
RUN npm run postinstall
CMD npm start