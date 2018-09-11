FROM nginx:alpine
LABEL maintainer="Wouter De Schuyter <wouter.de.schuyter@gmail.com>"

COPY ./.docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./public /code/public

WORKDIR /code
