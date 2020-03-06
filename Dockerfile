# ---- Base image ----

FROM hmctspublic.azurecr.io/base/node:12-alpine as base
USER root
RUN apk update && apk add bzip2 git python py-pip

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

