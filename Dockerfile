FROM node:20

WORKDIR /app
COPY src src
COPY templates templates
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
RUN npm install
RUN npm run build
RUN rm -rf ./src
ENTRYPOINT ["npm", "start"]
