# Infra DevOps — Documentation

Ce repo regroupe l'ensemble de l'infrastructure et du code applicatif du projet pour le cours d'infrastructure devoops :

esgi-2603-my-favorite-places/ — Application MFP (client React + API Node.js + PostgreSQL)
swarm/— Infrastructure Docker Swarm (Traefik, Portainer, Shepherd, stacks)
esgi-2604-ansible/ — App de test
esgi-2604-ansible/ — Exercices Ansible


## Environnements

Local dev : esgi-2603-my-favorite-places/  `docker compose up`
Prod locale  : esgi-2603-my-favorite-places/ `docker compose -f compose.prod.yml up -d`
Swarm: swarm/ 


## Démarrer l'infrastructure Swarm

dans un terminal (fait sous bash personnellement)

cd swarm

# 1. Démarrer les containers (manager + 3 nodes)
docker compose up -d

# 2. Initialiser le cluster Swarm via Ansible
docker compose -f ansible.compose.yml run --rm ansible

# 3. Créer le réseau overlay pour Traefik
docker exec manager docker network create --driver overlay web

# 4. Déployer les stacks
docker exec -i manager docker stack deploy -c - traefik < traefik.compose.yml
docker exec -i manager docker stack deploy -c - portainer < portainer.stack.yml


### Vérifier l'état du cluster

docker exec manager docker node ls
docker exec manager docker stack ls
docker exec manager docker stack services <nom-stack>


### URLs (à ajouter dans le fichier hosts)

Dans : C:\Windows\System32\drivers\etc\hosts

ajouter :

127.0.0.1 traefik.swarm.localhost
127.0.0.1 whoami.swarm.localhost
127.0.0.1 portainer.swarm.localhost
127.0.0.1 vote.swarm.localhost
127.0.0.1 result.swarm.localhost
127.0.0.1 api.swarm.localhost

### Services et Urls 

Traefik dashboard : http://traefik.swarm.localhost 
Portainer : http://portainer.swarm.localhost
Voting App — Vote : http://vote.swarm.localhost 
Voting App — Résultats : http://result.swarm.localhost
API My Favorite palces : http://api.swarm.localhost/api


## CI/CD — Application MFP

### CI (Intégration Continue)

**Déclencheur :** push sur `main` dans `esgi-2603-my-favorite-places`, dans notre cas c'est configuré de manière à ce qu'on puisse pas push hormis avec une pull request.

**Étapes :**
1. Installation des dépendances
2. Tests (Jest + Bruno CLI)
3. Build TypeScript
4. Build et push de l'image Docker → `ghcr.io/louisborroni/infra-devops/server:latest`

> Si les tests échouent, le build est annulé et aucune image n'est poussée.

### CD (Déploiement Continu)

**Outil :** Shepherd (service Swarm, déployé via Portainer)

**Fonctionnement :**
- Shepherd interroge le registry toutes les **1 minute**
- Si une nouvelle image `latest` est détectée → mise à jour automatique du service `mfp_server`
- Aucune intervention manuelle nécessaire

**Délai push → prod :** 2 à 4 minutes

### Développement local MFP

via un terminal (bash de préférence)

cd esgi-2603-my-favorite-places

# Lancer toute la stack localement
docker compose up

# Ou uniquement l'API (sans Docker)
cd server && yarn install && yarn dev (marche aussi avec npm)


- Client : http://localhost
- API : http://localhost:3000/api

## Points d'attention

- Toutes PR validées et mergés sur `main` déclenche la CI et un déploiement automatique en production via Shepherd
- Ne jamais pusher du code non testé sur `main` (normalement impossible)
- Le tag `latest` correspond toujours au dernier build réussi de `main`
- Les variables d'environnement sensibles (`.env`) ne doivent pas être committées
- Après un `docker compose down` sur le swarm, relancer toute la séquence de démarrage (Ansible + réseaux + stacks) très important