# ---- Base image ----

FROM hmctspublic.azurecr.io/base/node/stretch-slim-lts-10:10-stretch-slim as base
USER root
RUN apt-get update && apt-get install -y bzip2 git python2.7 python-pip

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY package.json yarn.lock ./
RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"
RUN yarn install --production  \
    && yarn cache clean

# ---- Build image ----
FROM base as build
COPY . ./

RUN yarn install \
    && yarn setup \
    && rm -rf /opt/app/.git

# ---- Runtime image ----
FROM base as runtime
COPY --from=build ${WORKDIR}/app app/
COPY --from=build ${WORKDIR}/public public/
COPY --from=build ${WORKDIR}/server.js ${WORKDIR}/app.js ${WORKDIR}/git.properties.json ./
EXPOSE 3000
CMD ["yarn", "start" ]

