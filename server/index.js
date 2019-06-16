const path = require('path');
const jsdom = require('jsdom');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const Datauri = require('datauri');
const datauri = new Datauri();

const { JSDOM } = jsdom;

app.use('/', express.static(__dirname + '/'));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(res, req) {
    res.sendFile(__dirname + '/index.html');
});

function setupAuthorativePhaser() {
    JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
        runScripts: "dangerously",
        resources: "usable",
        pretendToBeVisual: true
    }).then((dom) => {
        dom.window.URL.createObjectURL = (blob) => {
            if (blob) {
                return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
            }
        }
        dom.window.URL.revokeObjectURL = (objectURL) => {};

        dom.window.gameLoaded = () => {
            server.listen(9090, function(){
                console.log(`
                                           
                _____ _____ _____ _____ _____ _____ _____ 
               |   __|  _  |     |  _  | __  |  _  |   __|
               |__   |     | | | |   __|    -|     |__   |
               |_____|__|__|_|_|_|__|  |__|__|__|__|_____|
                                                          
                (Sampras is now running on port ${server.address().port}! :D)

               `);
            })
        }
        dom.window.io = io;
    }).catch((error) => {
        console.log(error.message)
    })
}

setupAuthorativePhaser();
