 📄 Spécifications Fonctionnelles Frontend - TrOps

## 1. Vision Interface Utilisateur (UX/UI)
L'interface de TrOps doit répondre à un impératif de **simplicité absolue**. Les utilisateurs cibles (patrons de PME, exploitants) ont souvent peu de temps et préfèrent des interfaces épurées rappelant la structure de leurs anciens tableaux Excel, mais avec l'ergonomie d'une application moderne.

## 2. Modules et Fonctionnalités Frontend

### 2.1 Authentification & Accès (Module Auth)
* **Écran de Connexion :** Formulaire simple (email/mot de passe).
* **Gestion du Token :** Stockage sécurisé du JWT. Redirection automatique vers `/login` si le token expire.
* **Persistance :** Re-connexion automatique via le token stocké au rafraîchissement de la page.
* **Profil :** Affichage du nom de l'utilisateur et de son entreprise dans le header.

### 2.2 Gestion des Missions (Module Mission)
* **Tableau de Bord des Missions :** Liste filtrable des missions en cours et passées.
* **Formulaire de Création :**
    * Sélection du véhicule via un menu déroulant (uniquement véhicules disponibles).
    * Sélection du client.
    * Saisie des montants (Revenus/Coûts).
    * **Feedback en temps réel :** Affichage du profit calculé avant soumission (optionnel, basé sur la logique backend).
* **Détails :** Vue détaillée d'une mission avec récapitulatif financier.

### 2.3 Parc Automobile (Module Fleet)
* **Inventaire :** Liste des véhicules avec indicateur visuel de statut (Disponible / En Maintenance).
* **Fiche Véhicule :** Historique des missions liées et documents associés.

### 2.4 Gestion Clients (Module Client)
* **Annuaire :** Liste des clients avec leurs coordonnées de base.
* **Statistiques :** Visualisation rapide du volume d'affaires par client.

### 2.5 Tableau de Bord (Dashboard)
* **KPIs Financiers :** Cartes affichant le CA total, Coûts totaux et Profit Net (Données agrégées du Backend).
* **Graphiques :** Visualisation de la rentabilité mensuelle (via une librairie type Chart.js ou Recharts).

---

## 3. Flux de Données (Data Flow)
1.  Le frontend envoie une requête avec le Header `Authorization: Bearer <token>`.
2.  L'API Backend filtre les données en fonction du `companyId` contenu dans le token.
3.  Le frontend reçoit uniquement les données appartenant à l'entreprise de l'utilisateur.