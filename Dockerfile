FROM node:18-alpine

RUN npm install -g npm@latest

WORKDIR /usr/app

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]