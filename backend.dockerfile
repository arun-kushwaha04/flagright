FROM node:20.17

WORKDIR /app

COPY package*.json .

RUN yarn

COPY . .

RUN yarn prisma:dev

RUN yarn build

EXPOSE 5000

CMD ["yarn", "start"]