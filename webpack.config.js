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

const resolve = {
  alias: {
    'netcode': `${__dirname}/`,
  }
}

const clientConfig = {
  target: 'web',
  entry: './src/client/index.js',
  output: {
    filename: 'client.js',
    path: `${__dirname}`,
    library: 'netcode',
    libraryTarget: 'umd'
  },
  module: { rules },
  resolve,
};

const serverConfig = {
  target: 'node',
  entry: './src/server/index.js',
  output: {
    filename: 'server.js',
    path: `${__dirname}`,
    library: 'netcode',
    libraryTarget: 'umd'
  },
  module: { rules },
  resolve,
};

module.exports = [ serverConfig, clientConfig ];
