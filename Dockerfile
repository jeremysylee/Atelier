FROM node:12.16.3

WORKDIR /code

ENV PORT 80

COPY package.json /code/package.json

RUN npm install

COPY . /code

EXPOSE 3001

CMD ["npm", "start"]

