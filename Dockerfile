FROM node:22

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD npx ts-node src/seeds/seed.ts

EXPOSE 3000

CMD ["npm", "run", "start:seed"]