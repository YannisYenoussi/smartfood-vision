# FINAL_CHECKLIST.md - Checklist complète avant rendu

## ✅ Avant de rendre le projet

Utilisez cette checklist pour vous assurer que tout fonctionne.

---

## 🔍 Étape 1 : Vérification des fichiers

### Backend

```bash
# Vérifiez que tous les fichiers existent
ls -la backend/src/
# Doit contenir: app.ts, server.ts, routes/, services/, middleware/, types/

ls -la backend/src/routes/
# Doit contenir: analysis.routes.ts

ls -la backend/src/services/
# Doit contenir: azureVision.service.ts, mockVision.service.ts, nutrition.service.ts

ls -la backend/
# Doit contenir: package.json, tsconfig.json, Dockerfile, .env.example
```

### Frontend

```bash
ls -la frontend/src/
# Doit contenir: App.tsx, main.tsx, index.css, components/, services/, types/

ls -la frontend/src/components/
# Doit contenir: Header.tsx, ImageUploader.tsx, ResultCard.tsx, NutritionCard.tsx, HistoryPanel.tsx

ls -la frontend/
# Doit contenir: index.html, package.json, vite.config.ts, tailwind.config.js, .env.example, Dockerfile
```

### MCP Server

```bash
ls -la mcp-server/src/
# Doit contenir: index.ts, tools/, services/, security/, types/

ls -la mcp-server/src/tools/
# Doit contenir: capabilities.tool.ts, imageAnalysis.tool.ts, nutrition.tool.ts, security.tool.ts, policyTool.ts

ls -la mcp-server/
# Doit contenir: package.json, tsconfig.json, Dockerfile, .env.example
```

### Documentation

```bash
ls -la smartfood-vision/
# Doit contenir: README.md, DEPLOYMENT.md, TESTING.md, PROJECT_STRUCTURE.md, QUICKSTART.sh, QUICKSTART.bat, .gitignore, docker-compose.yml
```

---

## 🚀 Étape 2 : Installation et lancement

### Installer les dépendances

```bash
# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..

# MCP Server
cd mcp-server && npm install && cd ..
```

### Lancer les services (3 terminaux)

**Terminal 1 : Backend**
```bash
cd backend
npm run dev
# ✓ Doit afficher "Server running on http://localhost:3001"
```

**Terminal 2 : Frontend**
```bash
cd frontend
npm run dev
# ✓ Navigateur doit s'ouvrir sur http://localhost:5173
```

**Terminal 3 : MCP (optionnel pour maintenant)**
```bash
cd mcp-server
npm run dev
# ✓ Doit afficher "SmartFood Vision MCP server started"
```

---

## 🧪 Étape 3 : Tests fonctionnels

### 3.1 Test Backend Health

```bash
# Dans un nouveau terminal
curl http://localhost:3001/api/health

# ✓ Attendu: {"status":"ok","service":"smartfood-backend","timestamp":"..."}
```

**Checklist** :
- [ ] Réponse 200 OK
- [ ] Contient "status": "ok"
- [ ] Contient "service": "smartfood-backend"

### 3.2 Test Analyse Image

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=600"
  }'

# ✓ Attendu: {"success":true,"source":"mock","detectedItems":[...],"nutrition":{...},"summary":"...","warning":"..."}
```

**Checklist** :
- [ ] Réponse 200 OK
- [ ] Contient "success": true
- [ ] Contient "source": "mock" (ou "azure" si configuré)
- [ ] Contient "detectedItems" array
- [ ] Contient "nutrition" object
- [ ] Contient "summary" string
- [ ] Contient "warning" string

### 3.3 Test Frontend UI

Allez sur http://localhost:5173

**Checklist** :
- [ ] Page charge sans erreur
- [ ] Header visible avec logo "🍽️ SmartFood Vision"
- [ ] Section de saisie URL présente
- [ ] Pas de message d'erreur backend
- [ ] Console browser propre (F12 → Console)

### 3.4 Test Frontend Analyse

1. Collez cette URL dans le formulaire :
```
https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=600
```

2. Cliquez "Analyser"

**Checklist** :
- [ ] Bouton change en "⏳ Analyse..."
- [ ] Image s'affiche après quelques secondes
- [ ] Cartes de résultats apparaissent
- [ ] Aliments listés avec scores de confiance
- [ ] Calories affichées
- [ ] Historique local mis à jour

### 3.5 Test Historique

1. Faire 2-3 analyses différentes
2. Observer le panel historique à droite
3. Cliquer sur une entrée historique

**Checklist** :
- [ ] Historique affiche les 3 entrées
- [ ] Cliquer sur une entrée restaure les résultats
- [ ] Rechargez la page
- [ ] L'historique persiste

### 3.6 Test Gestion d'erreurs

1. Entrez une URL invalide:
```
https://example.com/not-an-image.txt
```

2. Cliquez "Analyser"

**Checklist** :
- [ ] Un message d'erreur rouge s'affiche
- [ ] Message dit "Analysis failed: ..."
- [ ] Pas d'erreur non-gérée
- [ ] UI reste responsive

### 3.7 Test MCP Inspector (optionnel)

```bash
# Dans le terminal mcp-server
npx @modelcontextprotocol/inspector npm run dev
```

**Checklist** :
- [ ] Interface web s'ouvre
- [ ] Les 5 outils sont listés
- [ ] Chaque outil peut être testé
- [ ] Les réponses JSON sont correctes
- [ ] Pas d'erreur dans les logs

---

## 🔒 Étape 4 : Tests de sécurité

### 4.1 Validation d'URL

```bash
# Test 1 : URL invalide
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"not-a-url"}'

