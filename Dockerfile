FROM node

WORKDIR /app

RUN mkdir backend

COPY ./backend/ApiGateway backend/ApiGateway

CMD [ "npx", "ts-node", "backend/ApiGateway/src/index.ts" ]
