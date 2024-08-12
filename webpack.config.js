import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientConfig = {
    target: 'web',
    entry: './src/client/index.js',
    output: {
        filename: 'client.js',
        path: __dirname,
        library: {
            name: 'netcode',
            type: 'umd',
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] }
                }
            }
        ]
    },
};

const serverConfig = {
    target: 'node',
    entry: './src/server/index.js',
    output: {
        filename: 'server.cjs',
        path: __dirname,
        library: {
            name: 'netcode',
            type: 'umd',
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: [[ '@babel/preset-env', { targets: { node: true } } ]] }
                }
            }
        ]
    },
};

export default [ serverConfig, clientConfig ];
