# BUILD IMAGE
FROM node:16-alpine as build
WORKDIR /app
COPY --chown=app:app . .
ENV PATH="$PATH:`yarn global bin`"
ENV NODE_ENV=development
ENV CI=true
RUN yarn install --network-timeout 1000000 --silent && \
  ./node_modules/.bin/eslint src/**/*.ts && \
  yarn build

# TEST IMAGE
FROM node:16-alpine as test
WORKDIR /app
ENV PATH="$PATH:`yarn global bin`"
COPY --from=build --chown=app:app /app/ /app/
ENV NODE_ENV=test
ENV CI=true
RUN yarn test && yarn test:send-coverage

# RUN IMAGE
FROM node:16-alpine as run
WORKDIR /app
USER app
COPY --from=build --chown=app:app /app/package.json /app/yarn.lock ./
COPY --from=build --chown=app:app /app/dist /app/dist
ENV PATH="$PATH:`yarn global bin`"
ENV NODE_ENV=production
RUN yarn install --prod --silent
ENV PORT=3000
CMD [ "yarn", "start" ]
