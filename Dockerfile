# ---- Base image ----
FROM hmcts.azurecr.io/hmcts/base/node/stretch-slim-lts-8 as base
RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"
COPY package.json yarn.lock ./
RUN yarn install --production  \
    && yarn cache clean

# ---- Build image ----
FROM base as build
RUN apt-get update \
    && apt-get install --assume-yes git bzip2
COPY . .
RUN yarn install \
    && yarn setup \
    && rm -rf .git

# ---- Runtime image ----
FROM base as runtime
COPY --from=build ${WORKDIR}/app app/
COPY --from=build ${WORKDIR}/public public/
COPY --from=build ${WORKDIR}/server.js ${WORKDIR}/app.js ${WORKDIR}/git.properties.json ./
