import { defineBuilderConfig, githubRepoSyncPlugin } from '@afilmory/builder'

export default defineBuilderConfig(() => ({
  plugins: [
    githubRepoSyncPlugin({
      repo: {
        enable: false,
        url: 'https://github.com/xxx/xxx',
        token: '',
        branch: 'main',
      },
    }),
  ],
  storage: {
    provider: 'huggingface',
    token: process.env.HF_TOKEN,
    repo: 'your-username/your-photos',
    prefix: 'photos/',
  },
}))