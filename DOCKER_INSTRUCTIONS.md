# Instructions Docker pour Hexa Trip

## Prérequis

- Docker Desktop installé sur votre machine
- Docker Compose (inclus avec Docker Desktop)

## Configuration MongoDB avec Volume

Ce projet utilise Docker Compose pour lancer uniquement MongoDB avec un volume persistant nommé `mongodb_data`. L'application Node.js s'exécute en local.

### Démarrage rapide

1. **Démarrer MongoDB :**
   ```bash
   npm run db:up
   ```

2. **Arrêter MongoDB :**
   ```bash
   npm run db:down
   ```

3. **Voir les logs MongoDB :**
   ```bash
   npm run db:logs
   ```

## Services configurés

### MongoDB
- **Image :** mongo:8.0 (dernière version stable)
- **Port :** 27017
- **Volume persistant :** `mongodb_data:/data/db`
- **Credentials :**
  - Username: `admin`
  - Password: `password123`
  - Database: `hexa-trip`

### Application Node.js
- **Exécution :** En local (pas dans Docker)
- **Port :** 3000
- **Connexion :** Automatique vers MongoDB Docker

## Commandes utiles

### Gestion des conteneurs
```bash
# Voir les conteneurs en cours d'exécution
docker ps

# Voir les logs de l'application
docker logs hexa-trip-app

# Voir les logs de MongoDB
docker logs hexa-trip-mongodb

# Accéder au shell de l'application
docker exec -it hexa-trip-app sh

# Accéder au shell MongoDB
docker exec -it hexa-trip-mongodb mongosh
```

### Gestion des volumes
```bash
# Lister les volumes
docker volume ls

# Inspecter le volume MongoDB
docker volume inspect hexa_trip_mongodb_data

# Supprimer le volume (⚠️ Supprime toutes les données)
docker volume rm hexa_trip_mongodb_data
```

## Scripts d'initialisation MongoDB

Placez vos scripts d'initialisation MongoDB (`.js` ou `.sh`) dans le dossier `mongo-init/`.
Ils seront exécutés automatiquement lors du premier démarrage de MongoDB.

## Développement local

1. **Démarrer MongoDB avec Docker :**
   ```bash
   npm run db:up
   ```

2. **Démarrer l'application Node.js en local :**
   ```bash
   npm run dev
   ```

L'application se connectera automatiquement à MongoDB qui tourne dans Docker avec authentification.

### Authentification automatique

L'application détecte automatiquement si MongoDB Docker est actif et utilise les bonnes credentials :
- **Avec Docker** : `mongodb://admin:password123@localhost:27017/hexa-trip?authSource=admin`
- **Sans Docker** : `mongodb://localhost:27017/hexa-trip` (sans authentification)

### Configuration manuelle (optionnel)

Vous pouvez forcer une configuration spécifique avec la variable d'environnement `MONGODB_URI` :

```bash
# Pour MongoDB Docker avec authentification
MONGODB_URI=mongodb://admin:password123@localhost:27017/hexa-trip?authSource=admin npm run dev

# Pour MongoDB local sans authentification  
MONGODB_URI=mongodb://localhost:27017/hexa-trip npm run dev
```

## Troubleshooting

### Port déjà utilisé
Si le port 3000 ou 27017 est déjà utilisé :
```bash
# Voir les processus utilisant le port
netstat -ano | findstr :3000
netstat -ano | findstr :27017
```

### Réinitialiser complètement
```bash
npm run docker:down
docker volume rm hexa_trip_mongodb_data
npm run docker:build
``` 