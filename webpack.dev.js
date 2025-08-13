const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public/'),
        },
        hot: true,
        proxy: {
            "/socket.io": {
                target: "http://localhost:8080",
                // target: "http://127.0.0.1:3000",
                ws: true
            }
        }
    }
});