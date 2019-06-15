const path = require('path');
module.exports = {
    entry: './js/game.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development'
}