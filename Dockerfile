FROM node:16

# Uygulama klasörünü oluştur
WORKDIR /app

# Uygulama bağımlılıklarını kopyala
COPY package*.json ./

# NPM bağımlılıklarını yükle
RUN npm install

# Uygulama kaynak kodunu kopyala
COPY . .

# Uygulamayı çalıştır
CMD [ "npm", "start" ]
