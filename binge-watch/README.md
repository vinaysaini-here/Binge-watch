# BingeWatch

BingeWatch is a video streaming platform inspired by YouTube, but users submit external YouTube or Vimeo links instead of uploading raw video files.

The platform stores metadata only:

- source URL
- platform and external video ID
- title
- description
- tags
- thumbnail

## Features

- JWT register and login
- Creator profiles with avatar and bio
- External video submission, editing, and deletion
- Custom embedded player UI for YouTube and Vimeo
- Double tap seek and hold-for-2x mobile gestures
- Latest and trending homepage feeds
- Search and platform filters
- Like and comments system
- User dashboard with basic analytics
- Dedicated upload instruction page
- SEO metadata, robots, and sitemap

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Framer Motion
- Three.js with `@react-three/fiber`
- MongoDB native driver
- `jose` for JWT
- `bcryptjs` for password hashing

## Folder Structure

```text
app/
  api/
  dashboard/
  discover/
  login/
  profile/[username]/
  register/
  watch/[id]/
components/
  dashboard/
  feed/
  layout/
  player/
  providers/
  three/
  video/
lib/
  auth.js
  data.js
  db.js
  http.js
  session.js
  validators.js
  video-platforms.js
```

## Environment Variables

Create `.env.local`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/binge-watch
MONGODB_DB=binge-watch
JWT_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start MongoDB locally or use MongoDB Atlas.

3. Add the environment variables shown above.

4. Run the dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Deployment Guide

### Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, and `NEXT_PUBLIC_APP_URL`.
4. Set `NEXT_PUBLIC_APP_URL` to your production URL.
5. Deploy.

### MongoDB Atlas

1. Create a cluster.
2. Create a database user.
3. Add network access for your deployment.
4. Copy the connection string into `MONGODB_URI`.
5. Set `MONGODB_DB` to the database name you want BingeWatch to use.

## Notes

- Direct file uploads are intentionally not supported.
- The custom player stack is built for YouTube and Vimeo embeds.
- Thumbnails are auto-derived unless a custom thumbnail is provided.
- MongoDB indexes are created lazily on first use.
