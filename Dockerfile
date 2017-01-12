FROM node:latest

# Create app directory
RUN mkdir -p /home/p-monitor
WORKDIR /home/p-monitor

# Install app dependencies
COPY package.json /home/p-monitor
RUN npm config set production
RUN npm install

# Bundle app source
COPY ./dist /home/p-monitor/dist

EXPOSE 3000
EXPOSE 8000

CMD [ "npm", "run", "start" ]
