const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
module.exports = {
    entry: './js/index.tsx',
    resolve: {
        extensions: [ '.ts', '.tsx', '.js', '.jsx' ]
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.scss$/,
                loader: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new CheckerPlugin()
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development'
}