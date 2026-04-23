# Afilmory Docker 部署

<p align="center">
  🌐
  <a href="readme.md">English</a>
  ·
  <a href="readme.zh-CN.md">简体中文</a>
</p>

这是一个基于 Docker 的 [Afilmory](https://github.com/Afilmory/Afilmory) 部署方案，内置 PostgreSQL 和对象存储配置。

## 快速开始

### 环境要求

- Docker
- Docker Compose
- 一个兼容 S3 的对象存储桶
- 一个给 `githubRepoSyncPlugin` 使用的 GitHub 仓库

### 文件说明

- `Dockerfile`：构建 Afilmory 应用镜像
- `docker-compose.yml`：同时启动 `afilmory` 和 `postgres`
- `.env.example`：部署模板
- `.gitignore`：忽略本地密钥和构建产物

### 1. 创建本地 `.env`

```bash
cp .env.example .env
```

然后把 `.env` 里的占位值改成你自己的真实配置。

重点配置项：

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

说明：

- `S3_CUSTOM_DOMAIN` 必须写完整 URL，例如 `https://cdn.example.com`
- `PG_CONNECTION_STRING` 要与 `POSTGRES_DB`、`POSTGRES_USER`、`POSTGRES_PASSWORD` 保持一致
- `.env` 已被 `.gitignore` 忽略，真实密钥放这里；`.env.example` 用来保留模板

### 2. 修改站点信息

编辑 `config.json`，填入你的站点信息。

示例：

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

### 3. 检查 Builder 配置

`builder.config.ts` 现在已经改成从 `.env` 读取部署参数。

依赖的变量包括：

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

### 4. 启动服务

```bash
docker compose up -d --build
```

会启动两个服务：

- `postgres`：PostgreSQL 16
- `afilmory`：构建后的 Afilmory 应用

默认访问地址：

```txt
http://localhost:3020
```

### 5. 对象存储或配置变更后重新构建

如果你修改了以下内容：

- `.env`
- `config.json`
- `builder.config.ts`
- S3 中的照片

需要重新构建镜像：

```bash
docker compose up -d --build
```

## 补充说明

### 图片跨域加载

如果原图来自其他域名，需要在对象存储或 CDN 上配置 CORS，允许你的站点域名访问。否则缩略图可能正常，但大图查看器仍会报“图片加载失败”。

### Git 缓存仓库

当前方案使用 `githubRepoSyncPlugin` 把 `photos-manifest.json` 和缩略图缓存到 GitHub 仓库。如果你修改了图片 URL 生成规则，可能需要清空缓存仓库后重新构建。

## 许可证

MIT License © 2025