# ✓ Attendu: {"success":false,"error":"...","code":"INVALID_INPUT"}
```

**Checklist** :
- [ ] Statut 400 Bad Request
- [ ] Error message fourni

### 4.2 Protocol file:// rejeté

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"file:///etc/passwd"}'

# ✓ Attendu: Error 400
```

**Checklist** :
- [ ] Rejeté avec statut 400
- [ ] Pas d'accès au fichier

### 4.3 Injection SQL

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://example.com/\"; DROP TABLE--"}'

# ✓ Attendu: Error 400 (URL invalide)
```

**Checklist** :
- [ ] Rejeté avec statut 400
- [ ] Pas d'exécution SQL

### 4.4 Prompt Injection MCP

Lancez MCP Inspector et testez :

```json
{
  "tool": "estimate_nutrition_from_labels",
  "input": {
    "foods": ["test'; DROP--", "normal food"]
  }
}
```

**Checklist** :
- [ ] Pas d'erreur
- [ ] Caractères spéciaux supprimés
- [ ] Réponse JSON valide

### 4.5 Pas d'exposition d'env

```bash
# Test dans MCP Inspector avec le tool get_security_policy
```

**Checklist** :
- [ ] Aucun process.env retourné
- [ ] Aucune clé Azure exposée
- [ ] Politique de sécurité documentée

---

## 💻 Étape 5 : Tests de responsive design

### Test Desktop
- [ ] Ouvrez http://localhost:5173
- [ ] Vérifiez que la mise en page est correcte
- [ ] Testez une analyse complète

### Test Tablet
- [ ] F12 (DevTools)
- [ ] Cliquez responsive design mode
- [ ] Sélectionnez iPad (768px)
- [ ] Vérifiez que tout s'affiche correctement
- [ ] Testez une analyse

### Test Mobile
- [ ] DevTools → responsive design mode
- [ ] Sélectionnez iPhone 12 (390px)
- [ ] Vérifiez mise en page mobile
- [ ] Testez une analyse
- [ ] Vérifiez que historique s'affiche

**Checklist** :
- [ ] Desktop OK
- [ ] Tablet OK
- [ ] Mobile OK
- [ ] Pas de dépassement horizontale
- [ ] Boutons cliquables au doigt

---

## 📊 Étape 6 : Vérification console

### Console Browser (F12)

**Checklist** :
- [ ] Pas d'erreur rouge
- [ ] Pas de warnings critiques
- [ ] CORS working (pas d'erreur CORS)
- [ ] Network tab clean (pas de 404)

### Terminal Backend

**Checklist** :
- [ ] Pas d'erreur non gérée
- [ ] Les logs des requêtes sont clairs
- [ ] Arrêt propre (pas de crash)

### Terminal Frontend

**Checklist** :
- [ ] Pas d'erreur de build
- [ ] Pas de warning TypeScript non gérés
- [ ] HMR (hot module reload) fonctionne

---

## 📝 Étape 7 : Vérification documentation

### README.md

**Checklist** :
- [ ] Contexte du projet clair
- [ ] Objectifs des 2 ateliers expliqués
- [ ] Architecture diagrammée
- [ ] Installation couverte
- [ ] Variables d'env documentées
- [ ] Commandes de lancement exactes
- [ ] Exemples API fournis
- [ ] Configuration Claude Desktop incluse
- [ ] Tests de sécurité documentés
- [ ] Limites listées
- [ ] Pistes d'amélioration incluses

### DEPLOYMENT.md

**Checklist** :
- [ ] Prérequis listés
- [ ] Étapes configuration claires
- [ ] 3 terminaux expliqués
- [ ] Vérification par étape
- [ ] Troubleshooting fourni
- [ ] Checklist finale présente

### TESTING.md

**Checklist** :
- [ ] Tests manuels décrits
- [ ] Exemples de curl fournis
- [ ] Tests de sécurité couverts
- [ ] Expected results documentés
- [ ] Checklist finale présente

### PROJECT_STRUCTURE.md

**Checklist** :
- [ ] Arborescence complète
- [ ] Tous les fichiers listés
- [ ] Responsabilités expliquées
- [ ] Statistiques du projet

---

## 🎯 Étape 8 : Vérification code

### TypeScript

**Checklist** :
- [ ] `npm run build` dans chaque dossier fonctionne
- [ ] Pas d'erreur TypeScript
- [ ] `dist/` créé dans chaque dossier

### Code Quality

**Checklist** :
- [ ] Noms explicites (variables, fonctions)
- [ ] Pas de console.log inutiles
- [ ] Pas de TODO/FIXME critiques
- [ ] Imports organisés
- [ ] Pas de dépendances non utilisées

### Commentaires

**Checklist** :
- [ ] Services ont des commentaires
- [ ] Fonctions complexes commentées
- [ ] Pas de surcommentage
- [ ] JSDoc sur outils MCP

---

## 🚢 Étape 9 : Préparation au rendu

### Nettoyage

```bash
# Supprimez les fichiers temporaires
rm -rf node_modules dist .DS_Store
```

### .env files

**Checklist** :
- [ ] `.env` files NON inclus (seulement `.env.example`)
- [ ] Vérifiez `.gitignore` contient `.env`
- [ ] Aucun secret dans le code

### Git (si applicable)

```bash
git status
# Vérifiez qu'il n'y a pas de node_modules, dist, .env

