# État du chantier (session du 2026-11-08)

## Fait
- Repo migré vers `https://github.com/forestator/cseLibrary` (historique de la branche, clé OpenAI effacée de l'historique réécrit).
- Module emprunts supprimé (voir `CLAUDE.md`, section Emprunts).
- SCSS uniquement (décision actée).
- Angular 16 → **22.2**, TypeScript 6, Material 22, `@angular/fire` 22.0.0-rc, Node ≥ 22.22.3 / 24 (`.nvmrc`).
- `firebaseui` / `firebaseui-angular` retirés ; écran de connexion maison dans `admin-home` (email/mot de passe, Google, GitHub).
- Storage : upload des couvertures migré vers **Cloudinary** (`services/cloudinary.service.ts`, `StorageUploadService`), cloud `seo9axkp`, preset non signé `cse_unsigned` (dans `environment*.ts`, non secret). Les pipes `bookCover` / `categoryBackground` construisent l'URL Cloudinary à partir de l'ancien chemin Storage.
- **1213 fichiers** du bucket `cseh-50966.appspot.com` copiés vers Cloudinary (`scripts/migrate-storage/migrate.mjs copy`), avec la même arborescence ; sauvegarde locale de 104 Mo faite pendant la session (dossier de session temporaire, à avoir copié ailleurs).
- 9 fichiers source (templates/services) réécrits avec les nouvelles URLs (`rewrite-src`).

## Historique : bascule des URLs d'images (terminée par la migration Firestore)
`scripts/migrate-storage/updates.json` (ignoré par git, régénérable) contient 265 champs de la base qui pointent encore vers Firebase Storage. Pour l'appliquer :
1. Exporter la base (console Realtime Database → Export JSON) ; `node scripts/migrate-storage/migrate.mjs rewrite-db --cloud seo9axkp --db <export.json>` régénère `updates.json`.
2. `npx firebase-tools database:update / scripts/migrate-storage/updates.json --project cseh-50966` (multi-path update, n'écrase pas le reste).
3. Vérifier dans l'app, puis (seulement alors) envisager de repasser le projet en Spark et de supprimer le bucket.
Tant que l'étape 2 n'est pas faite, les couvertures de jeux/outils/sono/nautisme/photo de la base pointent vers l'ancien Storage (cassé si le projet repasse en Spark). Les couvertures de livres sont déjà servies par Cloudinary via les pipes.

## À faire (priorité décroissante)
1. ~~**Sécurité** : Realtime Database lisible publiquement~~ **Fait le 10/11/2026** : nouvelle appli déployée sur `cseh-50966.web.app` (Firestore uniquement), puis RTDB verrouillée (`database.rules.json`, `firebase.json`). Sauvegarde locale hors repo (ne jamais la commiter : données personnelles).
2. Finir la bascule base (ci-dessus), tester upload d'une couverture dans chaque admin (jeux, bricolage, sono, nautisme) : le flux Cloudinary n'a été vérifié que par build et par un upload de test en ligne de commande.
3. Revoquer la clé OpenAI compromise ; décider de la suite des descriptions IA (le modèle `text-davinci-003` est retiré) : proxy serveur ou suppression.
4. `@angular/fire` : repasser de 22.0.0-rc à la version stable dès sa sortie.
5. Tester l'app en vrai (serveur, connexion, Cypress, tests unitaires) : seuls les builds dev/prod sont vérifiés.
6. Convertir en standalone / signals / `@if`/`@for` / `inject()` / OnPush, commission par commission (nautisme ou photo d'abord) ; les composants sont marqués `standalone: false` par la migration v19.
7. Factoriser la duplication bricolage / sonothèque / nautisme / photo.
8. `strict: true` ; config Firebase et UIDs admin dans `environment`.
9. Remplacer Moment.js, ajouter de vrais tests et une CI.
10. Refonte des emprunts, de zéro (ne pas réintroduire l'ancien schéma).
11. Alertes de budget Google Cloud à 1 € (le projet est en Blaze) et sortie éventuelle de Blaze après migration complète.

## Fait le 2026-11-09
- Outillage navigateur (MCP utilisateur, puppeteer-core, émulateurs).
- Refactoring complet : migrations officielles (standalone, `inject()`, signals, queries, outputs, self-closing), routes lazy, plus aucun NgModule ; suppression des doublons (`catalogue/` générique pour 4 commissions, ludothèque et bibliothèque refondues autour de dépôts de données, modales/réglages génériques).
- Migration Realtime Database → Firestore (base `(default)` native, europe-west1, depuis le 10/11/2026 : l'ancienne base nommée `cse-db` exigeait la facturation) : modèle, règles déployées, 313 documents importés en production, Auth passé en API modulaire (`@angular/fire` compat supprimé), émulateurs pour tester l'admin.
- Vérifications : build dev + prod, 21 tests unitaires, 33 pages comparées à une référence (données et images identiques, base Firestore de production), connexion admin + ajout d'un outil de bout en bout sur émulateur.

## Reste à faire (priorité décroissante)
1. ~~Verrouiller la Realtime Database~~ fait le 10/11/2026 (hébergement redéployé avant).
2. ~~Nouveau design~~ : fait le 2026-11-09 (voir `CLAUDE.md`, section Design). Reste à affiner en local : couleurs d'accent des dialogues (overlay hors `[data-commission]`), bouton « Filtres » sur mobile pour les jeux de société (aujourd'hui seulement dans le tiroir), nettoyage des classes legacy de `common.scss` (`core-*`, `book-*`) une fois plus utilisées, vérification Cypress/axe complète, upload Cloudinary réel depuis la nouvelle zone de dépôt.
3. 5 composants partagés encore en `ChangeDetectionStrategy.Eager` à passer en OnPush/signals.
4. Écritures admin ludothèque / bibliothèque non testées de bout en bout (seul l'ajout catalogue l'a été) ; la persistance des réglages bibliothèque n'existe pas (comme avant).
5. Révoquer la clé OpenAI compromise ; décider du sort des descriptions IA.
6. `@angular/fire` stable dès sa sortie ; repasser le projet de Blaze à Spark seulement si Firestore + Cloudinary restent dans leurs quotas gratuits (Storage Firebase n'est plus utilisé mais le bucket existe encore).
7. `strict: true`, config/UIDs admin hors du code, Moment.js, CI, tests e2e à jour (Cypress est obsolète).
8. Refonte des emprunts, de zéro.

## Couvertures de la ludothèque (10/11/2026)

- 111 jeux sans image ou avec lien cassé ont reçu une couverture (101 jeux vidéo, 8 jeux de société, 2 jeux d'extérieur), écrite dans le champ `cover` de `ludotheque/{boardGames|videoGames|outsideGames}` (base `cse-db`) ; rien d'autre n'a été modifié.
- Fichiers sur Cloudinary : `assets/games/covers/<bibliothèque>/<référence>-cover`. Jaquettes de jeux vidéo lues sur les fiches Wikipédia (images « fair use », usage interne), les autres sur les fiches des fabricants et revendeurs.
- Restent sans image : `videoGames/967` (Moto Racer 4) et `videoGames/968` (Handball 17).


## 10/11/2026 : tests d'écriture admin (émulateurs)

Ajout d'un équipement photo, ajout / modification / suppression d'un jeu de la ludothèque, ajout d'un outil de bricolage : OK. Page réglages de la bibliothèque : chargement OK (édition en mémoire seulement). Envoi Cloudinary : testé à la main par le propriétaire. Reste : révoquer la clé OpenAI, supprimer l'objet de test « test2 » (réf. 666) dans la production du bricolage.

## 10/11/2026 : retour au forfait gratuit

Base `(default)` recréée en Firestore natif, données copiées, hébergement redéployé, objet de test « test2 » supprimé. À vérifier après le passage en Spark : le site charge toujours ses données ; puis supprimer `cse-db`.

## 10/11/2026 (soir) : panneau de détail, recherche bibliothèque, ménage

- Détail des cartes : panneau latéral (`common/components/detail-panel`, ouvert via `DetailPanelService`), plein écran sur mobile ; l'élément choisi par la recherche l'ouvre directement.
- Accent par commission pour les dialogues/panneaux : `data-commission` posé sur `<html>` par `AppComponent`, boutons Material recolorés dans `styles.scss`.
- Recherche de la bibliothèque (titre, série, auteur, ISBN) : `bibliotheque/models/library-search.ts`, composant générique `common/components/search-box`.
- Bouton « Filtres » mobile pour les jeux de société ; `common.scss` (CSS mort) supprimé ; `.firebase/` ignoré.
- Reste : suivi des limites listées dans l'historique (pas d'axe sur la recherche et la feuille de filtres), @angular/fire stable, mode strict, Moment, CI, Cypress, OpenAI, deux jeux sans image (967, 968).

## 10/11/2026 (nuit) : persistance des réglages de la bibliothèque

- Page réglages : boutons « Enregistrer les modifications » / « Annuler » ; `LibraryRepository.save` écrit en un batch (testé sur émulateur : ajout d'un auteur persisté). Compteur de l'admin ludothèque en direct. Budgets de build ajustés (styles de composant 6 ko, initial 2,3 Mo) ; avertissement Sass `list.nth` corrigé.

## 10/11/2026 (nuit) : mise à jour de la ludothèque depuis l'Excel « Liste des jeux et Réservation 2026 »

- Jeux de société : 67 jeux ajoutés (`ludo229` à `ludo232`, `ludo281` à `ludo343`) avec couverture Cloudinary, infos et description vérifiées sur les sites de revendeurs ; nouveautés = `ludo315` à `ludo343` (29). Non ajoutés : `ludo14` et `ludo97` (déjà là sous une autre référence), `ludo24` (noté « Disparu »). `ludo229` (Puzzle 2 : Habitation) n'a ni couverture ni infos fiables.
- Jeux vidéo : 35 jeux ajoutés (Switch 12, Switch 2 6, PS4 2, PS5 12, Xbox One 2, Series X 1), tous en nouveauté. Consoles et accessoires de l'Excel déjà présents (autres noms) : non ajoutés.
- Toutes les anciennes nouveautés (jeux de société 22, jeux vidéo 20, grands jeux 4) ont perdu le drapeau `isNew`. Sauvegardes locales (hors dépôt) avant écriture.

## 10/11/2026 (nuit) : images du bricolage et de la photo, nouveautés mises en avant

- Bricolage : 196 des 224 outils sans image ont reçu une photo (Cloudinary `assets/tools/covers/<catégorie>/<id>-cover`) ; 28 restent sur l'image par défaut (aucune photo fiable trouvée). La plupart sont des photos représentatives (même type d'outil, parfois autre marque) : à remplacer par les vraies photos du CSE au fil de l'eau (admin > modifier un outil > image).
- Photo & vidéo : les 19 équipements sans image en ont une (`assets/materielPhoto/covers/...`), dont 7 modèles exacts ; les autres sont des modèles proches ou génériques (écrans, trépied, copieur VHS...).
- Ludothèque : bandeau « Nouveautés » en tête de la page d'accueil (`new-arrivals`), lien « Nouveautés » mis en avant en tête du menu latéral (ludothèque et bibliothèque).

## 10/11/2026 (nuit) : images de la sonothèque

- 56 objets sans image ont reçu une photo générique par type d'équipement (20 types, `assets/sonoItems/covers/<type>` sur Cloudinary) ; 4 sont des modèles précis (lecteurs Gemini CDM3600/3700, table DJX750, projecteur Mushroom). Les micros HF/filaires, lasers, jeux de lumière LED, « wings » et sonos portables sont des photos représentatives d'autres modèles : à remplacer par les vraies photos du CSE via l'administration si besoin.

## Bibliothèque : couvertures et nettoyage (2026-11-12)
- **Couvertures :** 980 livres sans couverture en ont une (Open Library, correspondance titre + nom d'auteur ; images redimensionnées à 600×900 max, envoyées sur Cloudinary en `assets/books/covers/<rom|img|kids|others>/<id du livre>`, champ `cover` = `<id>.jpg`). Les images uniformes ou noires (76) ont été écartées. Restent ~1390 livres sans couverture (jeunesse sans auteur, guides, titres introuvables). 4 couvertures qui renvoyaient 404 sont repassées à `NoCover.jpg`.
- **Rangement :** 4 romans déplacés de « Romans français » / « Policiers » vers « Romans étrangers » (cote `RE-*`) : Evans, Haran, O'Connell, Osorio. À examiner à la main : Lenteric (`R-LEN`) en 13 ans, Wood (`(5:6)`) en 7-9 ans, Simenon (`RP-SIM`) en romans français. Genres discutables non touchés (cote = étagère) : Gaiman, Outlander en SF ; Jurassic Park, Fatherland, Metro 2033 en fantastique.
- **Doublons supprimés :** *L'homme aux cercles bleus* (entrée `RE-VAR`), *Zulu* (`POL-FER`), *L'éveil d'Endymion* (entrée « déclassée »). Les autres paires (mêmes cotes) sont des exemplaires multiples probables, conservés.
- **ISBN poubelle :** `9780662533313` sur 9 livres sans rapport (métadonnées et résumés faux, ex. *Un été en Toscane*) : à nettoyer.
- Sauvegardes locales avant écriture (hors dépôt) : dumps JSON des documents `bibliotheque`.

## Chantiers ouverts (2026-11-12)
1. **Administration unifiée du catalogue** : une seule porte d'entrée `/admin` pour tous les objets, au lieu d'une administration par commission. Conception, architecture et phases : `docs/admin-unifiee.md`. Première tranche (liste globale avec recherche et filtres, ajout et modification via les formulaires existants) en cours.
2. **Repenser les comptes administrateurs par section** (à planifier, pas commencé) : aujourd'hui un UID par commission (bricolage, ludothèque, nautisme, sonothèque) plus six super-administrateurs, écrits en dur dans `services/firebase/authentification.service.ts` **et** dans `firestore.rules`. À revoir : gestion des administrateurs depuis l'application (et non dans le code), rôles par commission, une personne pouvant administrer plusieurs sections, journal des modifications. Dépend de la décision « droits par commission ou rôle unique » de `docs/admin-unifiee.md`.
3. **Import du catalogue du logiciel de gestion** (`catalogue_complet_*.xls`) : fait à la main par script le 12/11/2026 (anciennes consoles, jeux, bricolage, livres). À transformer en écran de réconciliation (« à ajouter / à modifier / à retirer »), cf. phase 4 de l'administration unifiée.

## État au 2026-11-12 (fin de journée) et reprise
**Déployé** (`a64f259` sur `main`, site et règles Firestore à jour) : anciennes consoles (Wii, PS3, Xbox 360, DS, 3DS, PS2, PSP, PS Vita) en section discrète ; tri des jeux de société par numéro `ludo` décroissant, références sans numéro (codes-barres compris) à la fin ; horaires des commissions (bibliothèque lundi 12h-12h30 + jeudi 13h30-14h chaque semaine, ludothèque mardi 12h-12h30 + jeudi 13h30-14h une semaine sur deux, bricolage lundi 12h-12h30 et mardi si le lundi est férié) ; tuile cliquable pour ouvrir le détail ; administration réorganisée sous `/admin` (sélecteur de commission, `/admin/<commission>`, éditeur de bibliothèque intégré, lien « Administration » dans le menu de gauche, anciennes pages et liens retirés) ; ajout d'employés et collection `users` supprimés.

**Données ajoutées en base le 12/11** (catalogue complet du 10/11, hors DVD/CD/BD/magazines/audio/PC, à la demande) : 285 jeux vidéo (dont 208 avec pochette), 94 jeux de société et grands jeux (41 avec image), 20 outils de bricolage (tous avec image), 1827 livres. Couvertures de livres : environ 1030 ajoutées ; il en reste environ 2400 sans. **Nouvelles couvertures mises de côté** à la demande de l'utilisateur.

**À reprendre demain : le formulaire unique de l'administration** (phase 2 de `docs/admin-unifiee.md`). Décisions arrêtées, à respecter :
1. L'envoi d'une couverture n'écrit plus en base au dépôt : appeler `CloudinaryService.upload`, mettre l'URL dans un champ `cover` du formulaire, l'écrire à « Enregistrer » (sinon fiche orpheline si on annule). Chemin d'envoi des jeux dérivé de la collection, pas de `libraryIdOfGame`.
2. Changement de référence ou de catégorie = **déplacement atomique** dans le dépôt (`move(original, updated)` sur `CatalogueRepository` et `GamesRepository` : un seul `updateDoc` avec le nouveau `FieldPath` et `deleteField()` sur l'ancien ; helper dans `services/firestore/document-paths.ts`). Aujourd'hui l'ancienne entrée reste et crée un doublon.
3. Une modification = `{...source, ...valeursDuFormulaire}` : les jeux portent des champs que le formulaire ne montre pas (`themes`, `libraryId`, `isNew`, nombres en chaînes issus de l'Excel). Retirer les `undefined`, ne pas transformer les nombres vides en `null`/`NaN`.
4. Une collection par boîte de dialogue, liste de champs portée par la collection (types : texte, zone de texte, nombre, liste, statut, case à cocher). Plus de bascule « Type de jeu ». Catégories avec libellés (`categoryLabel`). Unicité : référence de jeu sur les trois bibliothèques, identifiant d'objet dans la commission. `isNew` à `true` seulement à l'ajout d'un jeu. Aide BoardGameGeek conservée, déclarée par les seuls jeux de société ; l'appel OpenAI reste tel quel (échoue sans bruit). Statut ajouté aux jeux ; dimensions ajoutées aux objets de commissions qui en ont (`detailFields`).
5. Logique en fonctions pures avec tests (valeurs → fiche, fusion ou déplacement, unicité) ; erreurs précalculées en signaux, aucune fonction dans les gabarits.
6. **Tester les écritures sur les émulateurs, jamais sur la production** (`ng serve --configuration emulator`, utilisateur Auth avec un UID super-administrateur, sauvegardes de `ludotheque/*` et `commissions/*` rechargées dans l'émulateur) : ajout, modification, changement de référence, changement de catégorie, envoi puis annulation (aucune fiche orpheline), suppression avec confirmation partout (`ConfirmationModal`).
7. Puis : rebrancher `AdminCollections.add/edit`, supprimer `CatalogueItemDialog`, `AddGameModal`, `AddGameForm`, `UploadGame` (garder `bgg-game-search-modal`), build, tests, commit local.

**Autres reprises possibles** : trois décisions en attente pour l'administration (droits par commission ou rôle unique, redirection des anciennes adresses déjà faite, livres dans la liste globale) ; refonte des comptes administrateurs par section ; 2 livres à ranger à la main (Lenteric, Wood) et Simenon ; ISBN faux `9780662533313` sur 9 livres ; pochettes de jeux vidéo manquantes (57, listées dans la sortie de l'agent, non conservée) ; 53 jeux de société sans image.

## Mise à jour du 2026-11-13
**Formulaire unique de l'administration : fait** (commit local, pas encore déployé). Détails dans `docs/admin-unifiee.md`, section « Formulaire unique ». Reste de la conception : livres dans la liste globale (phase 3), actions groupées / export CSV / import du catalogue (phase 4), journal des modifications (phase 5), comptes administrateurs par section.


## Tests de bout en bout (Cypress), 2026-11-13
- `npm run e2e` : démarre les émulateurs Firestore + Auth (`firebase emulators:exec`), sert l'application en mode émulateur (port 4301), charge les données de test, lance `cypress run`. **Jamais contre la production.** Java portable requis si absent : `JAVA_HOME=<jre> PATH=$JAVA_HOME/bin:$PATH npm run e2e` (voir `docs/firestore-model.md`).
- Données de test : `cypress/fixtures/firestore/` (une fiche réduite par collection, un fichier `a__b__c.json` = document `a/b/c`, aucune donnée personnelle) ; `scripts/e2e/emulator-data.mjs` les charge et crée le compte administrateur de test (UID super-administrateur, `admin-test@example.com`). `cy.task('resetData')` remet les émulateurs dans cet état avant un test qui écrit.
- Commandes : `cy.loginAsAdmin()`, `cy.visitAsVisitor(url)` (la connexion Firebase reste dans IndexedDB, que Cypress ne remet pas à zéro : toute page « visiteur » doit passer par cette commande), `cy.stubCloudinary()` (aucun envoi réel).
- Particularités : Cypress 12 + TypeScript 6 → `cypress/tsconfig.json` propre (`ignoreDeprecations`) ; `cypress.config.mjs` ; `scrollBehavior: 'center'` (barre supérieure collante) ; délai de commande 10 s.
- Suite actuelle (67 tests, `npm run e2e`, environ 4 min avec le démarrage ; `E2E_SPEC="cypress/e2e/a.cy.ts,..." npm run e2e` pour quelques fichiers) : `smoke` (pages publiques, `/admin` fermé aux visiteurs), `admin-smoke` (connexion, lien du menu, liste, formulaire), `admin-form` (10 scénarios du formulaire unique : ajout, changement de référence ou de catégorie sans doublon, champs cachés conservés, doublon refusé, envoi d'image puis annulation sans fiche orpheline, image écrite à l'enregistrement, suppression confirmée, ancienne console, dimensions d'une remorque), `admin-list` (tri des colonnes), `admin-library` (éditeur de bibliothèque intégré, plus aucun lien d'administration sur les pages publiques), `public-games` (détail ouvert par la tuile, tri `ludo` décroissant, anciennes consoles), `a11y` (axe WCAG A/AA sur les pages publiques, le panneau de détail, `/admin`, les formulaires), `admin-bulk` (sélection, changement de statut groupé, suppression groupée, export CSV), `admin-books` (livres : ajout sous un auteur existant ou nouveau, déplacement de catégorie sans doublon, cote déjà utilisée acceptée, séries, couverture en nom de fichier, suppression, actions groupées), `search`, `mobile`. `cy.task('document', chemin)` relit un document de l'émulateur pour vérifier ce qui est réellement écrit ; `cy.checkA11y(sélecteur?)`, `cy.formField(libellé)`, `cy.fillField(libellé, texte)`, `cy.saveForm()`.
- À écrire : pages de détail des autres commissions, parcours public de la bibliothèque (séries, livres).
- Les anciens tests (`ludotheque.cy.ts`, `admin_ludo.cy.ts`) ciblaient d'anciens écrans : supprimés.
- **Firestore en long polling sous les émulateurs** (`app.config.ts`, uniquement quand `environment.emulators` est défini) : le proxy de Cypress retient les réponses en flux continu du transport par défaut, et les grosses lectures (la bibliothèque) ne se terminaient jamais. Sans effet sur la production.
- Trouvaille : le premier test d'administration a révélé que la page `/admin/<commission>` chargeait inutilement les 4 bibliothèques (des dizaines de lectures) et restait bloquée en « Chargement » au démarrage à froid ; elles ne sont plus chargées que pour la section Bibliothèque.

## Mise à jour du 2026-11-13 (suite)
Administration centralisée complétée : tri des colonnes, sélection multiple avec changement de statut et suppression groupés, export CSV, **livres dans la liste globale** (vue « Livres » par défaut, vue « Structure » pour l'arbre). Détails : `docs/admin-unifiee.md`. **Commité en local, pas encore déployé.** Reste : import du catalogue du logiciel de gestion (écran de réconciliation), journal des modifications, comptes administrateurs par section, recherche Google Books dans le formulaire d'un livre.

