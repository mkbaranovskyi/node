FROM node:14

WORKDIR /home/node/backend

COPY package.json /app

RUN npm i

COPY . /app

EXPOSE 80

CMD ["node", "app.mjs"]