module.exports = {
  apps: [
    {
      name: "blogify",
      script: "index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      log_file: "/var/log/jenkins-apps/blogify.log",
      out_file: "/var/log/jenkins-apps/blogify-out.log",
      error_file: "/var/log/jenkins-apps/blogify-error.log",
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
