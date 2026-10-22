FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS base

# Retain the deployed package manager and dependency closure.
RUN npm install --global pnpm@8.4.0

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --shamefully-hoist

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

FROM base AS deploy
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist/ ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "node", "dist/index.js" ]
