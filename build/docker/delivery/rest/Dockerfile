FROM node:20.18.3-alpine

ARG CMD
ARG CMD_VERSION
ENV CMD=rest
ENV CMD_VERSION=v1.0.0

WORKDIR /auth-api
COPY . .

RUN npm install
RUN npm run build 

EXPOSE 8100

CMD npm start
