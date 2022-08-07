FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]

# For development mode

# FROM node:16-alpine
# WORKDIR /app
# COPY package.json .
# RUN npm install
# COPY . .
# CMD ["npm", "run", "dev"]