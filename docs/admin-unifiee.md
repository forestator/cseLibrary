# Administration unifiée du catalogue

## Constat (2026-11-12)

L'administration est aujourd'hui découpée par commission, avec trois systèmes qui ne partagent presque rien :

| Système | Où | Particularités |
|---|---|---|
| Admin générique des commissions « simples » | `admin/components/catalogue-admin/` (route `<commission>/admin/...`) | bricolage, sono, nautisme, photo ; un formulaire (`CatalogueItemDialog`), un sélecteur, un tableau |
| Admin de la ludothèque | `admin/components/admin-ludo/` (route `ludotheque/admin/games`) | jeux de société / vidéo / grands jeux ; formulaire propre (BGG, OpenAI), sélecteur propre |
| Admin de la bibliothèque | `bibliotheque/components/settings-view/` + `modals/` | arbre catégories → auteurs/séries → livres ; édition d'une copie puis un `batch` |

Conséquences : un objet se gère à un endroit différent selon sa commission, les droits sont répartis entre
quatre gardes, le formulaire d'un objet est réécrit à chaque fois (statut, couverture, identifiant unique,
confirmation de suppression), et il n'existe aucune vue d'ensemble (« où est cet objet ? », « qu'est-ce qui n'a
pas de couverture ? », « quels objets sont indisponibles ? »).

## Cible

**Une seule porte d'entrée, `/admin`**, pour tous les objets, quelle que soit la commission :

1. **Liste globale** de tous les objets : recherche unique, filtres (commission, catégorie, statut, « sans
   couverture »), tri, pagination progressive. Chaque ligne indique sa commission.
2. **Un seul parcours d'ajout** : on choisit la commission (puis la catégorie), le formulaire s'adapte.
3. **Un seul formulaire** piloté par une description des champs de la collection (« schéma ») : champs
   communs (nom, identifiant, statut, couverture, description) + champs propres (joueurs et durée pour un jeu
   de société, dimensions pour une remorque, ISBN pour un livre…). Même contrôle d'identifiant unique, même envoi de
   couverture, même confirmation de suppression partout.
4. **Droits au même endroit** : chaque collection déclare qui peut la modifier ; l'interface masque ce qui n'est pas
   permis, les règles Firestore restent la vraie barrière.
5. **Actions groupées** (phase suivante) : changer le statut de plusieurs objets, déplacer vers une autre catégorie,
   exporter en CSV.
6. **Import / réconciliation du catalogue** (phase suivante) : le fichier `catalogue_complet_*.xls` du logiciel de
   gestion est comparé à la base ; l'écran propose « à ajouter / à modifier / à retirer ». Aujourd'hui cette
   opération est faite à la main par script.

## Architecture

```
admin/catalogue/
  admin-collection.model.ts   AdminItem (vue commune d'un objet) et AdminCollection (une source d'objets)
  admin-collections.ts        construit les collections à partir des dépôts existants
  admin-catalogue.*           la page /admin
```

- `AdminItem` : `{key, collectionId, commission, categoryId, name, ref, status, cover}` + la source d'origine.
  C'est une **vue en lecture seule**, jamais ce qui est écrit.
- `AdminCollection` : `{id, commission, label, canManage$, items$, add(), edit(item)}`. Une implémentation par
  famille de données, au-dessus du dépôt existant (qui reste le seul à parler à Firestore) :
  - `CatalogueCollection` (une par commission simple) → `CatalogueRepositories`
  - `GamesCollection` (une par bibliothèque de jeux) → `GamesRepository`
  - `BooksCollection` (phase 3) → `LibraryRepository`
- Ajouter une commission = ajouter une collection, rien d'autre.

## Phases

1. **Socle et liste globale** (fait dans cette première tranche) : page `/admin`, collections catalogue et jeux,
   recherche + filtres, ajout et modification qui **ouvrent les formulaires existants** (aucun écran réécrit,
   donc aucun risque pour les données).
