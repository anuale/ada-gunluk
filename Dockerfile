ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

FROM base AS deps
ENV NODE_ENV=development
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && \
    cp -R node_modules /all_node_modules && \
    npm ci --only=production --ignore-scripts && \
    cp -R node_modules /prod_node_modules && \
    cp -R /all_node_modules ./node_modules && \
    rm -rf /all_node_modules

FROM base AS builder
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=deps /prod_node_modules ./node_modules

EXPOSE 3000
CMD ["node", "server.js"]
