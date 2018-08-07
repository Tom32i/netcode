const rules = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['babel-preset-env']
      }
    }
  }
];

const clientConfig = {
  target: 'web',
  entry: './src/client/index.js',
  output: {
    filename: 'netcode-client.js',
    path: __dirname + '/dist',
    library: 'netcode',
    libraryTarget: 'umd'
  },
  module: { rules },
  //mode: 'production'
};

const serverConfig = {
  target: 'node',
  entry: './src/server/index.js',
  output: {
    filename: 'netcode-server.js',
    path: __dirname + '/dist',
    library: 'netcode',
    libraryTarget: 'umd'
  },
  module: { rules },
  //mode: 'production'
};

module.exports = [ serverConfig, clientConfig ];
