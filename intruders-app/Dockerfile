FROM node:16-buster-slim

ENV NODE_ENV $NODE_ENV
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT
ARG DIR=/app
ENV USER=node

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i -g npm@latest expo-cli@latest
RUN npm i -g serve


RUN mkdir ${DIR}
RUN chown ${USER} ${DIR}
USER "${USER}"

WORKDIR ${DIR}
ENV PATH ${DIR}/.bin:$PATH
COPY --chown=node ./web-build ./web-build


#ENV NODE_ENV=production
ENTRYPOINT ["npx", "serve"]
CMD ["web-build"]