FROM node:22.5.1-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

RUN rm -rf ./src

EXPOSE 3000 54566

CMD ["npm", "run", "start:prod"]
