FROM node:20.9.0-alpine
WORKDIR /resAlloc

COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "start"]