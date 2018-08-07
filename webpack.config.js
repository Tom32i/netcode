module.exports = {
  entry: {
    client: './src/client/index.js',
    server: './src/server/index.js',
  },
  output: {
    filename: 'netcode-[name].js',
    path: __dirname + '/dist',
    library: 'netcode',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
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
    ],
  },
  //mode: 'production'
};
