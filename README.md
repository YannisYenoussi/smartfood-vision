# SmartFood Vision

Application web d'analyse d'aliments par intelligence artificielle.
Elle permet d'identifier les aliments présents dans une photo et d'afficher des informations nutritionnelles associées.

## Membres du groupe

- Baptiste D (Développeur backend)
- Gatta B (Développeur frontend)
- Yannis Y (Recherche IA / tests)

## Concept

L'utilisateur prend ou importe une photo d'un plat. L'application envoie l'image à Azure Computer Vision qui détecte les aliments présents. Les résultats sont affichés avec les informations nutritionnelles estimées.

## Technologies

- **Frontend** : HTML5, CSS3, JavaScript
- **Backend** : Python, Flask
- **Base de données** : MySQL
- **IA** : Azure Computer Vision (Microsoft Azure)

## Installation

### Prérequis

- Python 3.11+
- Un compte Azure avec une ressource Computer Vision active

### Dépendances

```bash
pip install azure-cognitiveservices-vision-computervision
pip install python-dotenv
```

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```
AZURE_KEY= clé1
AZURE_ENDPOINT=https://nom-ressource.cognitiveservices.azure.com/
```


## Tests IA réalisés

Modèle utilisé : Azure Computer Vision  
Paramètres : `visual_features=["Tags", "Description"]`  
Script de test : `test_api.py`

---

### Test 1 — Pizza Margherita

**Tags détectés :**
| Tag | Confiance |
|---|---|
| food | 99.9% |
| dish | 99.8% |
| pizza | 99.6% |
| fast food | 97.5% |
| italian food | 96.4% |
| pizza cheese | 96.0% |
| baked goods | 94.1% |
| california-style pizza | 93.7% |
| cuisine | 91.1% |
| flatbread | 89.5% |
| recipe | 88.9% |
| dairy | 88.2% |
| quiche | 86.8% |
| tomato pie | 86.5% |
| sicilian pizza | 85.1% |
| cheese | 68.5% |
| toppings | 67.6% |

**Description générée :** *"a pizza with cheese and basil"*

**Attendu :** Pizza Margherita  
**Obtenu :** Pizza identifiée avec précision, ingrédients détectés (cheese, toppings, basil)

**Analyse :** Résultat excellent. L'API identifie non seulement "pizza" avec 99.6% de confiance, mais détecte aussi le type (italian food, california-style, sicilian) et les composants (cheese, toppings). La description mentionne même le basilic visible sur l'image. C'est le cas idéal — un plat occidental iconique avec une forme visuelle très standardisée.

---

### Test 2 — Couscous simple (poulet)

**Tags détectés :**
| Tag | Confiance |
|---|---|
| food | 99.1% |
| dish | 97.9% |
| indoor | 95.2% |
| cuisine | 93.6% |
| table | 89.0% |
| recipe | 84.8% |
| wooden | 83.6% |
| pasta | 77.0% |
| floor | 74.2% |
| rice | 69.5% |

**Description générée :** *"a bowl of food"*

**Attendu :** Couscous  
**Obtenu :** "pasta" et "rice" — aucune mention de couscous

**Analyse :** L'API échoue à identifier le couscous. Elle associe la semoule à "pasta" ou "rice" car visuellement similaires pour un modèle entraîné principalement sur des données occidentales. La description "a bowl of food" est extrêmement vague. Le tag "floor" à 74% montre aussi que la table en bois a été mal interprétée.

---

### Test 3 — Couscous complet (viande et légumes)

**Tags détectés :**
| Tag | Confiance |
|---|---|
| food | 98.5% |
| stew | 95.7% |
| cuisine | 93.7% |
| plate | 91.0% |
| table | 90.2% |
| vegetable | 89.0% |
| ingredient | 87.8% |
| cozido | 84.9% |
| legume | 84.1% |
| indoor | 75.3% |
| meat | 73.0% |
| carrot | 66.3% |
| dish | 65.2% |
| bean | 55.2% |
| plant | 54.7% |

**Description générée :** *"a bowl of food"*

**Attendu :** Couscous avec viande et légumes  
**Obtenu :** "stew" (ragoût) et "cozido" (plat portugais)

**Analyse :** L'API détecte correctement les ingrédients individuels (carrot, meat, vegetable, bean) mais ne reconnaît pas le plat global. Elle associe le couscous à "cozido", un ragoût portugais visuellement similaire. C'est une limite claire du modèle sur les cuisines du Maghreb. Points positifs : la détection des légumes individuels reste utile pour estimer des valeurs nutritionnelles par ingrédient.

---

### Test 4 — Paella

**Tags détectés :**
| Tag | Confiance |
|---|---|
| mixture | 85.6% |
| food | 58.6% |
| paella | 55.3% |

**Description générée :** *"a bowl of soup"*

**Attendu :** Paella  
**Obtenu :** "paella" trouvé mais avec seulement 55.3% de confiance

**Analyse :** La paella est reconnue mais avec une confiance faible (55%). La description "a bowl of soup" est incorrecte — la paella est servie dans une poêle plate, pas un bol. Le faible nombre de tags retournés (3 seulement) suggère que l'image était difficile à analyser, probablement à cause de l'angle et des couleurs uniformes du riz safran.

---

### Test 5 — Baguette

**Tags détectés :**
| Tag | Confiance |
|---|---|
| food | 98.9% |
| bread | 98.7% |
| baked goods | 97.7% |
| gluten | 96.0% |
| snack | 95.7% |
| fast food | 92.1% |
| loaf | 90.3% |
| wheat gluten | 89.6% |
| baker's yeast | 89.4% |
| ciabatta | 86.5% |
| whole grain | 86.2% |
| sourdough | 85.3% |
| bread roll | 85.2% |
| ground | 78.7% |
| indoor | 77.1% |
| floor | 63.5% |

**Description générée :** *"a piece of food on a counter"*

**Attendu :** Baguette  
**Obtenu :** "bread" correct, mais "baguette" absent — propose "ciabatta" et "sourdough"

**Analyse :** L'API reconnaît très bien la catégorie générale (bread à 98.7%) et détecte des sous-types de pain (ciabatta, sourdough, bread roll). Cependant le terme "baguette" n'apparaît pas, probablement sous-représenté dans les données d'entraînement. La description est correcte mais vague. Le tag "floor" à 63.5% montre une confusion entre le plan de travail clair et un sol.

---

## Conclusions générales

**Points forts de l'API :**
- Excellente précision sur les plats occidentaux iconiques et les fast food (pizza, burger...)
- Bonne détection des ingrédients individuels (carotte, viande, légumes)
- Retourne de nombreux tags utiles avec des scores de confiance exploitables

**Limites identifiées :**
- Faible reconnaissance des plats moins populaires (couscous non reconnu)
- Le nom exact d'un plat peut être manqué même si la catégorie est correcte (baguette → bread)
- Les descriptions générées restent souvent vagues ("a bowl of food")
- L'API détecte des concepts visuels, pas des valeurs nutritionnelles — un mapping manuel sera nécessaire
- Confusion possible entre surfaces similaires (table en bois → floor)

**Recommandation pour le projet :**
Plutôt que d'identifier le nom exact du plat, il est plus fiable de s'appuyer sur les ingrédients détectés par l'API (meat, carrot, cheese...) et d'associer des calories à chaque ingrédient via une base de données interne. Cela permet d'estimer les apports nutritionnels même quand le plat n'est pas reconnu précisément.