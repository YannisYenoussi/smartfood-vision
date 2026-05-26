# 🍽️ SmartFood Vision

Une application web intelligente qui analyse les photos de repas avec l'IA pour détecter les aliments et estimer leur valeur nutritionnelle.

[![Tech Stack](https://img.shields.io/badge/Stack-React%20|%20Express%20|%20MCP-blue?style=flat-square)](https://smartfood-vision.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Installation rapide](#installation-rapide)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Tests & Sécurité](#tests--sécurité)
- [Documentation](#documentation)


---

## 📸 Aperçu

SmartFood Vision offre trois composants intégrés :

### 1. **Application Web** (Atelier 1)
- Interface moderne et responsive
- Upload d'images pour l'analyse
- Affichage des aliments détectés avec scores de confiance
- Estimation nutritionnelle en calories
- Historique des analyses (localStorage)
- Mode démo (mock) et mode Azure Vision

### 2. **Serveur MCP** (Atelier 2)
- Intégration Model Context Protocol pour Claude Desktop
- 5 outils IA disponibles : capabilities, image analysis, nutrition, security, policy
- Validation stricte des entrées contre les injections
- Documentation complète des menaces

### 3. **Architecture Sécurisée**
- Validation URL stricte
- Protection contre les injections (SQL, XSS, prompt injection)
- Gestion d'erreurs robuste
- CORS configuré


---

## 🚀 Installation rapide

### Prérequis
```bash
Node.js 18+
npm
Git
```

### En 3 commandes

```bash
# Clone et setup
git clone <repo-url>
cd smartfood-vision

# Install dépendances
./QUICKSTART.bat  # Windows ou ./QUICKSTART.sh pour macOS/Linux
```

Ou **manuellement** :

```bash
# Terminal 1 : Backend
cd backend && npm install && npm run dev

# Terminal 2 : Frontend  
cd frontend && npm install && npm run dev

# Terminal 3 : MCP Server (optionnel)
cd mcp-server && npm install && npm run dev
```

**Accès :**
- Frontend : http://localhost:5173
- Backend API : http://localhost:3001/api/analyze
- Health check : http://localhost:3001/api/health

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  🌐 FRONTEND (React + Vite + Tailwind) on :5173         │
│     Components, services, localStorage history          │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP REST
                   ↓
┌─────────────────────────────────────────────────────────┐
│  🔧 BACKEND (Express + Node.js) on :3001                │
│     POST /api/analyze, GET /api/health                  │
│     Azure Vision API (si configuré) ou Mock service     │
└──────────────────┬──────────────────────────────────────┘
                   │ stdio
                   ↓
┌─────────────────────────────────────────────────────────┐
│  🤖 MCP SERVER (Model Context Protocol)                 │
│     5 outils pour Claude Desktop                        │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration

### Variables d'environnement

#### `backend/.env` (optionnel, mock par défaut)

```env
# Azure Vision (laisser vide pour utiliser le mock)
AZURE_VISION_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_VISION_KEY=your-32-char-key

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### `mcp-server/.env` (optionnel)

```env
BACKEND_URL=http://localhost:3001
```

### Activer Azure Vision

1. Compte Azure gratuit : https://azure.microsoft.com/fr-fr/free/
2. Ressource **Computer Vision** (tier gratuit = 5000 appels/mois)
3. Copie `Endpoint` et `Clé 1` dans `backend/.env`
4. Redémarre : `cd backend && npm run dev`

---

## 💻 Utilisation

### 1. Application Web

1. Ouvre http://localhost:5173
2. Colle une URL d'image (JPG, PNG, WebP)
3. Clique **"Analyser"**
4. Vois les résultats :
   - Aliments détectés avec scores
   - Calories estimées
   - Résumé nutritionnel
   - Avertissement médical

### 2. API Backend

```bash
# Health check
curl http://localhost:3001/api/health

# Analyse image
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/food.jpg"}'
```

### 3. MCP Server (Claude Desktop)

**Configuration (`claude_desktop_config.json`):**

```json
{
  "mcpServers": {
    "smartfood": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "/path/to/mcp-server"
    }
  }
}
```

Redémarre Claude Desktop et utilise les 5 outils.

---

## 🧪 Tests & Sécurité

### Tests manuels

```bash
# Terminal 1 : Backend
cd backend && npm run dev

# Terminal 2 : Frontend
cd frontend && npm run dev

# Terminal 3 : MCP Server
cd mcp-server && npm run dev
```

Ouvre http://localhost:5173 et teste avec :
- https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg
- https://images.pexels.com/photos/3639901/pexels-photo-3639901.jpeg

### Tests de sécurité

Le projet protège contre :
- ✅ URL validation stricte
- ✅ SQL injection
- ✅ XSS attacks
- ✅ Prompt injection
- ✅ Environment variable exposure

Voir [TESTING.md](TESTING.md) pour les cas complets.

---

## 📚 Documentation complémentaire

| Document | Contenu |
|----------|---------|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Guide de déploiement détaillé |
| [TESTING.md](TESTING.md) | Tests manuels & scénarios de sécurité |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Architecture technique complète |
| [FINAL_CHECKLIST.md](FINAL_CHECKLIST.md) | Checklist pre-production |

---

## 🐳 Docker

```bash
docker-compose up
```

Accès :
- Frontend : http://localhost:5173
- Backend : http://localhost:3001

---

## 🛠️ Stack technique

| Composant | Technos |
|-----------|---------|
| Frontend | React 18.2 + Vite 5 + TypeScript + Tailwind CSS |
| Backend | Node.js 18+ + Express 4 + TypeScript |
| IA | Azure Computer Vision API (ou mock) |
| MCP | @modelcontextprotocol/sdk 0.5 |
| Build | tsx + npm |

---

## 📝 License

MIT © 2026 SmartFood Vision Project

---

**Made with ❤️ for School Workshops**

| Atelier | Objectif | Status |
|---------|----------|--------|
| Atelier 1 | Prototype web React + Backend | ✅ Complet |
| Atelier 2 | Serveur MCP + Claude Desktop | ✅ Complet |
- [ ] Prompt injection bloquée
- [ ] No file access possible
- [ ] No command execution possible
- [ ] No env exposure
- [ ] Tests réussis avec MCP Inspector

### Documentation
- [ ] README complet et clair
- [ ] Instructions d'installation lisibles
- [ ] Variables d'env documentées
- [ ] Exemples de test fournis
- [ ] Claude Desktop config incluse
- [ ] Tests de sécurité expliqués
- [ ] Limites documentées

### Code
- [ ] TypeScript sans erreurs
- [ ] Code formaté et cohérent
- [ ] Commentaires sur points complexes
- [ ] Pas de secrets en dur
- [ ] Structure claire
- [ ] Noms explicites

---

## 👥 Contribution

Projet scolaire SmartFood Vision 2024

---

## 📄 Licence

MIT

---

## 📞 Support

Pour les questions :
1. Vérifiez la section [Lancement](#lancement)
2. Consultez les [Tests de sécurité](#tests-de-sécurité)
3. Vérifiez les logs du backend
4. Utilisez MCP Inspector pour déboguer les outils
5. Lisez la documentation complète ci-dessus

---

**Bon rendu ! 🎉**