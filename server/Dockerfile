FROM node:20.9.0-alpine
WORKDIR /resAlloc

COPY . .

RUN npm install
EXPOSE 8000

CMD ["node", "server.js"]