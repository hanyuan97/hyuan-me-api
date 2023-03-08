FROM node:18-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --shamefully-hoist

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

FROM base as deploy

WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist/ ./dist

ENV NODE_ENV production

EXPOSE 3000
CMD [ "node", "dist/index.js" ]