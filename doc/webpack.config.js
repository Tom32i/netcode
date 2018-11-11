const webpack = require('webpack');

const rules = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    include: '/node_modules/netcode/src/',
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  }
];

const clientConfig = {
  target: 'web',
  entry: './src/client.js',
  output: {
    filename: 'client.js',
    path: `${__dirname}/dist/`,
  },
  module: { rules }
};

const serverConfig = {
  target: 'node',
  entry: './src/server.js',
  output: {
    filename: 'server.js',
    path: `${__dirname}/dist/server/`,
  },
  module: { rules }
};

module.exports = [ serverConfig, clientConfig ];
