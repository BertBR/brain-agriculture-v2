FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x prisma-setup.sh
EXPOSE 3000
EXPOSE 9229
CMD ["sh", "./prisma-setup.sh"]
