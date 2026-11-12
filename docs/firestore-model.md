# Modèle Firestore (migration depuis la Realtime Database)

Principe : Firestore facture les lectures **par document**. Le catalogue est donc stocké en gros documents (un par « nœud RTDB » lu d'un coup par l'app), tous bien sous la limite de 1 MiB (le plus gros fait ~355 Ko). Une page = quelques lectures, comme avec la RTDB.

```
ludotheque/{boardGames|videoGames|outsideGames}   { library: {...}, games: { [ref]: game } }
commissions/{bricolage|sonotheque|nautisme|photo} nœud RTDB tel quel : { library, tools|items }
bibliotheque/{libraryId}                          { library: {...meta, categoryIds[]}, authors: [], publishers: [] }
bibliotheque/{libraryId}/categories/{categoryId}  catégorie complète (séries et livres, ou auteurs)
users/{userId}                                    annuaire des employés de l'ancien système de réservation (plus utilisé par l'app ; à supprimer avec la refonte des réservations)
```

`libraryId` = `litterature-imaginaire`, `inclassable`, `litterature-jeunesse`, `litterature-adulte` (ordre du tableau RTDB `bibliotheque`).
Non migrés : `borrows` (emprunts supprimés), `bibliotheque2` (refonte inachevée, non utilisée par le code).

## Outils
- `firestore.rules` : lecture publique du catalogue, écriture réservée aux admins (mêmes UIDs que `authentification.service.ts`), `users` réservé aux super-admins. À garder synchronisé.
- `scripts/firestore/import.mjs` : importe un export RTDB (`--dry-run` pour contrôler). Réécrit au passage les URLs Firebase Storage vers Cloudinary. Refuse d'écrire en production sans `--prod`.
- Émulateur local (pas de Java sur la machine : JRE portable) :
  `JAVA_HOME=<jre> npx firebase-tools emulators:start --only firestore,auth --project cseh-50966`, puis
  `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/firestore/import.mjs --export db.json --project cseh-50966 --database "(default)"`.

## Production
Le 2026-11-10, retour au **forfait gratuit (Spark)** : le quota gratuit de Firestore ne couvre que la base `(default)`, alors qu'une base nommée exige la facturation. La base `(default)` d'origine (mode Datastore, europe-west6, inutilisée) a été supprimée puis recréée en **Firestore natif, europe-west1** ; les 313 documents ont été copiés depuis `cse-db` (export REST, document par document) ; l'app utilise `firestoreDatabaseId: '(default)'`.
- Règles : `npx firebase-tools deploy --only firestore` (cible `(default)` dans `firebase.json`).
- Import depuis un export RTDB : `scripts/firestore/import.mjs --prod --database "(default)"` avec `GOOGLE_ACCESS_TOKEN` (jeton OAuth d'un propriétaire du projet).
- L'ancienne base nommée `cse-db` existe encore (copie de secours, inutile) : la supprimer une fois le forfait gratuit confirmé (`firebase firestore:databases:delete cse-db`).
