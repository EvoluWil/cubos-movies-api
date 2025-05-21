FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate

EXPOSE 3333

CMD ["yarn", "start:dev"]
