FROM node:22
WORKDIR /app
COPY package*.json./
RUN npm install
ENV PORT 5000
EXPOSE 5000
CMD ["node", "index.js"]