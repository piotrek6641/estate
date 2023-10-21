FROM node

WORKDIR /app

RUN mkdir backend

COPY ./backend backend

CMD [ "npx", "ts-node", "backend/src/index.ts" ]
