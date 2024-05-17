# Image de base
FROM node:20

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Installer Nodemon globalement
RUN npm install -g nodemon

# Copier les fichiers du projet
COPY . .

# Exposer le port sur lequel votre app va tourner
EXPOSE 3000

# Commande pour démarrer l'application avec Nodemon
CMD ["nodemon", "server.js"]