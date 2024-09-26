FROM node:20.17

WORKDIR /app

COPY package*.json .

RUN yarn

COPY . .

# RUN yarn prisma:migrate:seed:dev
RUN yarn prisma:gen:dev

RUN yarn build

EXPOSE 5000 5555

CMD ["yarn", "start"]