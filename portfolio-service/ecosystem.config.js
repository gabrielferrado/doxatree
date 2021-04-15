module.exports = {
  apps: [
    {
      name: "portfolio-service",
      script: "dist/bundle.js",
      env: {
        PORT: 80,
        NODE_ENV: "production"
      }
    }
  ]
};
