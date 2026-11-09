# CseBiblio

Application web du CSE : catalogue de plusieurs « commissions » (ludothèque, bibliothèque, bricolage, sonothèque, nautisme, matériel photo). Front Angular + Firebase (Firestore, Auth, Hosting) + Cloudinary pour les images. Pas de backend propre. **État du chantier, reste à faire et priorités : `docs/chantier.md` (à lire en début de session).**

## Commandes

```bash
export PATH=$HOME/.nvm/versions/node/v24.21.0/bin:$PATH   # Node >= 22.22.3 ou 24 requis (.nvmrc = 24) ; `nvm use` ne marche pas toujours en session
npm install            # .npmrc active legacy-peer-deps
npm start              # ng serve -> http://localhost:4200 (base Firestore de production, lecture publique)
npx ng serve --configuration emulator   # contre les émulateurs Firestore + Auth (voir docs/firestore-model.md)
npm run build          # sortie dist/CseBiblio
npx ng test --watch=false --browsers=ChromeHeadlessCI   # CHROME_BIN=/usr/bin/google-chrome ; 21 tests
npm run deploy         # firebase deploy – action sortante, ne pas lancer sans demande
```

## Stack

- Angular **22.2**, TypeScript 6, RxJS 7.8, Angular Material/CDK 22, `@angular/fire` **22.0.0-rc** (prerelease : repasser en stable dès sa sortie), firebase 12. Alias `src/*` via `paths` (plus de `baseUrl`).
- **100 % standalone** : plus aucun NgModule. Démarrage dans `main.ts` + `app/app.config.ts` ; routes **lazy** dans `app/app.routes.ts` (celles des 4 commissions simples sont générées depuis les configs).
- Modèle de code : composants OnPush, signals (`signal`, `computed`, `input()`, `output()`, `toSignal`), `inject()`, `@if/@for`, 3 fichiers `.ts/.html/.scss`.
- `tsconfig` : `strict: false` (mais `strictTemplates: true`), `skipLibCheck`.
- Moment.js pour les dates (`DD/MM/YYYY` en string), jspdf + html2canvas (export PDF, chargés à la demande), Google Books, BGG XML (`ludotheque/services/bgg.service.ts`), openai 3 (`services/open-ai.service.ts`, clé vide dans `environment`, modèle retiré : à repenser).
- Config Firebase publique dans `environments/environment*.ts` (+ `environment.emulator.ts`). Les UIDs admin sont dans `services/firebase/authentification.service.ts` **et** dans `firestore.rules` : garder les deux synchronisés.

## Design (refonte de novembre 2026)

