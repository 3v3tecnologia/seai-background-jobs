# syntax=docker/dockerfile:1.4

FROM node:18-bullseye-slim 

ENV NODE_ENV production

RUN apt-get update && apt-get install -y --no-install-recommends ftp && apt-get install -y cron

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm ci

COPY ["./src","/usr/src/app/src/"]
COPY [".env","/usr/src/app/"]

COPY register-cron.sh /usr/src/app/register-cron.sh

RUN chmod +x /usr/src/app/register-cron.sh

# ENTRYPOINT node src/cron.js
CMD ["/usr/src/app/register-cron.sh"]

