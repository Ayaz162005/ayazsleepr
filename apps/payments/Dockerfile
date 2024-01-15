FROM node:14-alpine as development

WORKDIR /usr/src/app

COPY package.json ./   
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install


COPY apps/payments apps/payments
COPY libs libs
RUN cd apps/payments && npm install
RUN npm run build payments

FROM node:14-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app


COPY package.json ./   



COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payments/main"]