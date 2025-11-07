FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production=true --frozen-lockfile

COPY . .

ENV NODE_ENV=production \
    PORT=5001

EXPOSE 5001

CMD ["yarn", "start"]
