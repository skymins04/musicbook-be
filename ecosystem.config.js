module.exports = {
  apps: [
    {
      name: 'musicbook-be',
      script: './dist/src/main.js',
      instances: 2,
      exec_mode: 'cluster',
      time: true,
    },
  ],
};
