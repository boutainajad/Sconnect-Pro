# SportConnect Pro

Plateforme de gestion sportive & associative pour une Direction municipale des sports.
Prototype full stack **Node.js natif + PostgreSQL**, sans framework monolithique (pas d'Express, pas d'ORM).

---

## 1. Objectif

Gérer l'écosystème sportif local :
- Infrastructures municipales (gymnases, bassins, dojos)
- Associations partenaires
- Catalogue d'activités et créneaux d'entraînement
- Adhérents et foyers fiscaux
- Inscriptions avec tarification complexe et file d'attente

---

## 2. Stack technique

| Rôle | Outil |
|---|---|
| Serveur HTTP | `node:http` (natif) |
| Routeur | `find-my-way` (ou routeur custom) |
| Parseur POST | `body-parser` (ou streams natifs) |
| Fichiers statiques | `serve-static` + `finalhandler` |
| Templates | `ejs` (`ejs.renderFile`) |
| Base de données | `pg` (driver natif PostgreSQL) |
| Config | `dotenv` |

> ⚠️ Interdiction formelle : Express, Koa, Fastify, NestJS, Prisma, Sequelize…

---

## 3. Prérequis

- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm

---

## 4. Installation

```bash
git clone https://github.com/<user>/sportconnect-pro.git
cd sportconnect-pro
npm install