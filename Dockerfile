ARG NODE_VERSION=20.16

# Base image
FROM node:${NODE_VERSION}-alpine AS BUILD_IMAGE

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./

# Install app dependencies
RUN yarn install

# RUN yarn install --production=true --modules-folder node_modules_prod

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build

RUN yarn build:prod

# remove development dependencies
# RUN npm prune --production

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
# COPY --from=BUILD_IMAGE /usr/src/app/.env ./
# COPY --from=BUILD_IMAGE /usr/src/app/node_modules_prod ./node_modules

# Start the server using the production build
ENV NODE_OPTIONS=--max-old-space-size=2048 
# ENTRYPOINT [ "node" ]
# CMD ["dist/src/index.js"]
