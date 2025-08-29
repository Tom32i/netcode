import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    target: 'node',
    entry: resolve(__dirname, 'src/server/index.js'),
    output: {
        filename: 'dist/server/netcode.umd.cjs',
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
