FROM node:24-bookworm-slim

ENV NODE_ENV $NODE_ENV
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT
ARG DIR=/app
ENV USER=node

# Install the static file server used by the container entrypoint.
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i -g serve@14.2.6


RUN mkdir ${DIR}
RUN chown ${USER} ${DIR}
USER "${USER}"

WORKDIR ${DIR}
ENV PATH ${DIR}/.bin:$PATH
COPY --chown=node ./dist ./dist


#ENV NODE_ENV=production
ENTRYPOINT ["npx", "serve"]
CMD ["-s", "dist"]
