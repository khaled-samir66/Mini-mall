# Mini Mall — Free deployment

This version uses PostgreSQL and is intended for a free deployment with GitHub + Render + a free PostgreSQL provider such as Neon.

## Environment variables
- DATABASE_URL
- SESSION_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD

## Database
Run `db.sql` once in your PostgreSQL database.

## Build
`npm install` then `npm run build`

## Start
`npm start`

Do not commit real passwords or DATABASE_URL to GitHub.
