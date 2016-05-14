var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'durdenbot'
    },
    port: process.env.PORT || 3000,
    port: process.env.PORT,
  },

  test: {
    root: rootPath,
    app: {
      name: 'durdenbot'
    },
    port: process.env.PORT || 3000,
  },

  production: {
    root: rootPath,
    app: {
      name: 'durdenbot'
    },
    port: process.env.PORT || 3000,
  }
};

module.exports = config[env];
