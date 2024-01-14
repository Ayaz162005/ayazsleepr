FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json ./   
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json


COPY apps/reservations apps/reservations
COPY libs libs

RUN npm install -r
RUN npm run build reservations

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app


COPY package.json ./   



COPY --from=development /usr/src/app/dist ./dist

CMD ['node', 'dist/apps/reservations/main']