const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
module.exports = {
    entry: './js/game.ts',
    resolve: {
        extensions: [ '.ts', '.tsx', '.js', '.jsx' ]
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
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