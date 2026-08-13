# Suivi des temps

Application web simple permettant à un utilisateur de se connecter et d'enregistrer le temps passé sur différents projets et phases, semaine par semaine.

## Fonctionnement général

1. **Connexion** (`index.html`) : l'utilisateur entre un identifiant et un mot de passe. Les comptes sont codés en dur dans `js/login.js`.
2. Une fois connecté, il arrive sur le **tableau de bord** (`Principal.html`) où il peut :
   - choisir une semaine, un projet, une phase, et saisir un nombre d'heures, puis cliquer sur "Enregistrer l'activité" ;
   - consulter la liste de toutes les activités déjà saisies, avec le total d'heures ;
   - **rechercher** une activité en tapant le nom d'un projet dans le champ de recherche : le tableau se filtre automatiquement ;
   - **exporter** ses activités dans un fichier Excel (.xlsx) via le bouton d'export ;
   - supprimer une activité ;
   - se déconnecter.

Chaque utilisateur ne voit que ses propres activités : les données sont stockées séparément pour chaque compte.

## Comptes de démonstration

| Identifiant | Mot de passe |
|---|---|
| PaulB |eclipse |
| MarcW | eclipse|

## Projets et phases (codés en dur)

- **Projet Paris** : Analyse, Développement, Tests, Réunion
- **Projet Sartrouville** : Conception, Développement, Tests, Documentation
- **Projet 1001VH** : Maintenance, Correction, Support

Ces listes sont modifiables dans `js/app.js` (objet `projects`).

## Stockage des données

Il n'y a pas de base de données ni de serveur : l'application est 100% statique et tourne entièrement dans le navigateur. Les activités saisies sont sauvegardées dans le `localStorage` du navigateur, séparément pour chaque utilisateur (`activities_PaulB`, `activities_MarcW`, etc.).

⚠️ Les données restent propres à chaque navigateur/ordinateur : elles ne sont pas partagées entre plusieurs appareils. L'export Excel permet de conserver ou transférer une copie des données saisies.

## Structure du projet

```
├── index.html          → page de connexion
├── Principal.html       → tableau de bord (saisie + consultation)
├── css/
│   └── design.css       → mise en forme du site
└── js/
    ├── login.js          → vérification des identifiants
    └── app.js            → logique du tableau de bord (saisie, recherche, export, suppression)
```

## Technologies utilisées

- HTML5 / CSS3
- JavaScript (aucun framework)
- [SheetJS (xlsx)](https://sheetjs.com/) pour l'export Excel
- Hébergement : GitHub Pages

## Accès en ligne

- URL : *[SiteWeb](https://arthur-soh.github.io/Suivi_de_temps/)*
- Temps passé sur le développement : *4h (1h de pause pour admirer l'éclipse et me reposer)*
