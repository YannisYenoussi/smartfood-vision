# PROJECT_STRUCTURE.md - Structure complète du projet

Ce fichier documente la structure complète de SmartFood Vision et chaque fichier créé.

## 📁 Structure globale

```
smartfood-vision/
├── frontend/                      # Application React Vite
├── backend/                       # API Express
├── mcp-server/                    # Serveur MCP pour Claude
├── README.md                      # Documentation principale
├── DEPLOYMENT.md                  # Instructions de déploiement
├── TESTING.md                     # Guide de test
├── QUICKSTART.sh                  # Script d'installation (Linux/macOS)
├── QUICKSTART.bat                 # Script d'installation (Windows)
├── PROJECT_STRUCTURE.md           # Ce fichier
├── docker-compose.yml             # Configuration Docker (optionnel)
└── .gitignore                     # Fichiers ignorés par Git
```

---

## 🎨 FRONTEND (`frontend/`)

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx            # En-tête avec branding
│   │   ├── ImageUploader.tsx      # Formulaire pour saisir URL image
│   │   ├── ResultCard.tsx         # Affichage des aliments détectés
│   │   ├── NutritionCard.tsx      # Affichage nutrition + résumé + avertissement
│   │   └── HistoryPanel.tsx       # Panel historique local
│   ├── services/
│   │   └── api.ts                 # Appels API vers le backend
│   ├── types/
│   │   └── analysis.ts            # Types TypeScript partagés
│   ├── App.tsx                    # Composant principal
│   ├── main.tsx                   # Point d'entrée React
│   └── index.css                  # Styles globaux + Tailwind
├── index.html                     # HTML principal
├── package.json                   # Dépendances npm
├── tsconfig.json                  # Configuration TypeScript
├── tsconfig.node.json             # Config TypeScript pour Vite
├── vite.config.ts                 # Configuration Vite (build + dev)
├── tailwind.config.js             # Configuration Tailwind CSS
├── postcss.config.js              # Configuration PostCSS
├── .env.example                   # Template .env
├── Dockerfile                     # Image Docker
└── .gitignore                     # (inherited from root)

Dépendances clés:
- react 18.2.0
- react-dom 18.2.0
- vite 5.0.8
- typescript 5.3.3
- tailwindcss 3.4.1
- axios 1.6.2
```

### Composants Frontend

| Composant | Responsabilité |
|-----------|---|
| **Header** | Logo + titre + description |
| **ImageUploader** | Formulaire + validation URL |
| **ResultCard** | Affichage aliments détectés avec scores |
| **NutritionCard** | Calories + détail + résumé + avertissement |
| **HistoryPanel** | Historique local + restauration |
| **App** | État global + orchestration |

### Services Frontend

| Service | Responsabilité |
|---------|---|
| **api.ts** | Appels POST /analyze, GET /health |

---

## 🔧 BACKEND (`backend/`)

```
backend/
├── src/
│   ├── routes/
│   │   └── analysis.routes.ts     # POST /analyze, validation URL, orchestration
│   ├── services/
│   │   ├── azureVision.service.ts # Client Azure Vision API
│   │   ├── mockVision.service.ts  # Service mock (5 datasets)
│   │   └── nutrition.service.ts   # Estimations caloriques + résumé
│   ├── middleware/
│   │   └── errorHandler.ts        # Gestion globale des erreurs
│   ├── types/
│   │   └── analysis.ts            # Types partagés (DetectedItem, Nutrition, etc)
│   ├── app.ts                     # Configuration Express (CORS, routes, etc)
│   └── server.ts                  # Point d'entrée (écoute port 3001)
├── package.json                   # Dépendances npm
├── tsconfig.json                  # Configuration TypeScript
├── .env.example                   # Template .env
├── Dockerfile                     # Image Docker
└── .gitignore                     # (inherited)

