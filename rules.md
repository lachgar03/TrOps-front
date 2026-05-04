# 📝 rules.md - Directives de Développement React (TrOps)

Ce document définit les standards de développement pour le Frontend React de TrOps afin de garantir un code maintenable, performant et cohérent.

## 1. Architecture des Dossiers (Feature-Based)
Nous utilisons une approche par "Features" similaire au Backend :
* `src/features/[feature-name]` : Contient tout ce qui est spécifique à un métier (ex: `mission`).
    * `components/` : Composants UI spécifiques à la feature.
    * `services/` : Appels API (Axios).
    * `hooks/` : Logique métier réutilisable (Custom Hooks).
    * `store/` : État local à la feature (Zustand).
* `src/common/` : Composants génériques et réutilisables (Button, Input, Card).

## 2. Standards de Code (React & JS)
* **Composants Fonctionnels :** Utilisez exclusivement des composants fonctionnels avec des Hooks. Pas de classes.
* **Props immuables :** Ne jamais modifier directement une prop.
* **Destructuring :** Utilisez le destructuring pour les props et les objets (ex: `const { name, id } = user;`).
* **Naming :** * Composants : `PascalCase.tsx`
    * Fonctions et variables : `camelCase`
    * Services API : `nomMetierApi.ts`

## 3. Gestion de l'État (Zustand)
* Utilisez **Zustand** pour l'état global (Auth, Paramètres utilisateur).
* Pour l'état local d'un formulaire ou d'un composant simple, utilisez `useState`.
* Évitez de passer des props sur plus de 2 niveaux ("Prop Drilling"). Si c'est le cas, utilisez Zustand ou un Contexte.

## 4. Appels API & Sécurité (Axios)
* **Instance Axios :** Créez une instance centrale dans `src/config/axios.ts`.
* **Intercepteurs :** Configurez un intercepteur pour injecter automatiquement le token JWT du `localStorage` dans chaque requête.
* **Gestion d'erreur :** Centralisez la gestion des erreurs 401 (Unauthorized) pour déconnecter l'utilisateur automatiquement.

## 5. Styling (Tailwind CSS v4)
* **Utility-First :** Utilisez les classes Tailwind directement dans le JSX. Évitez les fichiers CSS personnalisés.
* **Design System :** Utilisez les couleurs et espacements standards de Tailwind pour garantir la cohérence.
* **Responsive :** L'application doit être consultable sur tablette et mobile (préfixes `md:`, `lg:`).

## 6. Formulaires & Validation
* Validez les données côté client avant l'envoi (vérification des champs obligatoires, types de nombres).
* Affichez des messages d'erreur clairs en rouge sous les champs invalides.
* Désactivez le bouton "Envoyer" pendant que la requête est en cours (loading state).