module.exports = {
  apps: [
    {
      name: 'build-with-ai-web',
      cwd: '/opt/build-with-ai',
      script: 'npm',
      args: 'run start -- --hostname 127.0.0.1 --port 3000',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}