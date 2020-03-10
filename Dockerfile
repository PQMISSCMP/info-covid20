
FROM node:alpine

RUN apk add --update \
  git \
  openssh-client

WORKDIR /app

COPY ./package.json ./

RUN npm install --production
RUN npm install typescript -g

COPY ./ ./

CMD ["npm","start"]