git add .
git commit -m "SmartFood Vision - Atelier 1 & 2 complet"
```

**Checklist** :
- [ ] Pas de `node_modules/` suivi
- [ ] Pas de `dist/` suivi
- [ ] Pas de `.env` suivi
- [ ] Tous les sources `.ts` suivis
- [ ] Tous les configs suivis
- [ ] README et docs suivis

### Archive pour rendu

```bash
# Si rendu sur archive
zip -r smartfood-vision.zip smartfood-vision/ -x "*/node_modules/*" "*/.git/*" "*/.env" "*/ dist/*"

# Vérifiez
unzip -l smartfood-vision.zip | head -20
```

**Checklist** :
- [ ] Archive < 5MB (sans node_modules)
- [ ] README inclus
- [ ] Source code inclus
- [ ] package.json inclus

---

## ✅ CHECKLIST FINALE

### Avant de soumettre

- [ ] **Backend** : `npm run dev` fonctionne
- [ ] **Frontend** : `npm run dev` fonctionne et ouvre le navigateur
- [ ] **MCP** : `npm run dev` fonctionne
- [ ] **Health check** : GET /api/health répond
- [ ] **Analyse** : POST /api/analyze fonctionne
- [ ] **UI** : Responsive sur mobile/tablet/desktop
- [ ] **Historique** : Local storage persiste
- [ ] **Erreurs** : Gérées proprement
- [ ] **Sécurité** : Tests passent
- [ ] **MCP Tools** : 5 tools listés et fonctionnels
- [ ] **Documentation** : README + DEPLOYMENT + TESTING complets
- [ ] **Code** : Pas d'erreurs TypeScript
- [ ] **Git** : Pas de secrets exposés
- [ ] **Console** : Propre (pas d'erreurs rouge)
- [ ] **Commit** : Message clair

---

## 🎉 Prêt à rendre !

Si toutes les cases sont cochées, votre projet est complet et prêt.

### Fichiers à inclure dans le rendu

```
smartfood-vision/
├── frontend/              # Avec src/ et config complets
├── backend/               # Avec src/ et config complets
├── mcp-server/            # Avec src/ et config complets
├── README.md              # Documentation principale
├── DEPLOYMENT.md          # Déploiement
├── TESTING.md             # Tests
├── PROJECT_STRUCTURE.md   # Structure
├── FINAL_CHECKLIST.md     # Ce fichier
├── QUICKSTART.sh          # Installation Linux/macOS
├── QUICKSTART.bat         # Installation Windows
├── docker-compose.yml     # Docker (bonus)
└── .gitignore             # Git ignore
```

### Commandes rapides pour le rendu

```bash
# Vérification finale
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..
cd mcp-server && npm run build && cd ..

# Test rapide (si rendu au labo)
cd backend && npm run dev &
cd frontend && npm run dev &
cd mcp-server && npm run dev &

# Ouvrir http://localhost:5173
# Tester une analyse
# Vérifier l'historique

# Arrêter les processus
kill %1 %2 %3
```

---

**Bonne chance pour le rendu ! 🚀**
