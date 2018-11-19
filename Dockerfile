FROM node:8.12.0-slim

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package.json /opt/app

# Update & Install theses apps.
RUN apt-get update && apt-get install --assume-yes git

RUN yarn install --production  \
        && yarn cache clean

RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"

COPY . /opt/app
RUN yarn setup

RUN rm -rf /opt/app/.git

HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD http_proxy="" wget -q --spider http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["yarn", "start" ]