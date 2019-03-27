# ---- Base image ----
FROM node:8.12.0-slim as base
RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY package.json ./

# Update & Install theses apps.
RUN yarn install --production  \
    && yarn cache clean

# ---- Build image ----
FROM base as build
RUN echo 'deb http://deb.debian.org/debian jessie main' > /etc/apt/sources.list
RUN echo 'deb http://security.debian.org/debian-security jessie/updates main' > /etc/apt/sources.list

RUN apt-get update \
 && apt-get install --assume-yes git bzip2
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
