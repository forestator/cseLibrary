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
3. ~~**Livres**~~ **Fait le 2026-11-13** (voir « Livres et actions groupées » plus bas) : intégrer la bibliothèque à la liste globale. Particularité : les livres vivent dans un arbre
   (catégorie → auteur/série → livre) et s'écrivent par catégorie ; la liste globale les affiche à plat, l'édition
   passe par le même formulaire, l'écriture reste portée par `LibraryRepository`.
4. **Actions groupées, export CSV** fait le 2026-11-13 ; **import du catalogue** reste à faire : (voir « Cible »).
5. ~~**Journal des modifications**~~ **Fait le 2026-11-13** (voir « Journal des modifications » plus bas).

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

## Livres et actions groupées (fait le 2026-11-13)

- **Livres dans la liste** : une collection par bibliothèque (`library-collection.ts`), regroupées dans la section Bibliothèque ; deux vues, une à la fois : « Livres » (par défaut, même liste, mêmes filtres, mêmes tris, même formulaire que les autres commissions) et « Structure » (l'éditeur d'arbre existant, pour catégories, auteurs, séries, éditeurs). La recherche couvre aussi l'auteur et la série.
- **Écriture ciblée** (`LibraryRepository.saveBook / removeBooks / setBooksStatus`) : une transaction qui lit puis réécrit seulement les documents de catégorie concernés (et l'index des auteurs de la bibliothèque si l'auteur est nouveau), jamais `save` qui réécrit toute la bibliothèque. Changer de catégorie déplace le livre (retiré de l'ancienne, ajouté à la nouvelle, un auteur resté sans livre disparaît) ; pas de déplacement entre bibliothèques (la couverture dépend du dossier de la bibliothèque).
- **Logique pure testée** (`bibliotheque/models/library-books.ts`) : retrouver, remplacer, insérer, supprimer, changer le statut, auteur retrouvé par ses mots dans n'importe quel ordre. Un livre par auteur porte `seriesId` = id de l'auteur ; un livre par série porte `parentId` = id de la série (série « Divers » ou celle nommée, créée au besoin).
- **La cote n'est pas un identifiant** (beaucoup de livres en partagent une) : le formulaire n'a pas de champ clé pour les livres, aucune unicité n'est exigée. Les livres sans `id` sont retrouvés par leur place et reçoivent un id à la première modification.
- **Couverture d'un livre** : le nom de fichier (`<id>.jpg`) est écrit, jamais l'URL (le pipe `bookCover` ajoute le préfixe).
- **Résolution paresseuse** : la collection n'obtient `LibraryRepository` qu'à l'ouverture de la section Bibliothèque (sinon les quatre bibliothèques seraient relues sur toutes les pages d'administration).
- **Actions groupées** : cases à cocher (une par ligne + « Tout sélectionner » pour toute la liste filtrée), barre « N sélectionné(s) » : changer le statut (une écriture par document, jamais une par objet), supprimer (avec confirmation), désélectionner. La sélection est vidée dès que la liste change. **Export CSV** de toute la liste filtrée et triée (BOM UTF-8, `;`, cellules entre guillemets, formules neutralisées).
- **Pas dans cette étape** : recherche Google Books dans le formulaire d'un livre (elle existe encore dans la vue « Structure »), changement d'éditeur d'un livre, déplacement entre bibliothèques.

## Journal des modifications (fait le 2026-11-13)

- **Écriture** : un enrobage unique autour de chaque collection (`admin/journal/journaled-collection.ts`) écrit une entrée une fois le changement réussi ; tous les écrans passent par les collections, aucun chemin ne l'évite. L'avant/après est calculé avant l'enregistrement, avec les libellés du formulaire (« Statut : Disponible → Perdu »). Une modification qui ne change rien n'écrit rien. Une action groupée écrit une seule entrée (nombre d'objets et les 20 premiers noms). La modification de la structure de la bibliothèque écrit une entrée sans détail. Si l'écriture du journal échoue, le changement reste fait et un message l'indique.
- **Sécurité** (`firestore.rules`) : append-only (ni modification ni suppression, même pour un super-administrateur), création seulement par l'administrateur de la commission concernée, avec son `uid` et l'horloge du serveur (date non falsifiable), champs limités, lecture réservée aux super-administrateurs. Testé avec un vrai compte d'administrateur de commission sur les émulateurs.
- **Page** `/admin/journal` (carte « Journal des modifications » sur la page d'administration, super-administrateurs) : 500 dernières entrées, plus récentes d'abord, tri par colonne, filtre par type d'action, recherche (administrateur, commission, objet, détail), « Afficher plus ».
- **Hors journal** : les modifications faites avant le 13/11/2026 et les imports par script.
- **Déploiement** : les règles doivent être déployées (`firebase deploy --only firestore`) en même temps que l'application, sinon l'écriture du journal est refusée.

