const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(process.cwd(), 'src/client/index.ts'),

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.client.json'
                    }
                },
                exclude: /node_modules/
            },

            // Images
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name][hash][ext][query]',
                },
            },

            // 3D models
            {
                test: /\.(glb|gltf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/models/[name][hash][ext][query]',
                },
            },

            // Audio
            {
                test: /\.(mp3|wav|ogg|m4a)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/audio/[name][hash][ext][query]',
                },
            },

            // JSON (use default Webpack parser)
            {
                test: /\.json$/,
                type: 'json',
                parser: {
                    parse: JSON.parse
                }
            }
        ],
    },

    resolve: {
        alias: {
            three: path.resolve(process.cwd(), 'node_modules/three')
        },
        extensions: ['.tsx', '.ts', '.js'],
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(process.cwd(), 'dist'),
        clean: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(process.cwd(), 'public/index.html'),
            inject: 'body',
        }),
    ]
};
