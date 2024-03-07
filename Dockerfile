FROM node:20

WORKDIR /app
COPY dist dist
COPY templates templates
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
ENTRYPOINT ["npm", "start"]
