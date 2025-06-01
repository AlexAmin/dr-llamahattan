FROM node:22
WORKDIR /app
COPY api api
# Setup API
WORKDIR /app/api
RUN rm -rf lib
RUN yarn install
RUN yarn build
# Run
EXPOSE 8080
CMD [ "node", "lib/index.js" ]
