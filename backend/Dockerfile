FROM node

WORKDIR /usr/src/app

COPY . .

RUN npm i
RUN npm run build
# BCrypt issues,  woo.
RUN npm rebuild bcrypt --build-from-source

EXPOSE 3000

CMD ["node", "dist/Server.js"]