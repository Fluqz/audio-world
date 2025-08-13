const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/client/index.ts',

    module: {
        rules: [
            // TypeScript
            {
                test: /\.tsx?$/,
                use: {
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.client.json' // 👈 Important fix
                }
                },
            },

            // Images and graphics
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name][hash][ext][query]',
                },
            },

            // 3D model files
            {
                test: /\.(glb|gltf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/models/[name][hash][ext][query]',
                },
            },

            // JSON files used as static assets
            {
                test: /\.json$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/data/[name][hash][ext][query]',
                },
                type: 'json',
                parser: {
                    parse: JSON.parse
                }
            },

            // Audio files
            {
                test: /\.(mp3|wav|ogg|m4a)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/audio/[name][hash][ext][query]',
                },
            },
        ],
    },

    resolve: {
        alias: {
            three: path.resolve('./node_modules/three'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist'), // Make sure this matches your folder layout
        clean: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: 'body',
        }),
    ],
};