Système de design Material 3 : `src/styles/_tokens.scss` (variables SCSS d'espacement, rayons, couleurs via `--mat-sys-*`, mixins `mobile`/`desktop`), `_base.scss` (accent par commission via `[data-commission]` : `--accent`, `--accent-text`, `--accent-soft`, `--accent-strong` pour les fonds pleins à texte blanc), `styles.scss` (`mat.theme` violet/orange, clair + sombre via `color-scheme`, bouton de thème dans la barre latérale : `ThemeService`). Coque `app.component.*` : barre latérale (commissions + rubriques contextuelles + filtres jeux de société) / tiroir sur mobile, barre supérieure collante avec la recherche de la commission. Navigation déclarée dans `navigation/navigation.config.ts`. Pages en cartes (`game-card`, `catalogue-item-card`, accueil), disclosure « Détails », états de chargement en squelettes. Toujours utiliser les tokens (jamais de couleurs en dur) pour que clair et sombre fonctionnent ; les dialogues sont dans l'overlay CDK, hors `[data-commission]` (couleur Material primaire).

## Conventions

Règles globales de l'utilisateur (voir son CLAUDE.md) : standalone sans `standalone: true`, signals, pas de fonction dans les templates, classes SCSS sans `--`, AXE/WCAG AA, pas de `@HostBinding`. **Décision : uniquement du SCSS** (jamais de `.css` pour les composants). Les valeurs de l'enum `Comissions`, des catégories (`BricoCategories`, `SonoCategory`, `PhotoCategory`, `BoardGameCategory`, `Consoles`, `Libraries`), les URLs et les chemins de données sont des contrats : ne pas les changer.

## Architecture (`src/app`)

| Dossier | Rôle |
|---|---|
| `catalogue/` | Fonctionnalité **générique** des 4 commissions simples (bricolage, sonothèque, nautisme, photo) : configs (`models/commission-configs.ts`), `CatalogueRepository` (+ `catalogue-mapper.ts` pur), pages home/category, ligne, menu. Une commission = une config. |
| `ludotheque/` | Jeux de société, vidéo, grands jeux. `services/games.repository.ts` = seul accès aux données ; `GameCategoryPageComponent` / `game-row` génériques ; filtres via `FilterBoardGamesService`. |
| `bibliotheque/` | Livres. `services/library.repository.ts` (lecture seule, signal), modales génériques (`modals/form-dialog`), arbre de réglages générique (`settings-view/settings-panel`), helpers purs dans `models/`. Les réglages éditent une copie en mémoire (pas de persistance, comme avant). |
| `admin/` | `catalogue-admin/` (admin générique des commissions simples), `admin-ludo/`, `admin-home` (connexion maison : email, Google, GitHub), `admin-menu`, `add-employee-dialog`, `confirmation-modal`. |
| `common/` | home, badge, upload-form, pipes partagés. |
| `models/`, `services/` | Modèles transverses ; `services/firebase/` (auth, user, storage-upload), `services/firestore/document-paths.ts` (helpers de chemins dans les documents), `cloudinary.service.ts`, `navigation.service.ts`. |

## Données : Firestore (base nommée `cse-db`, europe-west1, projet `cseh-50966`)

Modèle, règles, import et émulateur : **`docs/firestore-model.md`**. En bref : documents « gros » lus d'un coup (`ludotheque/{boardGames|videoGames|outsideGames}`, `commissions/{bricolage|sonotheque|nautisme|photo}`, `bibliotheque/{libraryId}` + sous-collection `categories`), `users/{id}` réservé aux super-admins. Toute lecture/écriture passe par un dépôt (`GamesRepository`, `CatalogueRepository`, `LibraryRepository`, `UserService`) : ne pas appeler Firestore depuis un composant. La Realtime Database (`cseh-50966-default-rtdb`) n'est plus utilisée par le code mais **reste lisible publiquement** (à verrouiller après la bascule en production, voir `docs/chantier.md`). La base `(default)` du projet est en mode Datastore (inutilisable).

## Images

Pas de Firebase Storage (payant). Couvertures sur **Cloudinary** (cloud `seo9axkp`, preset non signé `cse_unsigned`) via `CloudinaryService` / `StorageUploadService` ; les envois non signés ne peuvent pas écraser, d'où un timestamp dans le `public_id`. Couvertures de livres : pipes `bookCover` / `categoryBackground` (URL déterministe `assets/books/...`). Outils de migration : `scripts/migrate-storage/migrate.mjs`.

## Vérifier dans un navigateur

- MCP utilisateur (toutes sessions) : `chrome-devtools` (ton Chrome ouvert), `chrome-devtools-headless` (autonome), `angular-cli`, `mcp-atlassian`, `bitbucket`. Disponibles après redémarrage de session.
- Sans MCP : serveur de test + Chrome headless avec `puppeteer-core` (chemin `/usr/bin/google-chrome`, `--no-sandbox`). Le test d'écriture admin tourne contre les émulateurs (`--configuration emulator`) avec un utilisateur Auth créé avec un UID super-admin (`accounts:batchCreate` de l'émulateur Auth). Java portable dans le dossier de session si absent de la machine (Temurin JRE 21).

## Pièges

- Les emprunts ont été supprimés (ne pas réintroduire l'ancien schéma : copie de l'objet, tableau indexé, dates persistées, statut LATE en base).
- `bibliotheque2` (RTDB) : refonte inachevée, non migrée.
- Clé OpenAI compromise dans l'historique de l'ancien dépôt : à révoquer.
- `.vs/`, `.firebase/`, `.idea/` sont versionnés : bruit, ne pas modifier. Pas de CI. Cypress couvre seulement ludothèque / admin ludo (obsolète).
