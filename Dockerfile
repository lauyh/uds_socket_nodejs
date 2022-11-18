FROM alpine
RUN apk add --update nodejs npm
WORKDIR /usr/app
COPY . /usr/app
ENTRYPOINT ["node", "src/index.js"]