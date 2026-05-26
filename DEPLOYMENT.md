# DEPLOYMENT.md - Instructions de déploiement complet

## 🚀 Déploiement local - Configuration complète

Ce guide vous explique comment déployer SmartFood Vision localement pour le développement et les tests.

## 📋 Prérequis

- **Node.js** 18.x ou supérieur
- **npm** 9.x ou supérieur
- **Git**
- Les 3 dossiers: `frontend/`, `backend/`, `mcp-server/`

Vérifiez:
```bash
node --version   # doit afficher v18+
npm --version    # doit afficher 9+
```

## 🔧 Étape 1 : Configuration

### 1.1 Backend

```bash
cd backend

# Copier le fichier .env
cp .env.example .env

# Éditer .env si nécessaire (optionnel pour le test)
# - AZURE_VISION_ENDPOINT et AZURE_VISION_KEY pour Azure
# - PORT=3001 (défaut)
# - NODE_ENV=development

# Installer les dépendances
npm install
```

### 1.2 Frontend

```bash
cd frontend

# Copier le fichier .env
cp .env.example .env

# Vérifier que VITE_API_URL=http://localhost:3001

# Installer les dépendances
npm install
```

### 1.3 MCP Server

```bash
cd mcp-server

# Copier le fichier .env
cp .env.example .env

# Vérifier que BACKEND_URL=http://localhost:3001

# Installer les dépendances
npm install
```

## ▶️ Étape 2 : Lancement des services

Vous devez lancer **3 terminaux séparés** :

### Terminal 1 - Backend

```bash
cd backend
npm run dev

# Sortie attendue:
# 🍽️  SmartFood Vision Backend
# 🚀 Server running on http://localhost:3001
# 📊 Health check: GET http://localhost:3001/api/health
# 🖼️  Analyze image: POST http://localhost:3001/api/analyze
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev

# Sortie attendue:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

Votre navigateur s'ouvre automatiquement sur http://localhost:5173

### Terminal 3 - MCP Server (optionnel maintenant)

```bash
cd mcp-server
npm run dev

# Sortie attendue:
# SmartFood Vision MCP server started
```

## ✅ Étape 3 : Vérification

### 3.1 Frontend fonctionne

1. Allez sur http://localhost:5173
2. Vérifiez que vous voyez le UI avec header "SmartFood Vision"
3. Vérifiez qu'il n'y a pas d'erreur rouge "Backend not accessible"

### 3.2 Backend fonctionne

```bash
# Dans un nouveau terminal
curl http://localhost:3001/api/health

# Devrait retourner:
# {"status":"ok","service":"smartfood-backend","timestamp":"..."}
```

### 3.3 Analyser une image

1. Allez sur http://localhost:5173
2. Collez cette URL:
```
https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=600
```
3. Cliquez "Analyser"
4. Vérifiez que vous voyez les résultats avec aliments détectés

### 3.4 MCP Server fonctionne

```bash
# Dans le terminal du mcp-server, lancez l'inspector
npx @modelcontextprotocol/inspector npm run dev

# Cela ouvrira une interface web
# Testez les outils:
# - get_application_capabilities
# - get_supported_image_formats
# - analyze_food_image
# - estimate_nutrition_from_labels
# - get_security_policy
```

## 🧪 Étape 4 : Tests d'intégration

### Test 1 : Interface responsive

Ouvrez http://localhost:5173 et testez:
- ✅ Sur desktop (full width)
- ✅ Sur tablet (resize à 768px)
- ✅ Sur mobile (resize à 375px)

### Test 2 : Upload image

1. Entrez une URL:
```
https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=600
```
2. Cliquez "Analyser"
3. Vérifiez:
   - ✅ L'image s'affiche
   - ✅ Les résultats apparaissent
   - ✅ Un entry est ajouté à l'historique

### Test 3 : Historique local

1. Faites 2-3 analyses
2. Vérifiez que l'historique affiche les entrées
3. Cliquez sur une entrée historique
4. Vérifiez que les résultats se restaurent
5. Rechargez la page
6. Vérifiez que l'historique persiste

### Test 4 : Gestion d'erreurs

1. Entrez une URL invalide:
```
https://example.com/not-an-image
```
2. Cliquez "Analyser"
3. Vérifiez qu'une erreur s'affiche

## 🖥️ Configuration Claude Desktop

Si vous voulez tester le serveur MCP avec Claude:

### Étape 1 : Construire le serveur

```bash
cd mcp-server
npm run build
```

### Étape 2 : Localiser le fichier config Claude

- **Windows** : `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS** : `~/.config/Claude/claude_desktop_config.json`
- **Linux** : `~/.config/Claude/claude_desktop_config.json`

