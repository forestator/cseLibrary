# CseBiblio

Application web du CSE : catalogue de plusieurs « commissions » (ludothèque, bibliothèque, bricolage, sonothèque, nautisme, matériel photo). Front Angular + Firebase (Realtime Database, Auth, Storage, Hosting). Pas de backend propre.

## Commandes

```bash
npm install            # .npmrc active legacy-peer-deps
npm start              # ng serve -> http://localhost:4200
npm run build          # sortie dist/CseBiblio
npm test               # karma/jasmine (la plupart des spec sont des squelettes générés)
npm run cypress        # e2e : cypress/e2e/{ludotheque,admin_ludo}.cy.ts
npm run deploy         # firebase deploy (hosting, projet dans .firebaserc) – action sortante, ne pas lancer sans demande
```

## Stack réelle (état actuel, à moderniser)

- Angular **22.2**, TypeScript 6.0, RxJS 7.8, Angular Material/CDK 22, `@angular/fire` **22.0.0-rc** (prerelease : repasser en stable dès sa sortie). **Node ≥ 22.22.3 ou 24 requis** (`.nvmrc` = 24 ; `export PATH=$HOME/.nvm/versions/node/v24.21.0/bin:$PATH` si nvm n'est pas chargé). Alias `src/*` via `paths` dans `tsconfig.json` (plus de `baseUrl`).
- **NgModules** partout (`app.module.ts`, un module par commission + `admin`, `common`), composants marqués `standalone: false` par la migration v19, `*ngIf`/`*ngFor`, constructeurs pour l'injection, `@Input()` décorateurs, pas de signals (sauf `admin-home`, écrit en style moderne).
- `@angular/fire` **compat** (`AngularFireDatabase`, `AngularFireAuth`). Connexion : écran maison dans `admin-home` (email/mot de passe, Google, GitHub) via `AuthentificationService` ; `firebaseui`/`firebaseui-angular` ont été retirés (non maintenus, bloquaient Angular > 18). Pas de création de compte dans l'UI.
- `tsconfig` : `strict: false` (mais `strictTemplates: true`). Beaucoup de champs non initialisés et de `any`.
- Moment.js pour toutes les dates, **stockées en `string` au format `DD/MM/YYYY`**.
- Autres libs : openai 3 (`services/open-ai.service.ts`, descriptions de jeux), BGG XML (`ludotheque/services/bgg.service.ts`), Google Books, xml2js/xml-js/sax, jspdf + html2canvas.
- La Realtime Database du projet `cseh-50966` est **lisible publiquement** (règles à durcir, voir `docs/chantier.md`).
- Config Firebase en dur dans `app.module.ts` (clé web publique, pas un secret, mais à déplacer dans `environment`). `environment.ts` ne contient que `production`.
- Les UIDs admin sont codés en dur dans `services/firebase/authentification.service.ts` (super-admins + un admin par commission). Les routes admin sont protégées uniquement côté client par des `canActivate` ; la vraie sécurité dépend des règles Firebase (non versionnées ici).

## Conventions cibles (CLAUDE.md global de l'utilisateur)

Le code neuf doit suivre les règles globales (Angular 20+ standalone, signals, `input()`/`output()`, `inject()`, OnPush, control flow natif, 3 fichiers `.ts/.html/.css`, pas de fonction dans les templates, classes CSS sans `--`, AXE/WCAG AA, etc.). Le code existant ne les suit pas : **ne pas mélanger au hasard**, moderniser par périmètre (feature par feature) et la montée de version 16 → 22 est faite, il reste la modernisation du code (désormais tout est disponible : Angular 22). **Décision : uniquement du SCSS** (jamais de `.css` pour les composants, contrairement à la règle globale « 3 fichiers .ts/.html/.css » : ici `.ts` / `.html` / `.scss`). Les fichiers `.css` restants dans `angular.json` ne sont que des thèmes tiers (Material prebuilt, firebaseui).

## Vérifier l'application dans un navigateur

- MCP enregistrés au niveau utilisateur (toutes sessions, copiés de `~/.config/github-copilot/intellij/mcp.json`) : `chrome-devtools` (se connecte à ton Chrome ouvert), `chrome-devtools-headless` (Chrome sans fenêtre, autonome : à privilégier pour vérifier seul), `angular-cli` (`ng mcp`, à lancer depuis la racine du projet, Node 24), `mcp-atlassian`, `bitbucket`. Un redémarrage de session est nécessaire pour les voir dans les outils. Le serveur `webstorm` du fichier d'origine n'a pas été copié (port dynamique lié à l'IDE).
- Sans MCP : `ng serve` (Node 24, port 4200, peut déjà tourner) puis `google-chrome --headless=new --no-sandbox --disable-gpu --window-size=1280,900 --virtual-time-budget=15000 --screenshot=/chemin/out.png http://localhost:4200/` et lire l'image.

## Images / Storage

Firebase Storage n'est plus utilisé (payant). Les couvertures sont sur **Cloudinary** (cloud `seo9axkp`, preset non signé `cse_unsigned`, voir `environment*.ts` et `services/cloudinary.service.ts`). Les uploads non signés ne peuvent pas écraser : `StorageUploadService` ajoute un timestamp au `public_id`. Les couvertures de livres sont résolues par les pipes `bookCover` / `categoryBackground` (URL déterministe `assets/books/...`). Outil de migration : `scripts/migrate-storage/migrate.mjs`.

**État du chantier, reste à faire et priorités : `docs/chantier.md` (à lire en début de session).**

## Architecture (`src/app`)

| Dossier | Rôle |
|---|---|
| `ludotheque/` | Jeux de société (`board-games`), jeux vidéo (`video-games`, consoles/accessoires), grands jeux (`outside-games`), nouveautés, recherche. Filtres via pipes + `filter-board-games.service.ts`. |
| `bibliotheque/` | Livres : bibliothèques (Imaginaire, Inclassable…), catégories, séries, auteurs, éditeurs, modales CRUD, settings. `biblio-database.service.ts`. |
| `bricolage/`, `sonotheque/`, `nautisme/`, `photo/` | Une feature = module + `components/` + `models/` + `services/*-database.service.ts`. Structure quasi identique : **forte duplication** à factoriser. |
| `admin/` | Écrans d'admin par commission (`admin-ludo`, `admin-bricolage`, `admin-sonotheque`, `admin-nautisme`), `add-employee-dialog`, `confirmation-modal`. |
| `common/` | `AppCommonModule`, home, badge, upload-form, pipes partagés. |
| `models/` | Modèles transverses : `common.model.ts` (`Game`, `Comissions`, `LudoStatus`), `boardGame`, `videoGames`, `author` (livres), `users`, `gamesUtils.ts` (gros fichier utilitaire ludo, dont les règles d'ouverture de la ludo). |
| `services/` | `firebase/` (auth, database ludo, storage, users), `biblio/` (données/xml/google books), `navigation`, `open-ai`. |

Routing : `app-routing.module.ts`, routes eager (pas de lazy loading), regroupées par commission. Routes admin (`.../admin/...`) gardées par `AuthentificationService.isUser*Admin$` . `bindToComponentInputs: true` est activé (les `@Input` reçoivent route params et resolvers). La navigation latérale est calculée dans `app.component.ts` à partir de l'URL.

## Modèle de données Firebase (Realtime Database)

```
ludotheque/{boardGames|videoGames|outsideGames}/{games/{ref}, library}
bibliotheque/...                 (Biblio[])
bricolage/{tools/{categoryId}, library}
sonotheque/{items/{categoryId}, library}
nautisme/{items, library}
photo/{items/{categoryId}, library}
users/{userId}                   (CseUser)
borrows/                         (obsolète, plus utilisé par le code)
```

Les archives JSON de la base sont dans `archivesBdd/` (très volumineuses, ne pas les lire en entier ; `oldJson/` = imports historiques).

## Emprunts (supprimés)

Toute l'ancienne gestion des emprunts (`borrows/{userId}`, `BorrowDataService`, `admin/components/emprunts`, pipes et badges de statut d'emprunt dans les lignes de la ludothèque, colonnes statut/stats de `ludo-table`) a été retirée. Le nœud Firebase `borrows` n'est plus lu ni écrit. `ConfirmationModal` a été conservée (`admin/components/confirmation-modal`) car utilisée par les modales d'ajout bricolage/sono/nautisme. Une future refonte repartira de zéro : ne pas réintroduire l'ancien schéma (copie de l'objet dans l'emprunt, tableau indexé, dates `DD/MM/YYYY` persistées, statut LATE écrit en base).

## Pièges et notes

- Les noms d'admin existants mélangent français/anglais et fautes (`Comissions`, `Emprunter`, `Empruter`) : conserver les valeurs de l'enum `Comissions` (utilisées comme segments d'URL et chemins Firebase).
- Indentation : 4 espaces dans les fichiers récents (routing, auth), 2 dans les anciens ; suivre `.editorconfig`.
- `.vs/`, `.firebase/`, `.idea/` sont versionnés/présents : bruit, ne pas modifier.
- Cypress existe mais couvre uniquement ludothèque / admin ludo.
- Aucune CI dans le dépôt.