2. ~~**Formulaire unique**~~ **Fait le 2026-11-13** (voir « Formulaire unique » plus bas) : remplacer `CatalogueItemDialog` et le formulaire de jeu par un formulaire piloté par
   un schéma de champs ; reprendre BGG / OpenAI comme une « aide à la saisie » optionnelle d'une collection.
   Supprimer ensuite les routes `<commission>/admin/...` et `ludotheque/admin/games` (redirigées vers `/admin`).
3. **Livres** : intégrer la bibliothèque à la liste globale. Particularité : les livres vivent dans un arbre
   (catégorie → auteur/série → livre) et s'écrivent par catégorie ; la liste globale les affiche à plat, l'édition
   passe par le même formulaire, l'écriture reste portée par `LibraryRepository`.
4. **Actions groupées, export CSV, import du catalogue** (voir « Cible »).
5. **Journal des modifications** (qui a changé quoi) : utile dès qu'il y a plusieurs administrateurs.

## Décisions à prendre

- **Comptes administrateurs** : à repenser par section, chantier séparé noté dans `docs/chantier.md` (n° 2). La première tranche garde le système actuel (un UID par commission + super-administrateurs).
- Les droits restent-ils par commission (comme aujourd'hui, un administrateur par commission + super-administrateurs),
  ou un seul rôle « administrateur du catalogue » pour tout ?
- Les anciennes adresses d'administration (`/bricolage/admin/...`) doivent-elles rediriger vers `/admin` ?
- Les livres entrent-ils dans la liste globale dès la phase 1 (lecture seule) ou seulement en phase 3 ?

## Formulaire unique (fait le 2026-11-13)

`admin/form/` : `AdminItemDialog` est le seul formulaire d'ajout et de modification, quelle que soit la collection.
- **Champs** : chaque collection porte sa liste (`AdminFormDefinition` : sections de champs `text | textarea | number | select | status | checkbox`, champ identifiant, valeurs initiales). `catalogue-collection.ts` et `game-collection.ts` les construisent (statut et dimensions ajoutés ; plus de bascule « Type de jeu »).
- **Fonctions pures testées** (`admin-form.ts`) : fiche → valeurs du formulaire, valeurs → fiche (la fiche d'origine reste la base : les champs que le formulaire ne montre pas, comme `themes`, et les nombres stockés en texte sont conservés ; un champ vidé est retiré), unicité de l'identifiant.
- **Écriture** : `saveAtPath` (`services/firestore/document-paths.ts`), un seul `updateDoc` : écrit la fiche entière à sa place et supprime l'ancienne entrée quand l'identifiant ou la catégorie a changé (plus de doublon).
- **Couverture** : envoyée à Cloudinary dès qu'elle est choisie, mais écrite en base seulement à « Enregistrer » (annuler ne laisse plus de fiche orpheline).
- **Suppression** : confirmation partout (`ConfirmationModal`).
- **Aide BoardGameGeek** : proposée aux seuls jeux de société (recherche + remplissage) ; l'appel OpenAI reste tel quel (échoue sans bruit).
- Supprimés : `CatalogueItemDialog`, `AddGameModal`, `AddGameForm`, `UploadGame`, les anciennes méthodes d'écriture des dépôts.
- **Vérifié sur les émulateurs** (jamais sur la production) : ajout, modification, changement de référence, de catégorie (sans doublon), champs cachés conservés, doublon de référence refusé, envoi d'image puis annulation (aucune fiche), suppression confirmée ; axe sans violation.
- **Tri** (2026-11-13) : chaque colonne du tableau est triable (clic : croissant, décroissant, ordre d'origine ; `aria-sort`) ; collation française numérique, insensible à la casse et aux accents (« ludo96 » avant « ludo342 »), valeurs vides toujours en dernier, tri appliqué avant la pagination. Logique pure dans `admin-sort.ts`, testée.

