const path = require('path');

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")


module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(glb|gltf)$/i,
                // type: 'asset/resource',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                  loader: 'url-loader',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    entry: path.resolve(__dirname, './src/server/index.ts'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './docs'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, './docs'),
        },
        compress: true,
        port: 9000,
        proxy: {
            '/api': {
                target: 'ws://[address]:[port]',
                ws: true
            },
        },
    },
    plugins: [
        new NodePolyfillPlugin()
    ]
};
