module.exports = {
  apps: [
    {
      name: 'stream-music-be',
      script: './dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      time: true,
    },
  ],
};
