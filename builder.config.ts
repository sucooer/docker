import { defineBuilderConfig, githubRepoSyncPlugin } from '@afilmory/builder'

export default defineBuilderConfig(() => ({
  plugins: [
    // Use remote repository as manifest and thumbnail cache
    githubRepoSyncPlugin({
      repo: {
        url: process.env.GITHUB_REPO_URL || '',
        token: process.env.GIT_TOKEN,
        branch: process.env.GITHUB_REPO_BRANCH || 'main',
      },
    }),
  ],
  storage: {
    // Storage configuration
    provider: 's3',
    bucket: process.env.S3_BUCKET || '',
    endpoint: process.env.S3_ENDPOINT || '',
    region: process.env.S3_REGION || 'us-east-1',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    prefix: process.env.S3_PREFIX || 'photos/',
    customDomain: process.env.S3_CUSTOM_DOMAIN || '',
  },
}))
