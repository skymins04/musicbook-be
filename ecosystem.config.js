module.exports = {
  apps: [
    {
      name: 'musicbook-be',
      script: './dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      time: true,
    },
  ],
};
