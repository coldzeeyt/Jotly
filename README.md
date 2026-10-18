# Jotly

All your notes. One place.

A responsive notes app with email/password accounts, text notes, photos, videos, voice recording, audio uploads, checklists, folders, tags, pinned notes, reminders on a calendar, search, archive, trash, JSON export, and a three-step tutorial. Free mode provides a draggable canvas with saved card positions, zoom controls, and keyboard movement. Includes animated interactions, reduced-motion support, light/dark themes, and the original Jotly logos.

## Stack

Next.js App Router, React, TypeScript, SQLite (Node's built-in `node:sqlite`), and file storage on a Railway persistent volume. Passwords use salted scrypt hashes. Sessions use random opaque tokens hashed in the database and HTTP-only, SameSite cookies. Every note and media operation is authorized against the signed-in account. Media supports byte ranges for playback. Authentication and uploads are rate limited.

## Local development

Requires Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Open the printed local URL. Every workspace starts empty. Text, audio, photos, video, and checklists are called Mediums. Preview changes are temporary; sign up to save notes. Real data is stored in `.data/`, which is ignored by Git.

```sh
npm run typecheck
npm run build
npm start
# Against a running local server (creates disposable test accounts):
npm test
```

## Railway deployment

Deploy this repository using the included Dockerfile and `railway.json`. Attach a persistent volume at `/data`. Set `DATA_DIR=/data`, `PORT=3000`, and `NODE_ENV=production`. Generate an HTTPS service domain targeting port 3000. Healthcheck: `/api/health`.

Use one service replica: SQLite and uploaded files live on this volume. Back up the volume using Railway's backup tools. The database initializes its schema on first use. No external auth or cloud-storage keys are required.

## Mobile

Open the Railway HTTPS URL on iPhone or Android. The layout adapts to phones with touch-friendly cards, bottom navigation, and a floating add button. Microphone recording requires HTTPS and permission from the browser; audio file uploads are also supported. The app includes a web app manifest for adding it to a home screen.

## Assets

- `public/logo-light.png`: user's transparent black/yellow logo.
- `public/logo-dark.png`: user's transparent white/yellow logo.
- Both assets ship with the app and are served by Railway.
- User uploads are private and stored on the Railway volume.

## Current scope

This first version uses email/password accounts without email verification, password recovery email, or social sign-in. Reminders organize notes by date in the calendar; they do not send notifications. Export includes note content and attachment references, not media file bytes. File uploads are limited to 25 MB each.

