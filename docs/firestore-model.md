# Modèle Firestore (migration depuis la Realtime Database)

Principe : Firestore facture les lectures **par document**. Le catalogue est donc stocké en gros documents (un par « nœud RTDB » lu d'un coup par l'app), tous bien sous la limite de 1 MiB (le plus gros fait ~355 Ko). Une page = quelques lectures, comme avec la RTDB.

```
ludotheque/{boardGames|videoGames|outsideGames}   { library: {...}, games: { [ref]: game } }
commissions/{bricolage|sonotheque|nautisme|photo} nœud RTDB tel quel : { library, tools|items }
bibliotheque/{libraryId}                          { library: {...meta, categoryIds[]}, authors: [], publishers: [] }
bibliotheque/{libraryId}/categories/{categoryId}  catégorie complète (séries et livres, ou auteurs)
users/{userId}                                    annuaire des employés (lecture/écriture super-admin uniquement)
```

`libraryId` = `litterature-imaginaire`, `inclassable`, `litterature-jeunesse`, `litterature-adulte` (ordre du tableau RTDB `bibliotheque`).
Non migrés : `borrows` (emprunts supprimés), `bibliotheque2` (refonte inachevée, non utilisée par le code).

## Outils
- `firestore.rules` : lecture publique du catalogue, écriture réservée aux admins (mêmes UIDs que `authentification.service.ts`), `users` réservé aux super-admins. À garder synchronisé.
- `scripts/firestore/import.mjs` : importe un export RTDB (`--dry-run` pour contrôler). Réécrit au passage les URLs Firebase Storage vers Cloudinary. Refuse d'écrire en production sans `--prod`.
- Émulateur local (pas de Java sur la machine : JRE portable) :
  `JAVA_HOME=<jre> npx firebase-tools emulators:start --only firestore,auth --project cseh-50966`, puis
  `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/firestore/import.mjs --export db.json --project cseh-50966 --database cse-db`.

## Production (fait le 2026-11-09)
La base `(default)` de `cseh-50966` est en mode Datastore (incompatible avec Firestore natif), donc l'app utilise la base nommée **`cse-db`** (Firestore natif, **europe-west1**), créée avec le CLI. Règles déployées, 313 documents importés depuis un export frais de la RTDB. `firebase.json` cible cette base. Procédure pour refaire l'import :
1. (fait) Créer la base : `npx firebase-tools firestore:databases:create cse-db --location europe-west1 --project cseh-50966`.
2. `npx firebase-tools deploy --only firestore:rules`.
3. Réexporter la RTDB juste avant (`curl https://cseh-50966-default-rtdb.europe-west1.firebasedatabase.app/.json`), puis importer avec `--prod --database cse-db` et `GOOGLE_ACCESS_TOKEN` (jeton OAuth d'un propriétaire du projet, par exemple celui du CLI Firebase). L'import écrase les documents existants.
4. Basculer l'app, vérifier, puis verrouiller les règles de la RTDB.
