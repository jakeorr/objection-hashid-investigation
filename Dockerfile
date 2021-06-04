FROM node:16

# I was unable to install v13 postgres client on the node:16 image. The below
# code resolves the issue, modified from: https://stackoverflow.com/a/57739187/562915
RUN apt-get update && apt-get install -y wget ca-certificates lsb-release
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
RUN apt-get update && apt-get install -y postgresql-client-13

WORKDIR /opt/node_app
COPY package.json yarn.lock ./
RUN yarn install
ENV PATH /opt/node_app/node_modules/.bin:$PATH
WORKDIR /opt/node_app/app
COPY . .
EXPOSE 3000
CMD node .
