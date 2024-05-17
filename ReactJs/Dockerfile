# Image de base
FROM node:20

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port 5173 utilisé par l'application (port par défaut pour Vite)
EXPOSE 5173

# Commande pour démarrer l'application en mode développement
CMD ["npm", "run", "dev"]