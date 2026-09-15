# syntax=docker/dockerfile:1
# Two named stages. Cloudgate's "Docker target" field picks one: `runtime` is the
# normal image; `debug` adds curl and marks BUILD_TARGET so the choice is visible.

FROM node:22-alpine AS runtime
ARG BUILD_ARG=unset
WORKDIR /app
COPY package.json server.js ./
COPY static ./static
RUN BUILD_ARG="$BUILD_ARG" npm run build
ENV PORT=3000 BUILD_TARGET=runtime
EXPOSE 3000
CMD ["node", "server.js"]

FROM runtime AS debug
RUN apk add --no-cache curl
ENV BUILD_TARGET=debug