### Étape 3 : Ajouter SmartFood Vision

Éditez `claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "smartfood-vision": {
      "command": "node",
      "args": [
        "C:/Chemin/Complet/vers/smartfood-vision/mcp-server/dist/index.js"
      ],
      "env": {
        "BACKEND_URL": "http://localhost:3001"
      }
    }
  }
}
```

**Important** : Remplacez le chemin par le chemin complet chez vous !

### Étape 4 : Redémarrer Claude

1. Fermez Claude Desktop complètement
2. Rouvrez Claude Desktop
3. Les outils SmartFood Vision devraient être disponibles

### Étape 5 : Tester dans Claude

Demandez à Claude:
> "Quelles sont les capacités de SmartFood Vision ?"

Claude devrait appeler le tool `get_application_capabilities` et vous montrer les capacités.

## 🔍 Troubleshooting

### ❌ "Backend not accessible" au frontend

**Cause** : Backend ne répond pas

**Solution** :
```bash
# Vérifiez que le backend tourne
curl http://localhost:3001/api/health

# Si ça ne répond pas, redémarrez
cd backend
npm run dev
```

### ❌ "Cannot GET /api/analyze"

**Cause** : Mauvaise URL ou méthode HTTP

**Solution** :
```bash
# Test correct
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=600"}'
```

### ❌ Port 3001 déjà utilisé

**Solution** :
```bash
# macOS/Linux - Trouver le processus
lsof -i :3001
kill -9 <PID>

# Windows - Trouver le processus
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

Puis relancez le backend.

### ❌ Image ne charge pas au frontend

**Cause** : CORS ou URL invalide

**Solution** :
```bash
# Testez l'URL
curl -I "votre-url-image"

# Utilisez une URL Pexels (CORS friendly)
https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg
```

### ❌ MCP Inspector ne se lance pas

**Cause** : MCP package pas installé globalement

**Solution** :
```bash
npm install -g @modelcontextprotocol/inspector

# Puis relancez
npx @modelcontextprotocol/inspector npm run dev
```

### ❌ Claude Desktop ne reconnaît pas les tools

**Cause** : Chemin incorrect ou serveur pas construit

**Solution** :
```bash
# 1. Vérifiez le chemin exact
ls "C:/chemin/complet/smartfood-vision/mcp-server/dist/index.js"

# 2. Reconstruisez si besoin
cd mcp-server
npm run build

# 3. Redémarrez Claude complètement
```

## 📊 Vérification finale - Checklist

Avant de considérer votre déploiement complet :

- [ ] Backend démarre sur port 3001
- [ ] Frontend démarre sur port 5173
- [ ] `/api/health` répond avec status "ok"
- [ ] `/api/analyze` accepte une image et retourne les résultats
- [ ] Frontend affiche l'UI correctement
- [ ] Une image peut être analysée via le frontend
- [ ] L'historique local fonctionne
- [ ] L'historique persiste après rechargement
- [ ] MCP Inspector se lance
- [ ] Les 5 outils MCP sont listés
- [ ] Chaque outil MCP peut être testé
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Pas d'erreurs dans le terminal du backend
- [ ] Pas d'erreurs dans le terminal du frontend
- [ ] CORS fonctionne (pas d'erreur CORS)

## 🎉 Vous êtes prêt !

Si toutes les cases sont cochées, votre déploiement local est complet et fonctionnel.

Prochaines étapes :
- Modifier le code et tester
- Lire le README.md pour plus de détails
- Consulter TESTING.md pour les tests de sécurité
- Préparer le rendu du projet

---

**Besoin d'aide ?** Consultez README.md et TESTING.md
