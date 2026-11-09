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

## En cours : bascule de la base Firebase (à faire par le propriétaire du projet)
`scripts/migrate-storage/updates.json` (ignoré par git, régénérable) contient 265 champs de la base qui pointent encore vers Firebase Storage. Pour l'appliquer :
1. Exporter la base (console Realtime Database → Export JSON) ; `node scripts/migrate-storage/migrate.mjs rewrite-db --cloud seo9axkp --db <export.json>` régénère `updates.json`.
2. `npx firebase-tools database:update / scripts/migrate-storage/updates.json --project cseh-50966` (multi-path update, n'écrase pas le reste).
3. Vérifier dans l'app, puis (seulement alors) envisager de repasser le projet en Spark et de supprimer le bucket.
Tant que l'étape 2 n'est pas faite, les couvertures de jeux/outils/sono/nautisme/photo de la base pointent vers l'ancien Storage (cassé si le projet repasse en Spark). Les couvertures de livres sont déjà servies par Cloudinary via les pipes.

## À faire (priorité décroissante)
1. **Sécurité** : la Realtime Database est lisible sans connexion (dont `users`, 280 employés). Restreindre les règles (lecture authentifiée, écriture réservée aux admins) ; les règles ne sont pas versionnées dans ce repo : ajouter `database.rules.json` + `firebase.json`.
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

## Plan de modernisation décidé le 2026-11-09 (ordre recommandé)
1. **Outillage de vérification navigateur** : fait (MCP utilisateur + headless Chrome, voir `CLAUDE.md`).
2. **Bonnes pratiques Angular + suppression des doublons**, en commençant par une couche d'accès aux données générique (un « repository » par commission au lieu de 6 services quasi identiques) et des composants de liste/ligne/admin génériques pour bricolage / sono / nautisme / photo. Standalone, signals (`toSignal` sur les flux Firebase), `input()`/`output()`, `@if`/`@for`, `inject()`, OnPush, SCSS.
3. **Migration Realtime Database → Firestore** (demandée le 2026-11-09), à faire *derrière* la couche repository de l'étape 2 pour ne toucher qu'un endroit. Points à trancher avant de commencer :
   - Facturation Firestore : lectures facturées **par document** (quota gratuit, à vérifier : ~50 000 lectures/jour). Un catalogue d'environ 1 200 objets rechargé à chaque visite consommerait vite ce quota. Pistes : cache persistant du SDK, ou documents « paquets » par bibliothèque/catégorie plutôt qu'un document par objet.
   - Les règles de sécurité Firestore sont plus fines que celles de la RTDB (à écrire dès le départ, version contrôlée dans le repo, lecture publique du catalogue seulement, `users` restreint).
   - Données : script d'import depuis l'export RTDB (sauvegarde du 2026-11-08 faite), ré-identification des chemins (tableaux RTDB → collections), double lecture le temps de la bascule.
   - `@angular/fire` : passer de l'API `compat` à l'API modulaire (`@angular/fire/firestore`, `@angular/fire/auth`).
   - Le gain doit être confirmé avant d'investir : la RTDB reste utilisable ; objectifs attendus (requêtes/filtrage serveur, règles fines, modèle de données propre) à valider.
4. **Refonte de l'affichage et de la navigation** (design moderne, thème clair/sombre, mobile d'abord, accessibilité AA) : proposition de direction à valider avant d'implémenter.
