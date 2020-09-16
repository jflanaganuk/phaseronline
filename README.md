# PhaserOnline

This project uses phaser to create a multiplayer game.
It runs the phaser engine both on the client and the server at the same time, the server runs the physics engine headlessly and handles all logic such as collisions, movement etc.
The client is solely responsible for sending input details to the server and rendering the output on screen.
Both the server and client share assets such as images and level data.

## To play

```
npm install
npm run start
```

Go to localhost:9090

## To run tests

In terminal 1:
```
npm run start
```

In a new terminal (2):
```
npm run test
```

## To create levels

Download a program called [Tiled](https://www.mapeditor.org/)
After installation you can edit the levels stored in
```
server/assets/leveldata
```
Be sure to export the data as .json format!