Dépendances clés:
- express 4.18.2
- cors 2.8.5
- axios 1.6.2
- dotenv 16.3.1
- typescript 5.3.3
- tsx 4.7.0 (dev watch)
```

### Services Backend

| Service | Responsabilité |
|---------|---|
| **azureVision.service.ts** | Appel Azure Vision API avec fallback |
| **mockVision.service.ts** | 5 datasets d'aliments réalistes |
| **nutrition.service.ts** | Base de données 20+ aliments, estimation moyenne |

### Routes Backend

| Route | Méthode | Responsabilité |
|-------|---------|---|
| **/api/health** | GET | Vérification service |
| **/api/analyze** | POST | Analyse image, retourne résultats |

---

## 🤖 MCP SERVER (`mcp-server/`)

```
mcp-server/
├── src/
│   ├── tools/
│   │   ├── capabilities.tool.ts        # Tool 1: Capacités application
│   │   ├── imageAnalysis.tool.ts       # Tool 2: Formats images
│   │   ├── nutrition.tool.ts           # Tool 3: Analyse image + Tool 4: Nutrition estimation
│   │   ├── security.tool.ts            # Tool 4 (partie 2): Nutrition estimation
│   │   └── policyTool.ts               # Tool 5: Politique de sécurité
│   ├── services/
│   │   └── smartfoodApi.service.ts    # Client du backend SmartFood
│   ├── security/
│   │   └── inputValidation.ts         # Validation Zod + sanitization
│   ├── types/
│   │   └── analysis.ts                # Types partagés
│   └── index.ts                       # Serveur MCP principal (stdio transport)
├── package.json                       # Dépendances npm
├── tsconfig.json                      # Configuration TypeScript
├── .env.example                       # Template .env
├── Dockerfile                         # Image Docker
└── .gitignore                         # (inherited)

Dépendances clés:
- @modelcontextprotocol/sdk 0.5.0
- zod 3.22.4 (validation stricte)
- axios 1.6.2
- dotenv 16.3.1
- typescript 5.3.3
- tsx 4.7.0 (dev watch)
```

### Outils MCP (5 tools)

| Tool | Type | Responsabilité | Paramètres |
|------|------|---|---|
| **get_application_capabilities** | Exploration | Capacités + limites | (aucun) |
| **get_supported_image_formats** | Exploration | Formats + recommandations | (aucun) |
| **analyze_food_image** | Action | Analyse image, appel backend | imageUrl, language |
| **estimate_nutrition_from_labels** | Action | Calories depuis liste aliments | foods (array) |
| **get_security_policy** | Exploration | Garanties sécurité | (aucun) |

### Validation MCP

Utilise **Zod** pour validation stricte :
- `imageUrlSchema` : URL + extension image validées
- `foodListSchema` : Array 1-20 strings validées
- `sanitizeInput()` : Supprime caractères contrôle + limite 500 chars
- `sanitizeFoodName()` : Supprime injection patterns

---

## 📄 Fichiers de documentation racine

| Fichier | Contenu |
|---------|---------|
| **README.md** | Documentation complète : contexte, architecture, installation, usage, MCP, sécurité, limites, améliorations, checklist |
| **DEPLOYMENT.md** | Guide étape-par-étape pour déployer localement + troubleshooting |
| **TESTING.md** | Tests manuels + tests sécurité + checklist + benchmarks |
| **PROJECT_STRUCTURE.md** | Ce fichier - vue complète de la structure |
| **QUICKSTART.sh** | Script bash d'installation (Linux/macOS) |
| **QUICKSTART.bat** | Script batch d'installation (Windows) |
| **.gitignore** | Fichiers ignorés : node_modules, dist, .env, .DS_Store, etc |
| **docker-compose.yml** | Configuration Docker pour lancer les 3 services |

---

## 🔗 Flux d'intégration

```
┌─────────────────┐
│  Claude Desktop │
│   (optionnel)   │
└────────┬────────┘
         │
    TCP/stdio
         │
    ┌────▼─────────────────────────────┐
    │   MCP Server (port stdio)         │
    │   5 tools + validation Zod        │
    └────┬─────────────────────────────┘
         │
      HTTP/JSON
         │
    ┌────▼─────────────────────────────┐
    │   Backend Express                 │
    │   Port 3001                       │
    │   - Routes: /health, /analyze     │
    │   - Services: Azure/Mock/Nutrition│
    │   - Validation: URL + inputs      │
    └────┬─────────────────────────────┘
         │
      HTTP/JSON (CORS)
         │
    ┌────▼─────────────────────────────┐
    │   Frontend React                  │
    │   Port 5173                       │
    │   - Vite dev server               │
    │   - Components: Upload/Results    │
    │   - LocalStorage: History         │
    └─────────────────────────────────┘

