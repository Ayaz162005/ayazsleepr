FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json ./   
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY apps/notifications apps/notifications
COPY libs libs

RUN  npm install -r

RUN npm run build notifications

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app


COPY package.json ./   



COPY --from=development /usr/src/app/dist ./dist

CMD ['node', 'dist/apps/notifications/main']