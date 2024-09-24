# syntax=docker/dockerfile:1.4

FROM node:18-bullseye-slim AS development

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm ci

COPY ["./src","/usr/src/app/src/"]
COPY [".env","/usr/src/app/"]

ENTRYPOINT node ./src/index.js