User Browser: http://localhost:5173
```

---

## 🧪 Fichiers de test/support

| Fichier | Contenu |
|---------|---------|
| **backend/test_api.py** | (Hérité du projet précédent - peut être supprimé) |

---

## 💾 Fichiers de configuration

| Fichier | Contenu | Obligatoire |
|---------|---------|---|
| **backend/.env.example** | Template variables backend | Copier en .env |
| **frontend/.env.example** | Template variables frontend | Copier en .env |
| **mcp-server/.env.example** | Template variables MCP | Copier en .env |
| **.gitignore** | Fichiers à ignorer (node_modules, dist, .env) | Oui |
| **docker-compose.yml** | Config Docker (optionnel) | Non (bonus) |

---

## 📊 Statistiques du projet

```
Fichiers TypeScript:        20+
Fichiers de config:         15+
Fichiers de documentation:   6
Composants React:           5
Routes API:                 2
Outils MCP:                 5
Services backend:           3
Types partagés:             3
Lignes de code:             ~3500+
```

---

## 🎯 Points clés de l'architecture

### 1. **Séparation des préoccupations**
- Frontend = UI uniquement
- Backend = Logique métier
- MCP = Interfaçage IA

### 2. **Validation en 3 niveaux**
- URL validation (backend)
- Input sanitization (MCP)
- Type safety (TypeScript partout)

### 3. **Résilience**
- Mode mock sans Azure
- Gestion d'erreurs complète
- Fallback automatique

### 4. **Sécurité**
- Pas d'accès fichier système
- Pas d'exécution commande
- Pas d'exposition d'env
- Validation stricte des inputs

### 5. **Persistance**
- Historique local (localStorage)
- 20 dernières analyses
- Survit aux rechargements

---

## 🚀 Variables d'environnement requises

### Backend (`.env`)
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
AZURE_VISION_ENDPOINT=  # Optionnel
AZURE_VISION_KEY=       # Optionnel
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:3001
```

### MCP Server (`.env`)
```
BACKEND_URL=http://localhost:3001
NODE_ENV=development
```

---

## ✅ Vérification de complétude

Tous les fichiers suivants DOIVENT exister :

### Backend (9 fichiers + config)
- [ ] backend/src/app.ts
- [ ] backend/src/server.ts
- [ ] backend/src/routes/analysis.routes.ts
- [ ] backend/src/services/azureVision.service.ts
- [ ] backend/src/services/mockVision.service.ts
- [ ] backend/src/services/nutrition.service.ts
- [ ] backend/src/middleware/errorHandler.ts
- [ ] backend/src/types/analysis.ts
- [ ] backend/package.json
- [ ] backend/tsconfig.json
- [ ] backend/.env.example
- [ ] backend/Dockerfile

### Frontend (8 fichiers + config)
- [ ] frontend/src/App.tsx
- [ ] frontend/src/main.tsx
- [ ] frontend/src/index.css
- [ ] frontend/src/components/Header.tsx
- [ ] frontend/src/components/ImageUploader.tsx
- [ ] frontend/src/components/ResultCard.tsx
- [ ] frontend/src/components/NutritionCard.tsx
- [ ] frontend/src/components/HistoryPanel.tsx
- [ ] frontend/src/services/api.ts
- [ ] frontend/src/types/analysis.ts
- [ ] frontend/index.html
- [ ] frontend/package.json
- [ ] frontend/vite.config.ts
- [ ] frontend/tsconfig.json
- [ ] frontend/tailwind.config.js
- [ ] frontend/postcss.config.js
- [ ] frontend/.env.example
- [ ] frontend/Dockerfile

### MCP Server (7 fichiers + config)
- [ ] mcp-server/src/index.ts
- [ ] mcp-server/src/tools/capabilities.tool.ts
- [ ] mcp-server/src/tools/imageAnalysis.tool.ts
- [ ] mcp-server/src/tools/nutrition.tool.ts
- [ ] mcp-server/src/tools/security.tool.ts
- [ ] mcp-server/src/tools/policyTool.ts
- [ ] mcp-server/src/services/smartfoodApi.service.ts
- [ ] mcp-server/src/security/inputValidation.ts
- [ ] mcp-server/src/types/analysis.ts
- [ ] mcp-server/package.json
- [ ] mcp-server/tsconfig.json
- [ ] mcp-server/.env.example
- [ ] mcp-server/Dockerfile

### Racine (6 fichiers)
- [ ] README.md
- [ ] DEPLOYMENT.md
- [ ] TESTING.md
- [ ] PROJECT_STRUCTURE.md
- [ ] .gitignore
- [ ] docker-compose.yml
- [ ] QUICKSTART.sh
- [ ] QUICKSTART.bat

**Total: 56+ fichiers**

---

## 🎓 Pour le rendu scolaire

Assurez-vous d'inclure:
1. ✅ Code source complet (tous les fichiers)
2. ✅ Documentation (README + DEPLOYMENT + TESTING)
3. ✅ Instructions d'installation (QUICKSTART)
4. ✅ Exemples de test (TESTING.md)
5. ✅ Configuration Claude Desktop (README)
6. ✅ Explications de sécurité (TESTING + security/inputValidation.ts)

---

**Fin de la documentation structurelle.**
