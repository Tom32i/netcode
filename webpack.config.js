const path = require('path');

module.exports = {
  entry: {
    client: './src/client/Client.js',
    server: './src/server/Client.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'client.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
  //mode: 'production'
};
