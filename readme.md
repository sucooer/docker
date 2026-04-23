# Afilmory Docker Deployment

<p align="center">
  🌐
  <a href="readme.md">English</a>
  ·
  <a href="readme.zh-CN.md">简体中文</a>
</p>

A Docker-based deployment setup for [Afilmory](https://github.com/Afilmory/Afilmory) with PostgreSQL and object storage support.

## Quick Start

### Requirements

- Docker
- Docker Compose
- An S3-compatible object storage bucket
- A GitHub repository used by `githubRepoSyncPlugin`

### Files

- `Dockerfile`: builds the Afilmory app image
- `docker-compose.yml`: starts both `afilmory` and `postgres`
- `.env.example`: deployment template
- `.gitignore`: ignores local secrets and build artifacts

### 1. Create Your Local `.env`

```bash
cp .env.example .env
```

Then fill in your real values in `.env`.

Important fields:

```env
S3_BUCKET=your-bucket
S3_ENDPOINT=https://your-s3-endpoint
S3_REGION=auto
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_PREFIX=wallpaper/
S3_CUSTOM_DOMAIN=https://your-public-image-domain

POSTGRES_DB=afilmory
POSTGRES_USER=afilmory
POSTGRES_PASSWORD=your-strong-password
PG_CONNECTION_STRING=postgresql://afilmory:your-strong-password@postgres:5432/afilmory

GITHUB_REPO_URL=https://github.com/your-name/your-gallery-cache-repo
GITHUB_REPO_BRANCH=main
GIT_TOKEN=your-github-token
```

Notes:

- `S3_CUSTOM_DOMAIN` should be a full URL such as `https://cdn.example.com`
- `PG_CONNECTION_STRING` must stay aligned with `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD`
- `.env` is ignored by git; keep secrets there and keep `.env.example` as the template

### 2. Update Site Metadata

Edit `config.json` with your site information.

Example:

```json
{
  "name": "Your Photo Gallery",
  "title": "Your Photo Gallery",
  "description": "Capturing beautiful moments in life",
  "url": "https://your-site.com",
  "accentColor": "#fb7185",
  "author": {
    "name": "Your Name",
    "url": "https://your-site.com",
    "avatar": "https://your-site.com/avatar.png"
  },
  "social": {
    "twitter": "@yourusername"
  },
  "extra": {
    "accessRepo": true
  }
}
```

### 3. Review Builder Configuration

`builder.config.ts` already reads deployment values from `.env`.

It expects:

- `GITHUB_REPO_URL`
- `GITHUB_REPO_BRANCH`
- `GIT_TOKEN`
- `S3_BUCKET`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_PREFIX`
- `S3_CUSTOM_DOMAIN`

### 4. Start the Stack

```bash
docker compose up -d --build
```

This starts:

- `postgres`: PostgreSQL 16
- `afilmory`: the built Afilmory app

Default app URL:

```txt
http://localhost:3020
```

### 5. Rebuild After Storage or Config Changes

If you change:

- `.env`
- `config.json`
- `builder.config.ts`
- photos in your S3 bucket

rebuild the app image:

```bash
docker compose up -d --build
```

## Notes

### CORS for Image Loading

If your original images are served from another domain, configure object storage CORS to allow your site origin. Without CORS, thumbnails may load but the full viewer can still fail.

### Git Cache Repository

This setup uses `githubRepoSyncPlugin` to cache `photos-manifest.json` and thumbnails in a GitHub repository. If you change image URL generation rules, you may need to clear the cache repository and rebuild.

## License

MIT License © 2025
