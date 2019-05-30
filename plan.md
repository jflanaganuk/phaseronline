# Plan

0. Should gather items from resources `first`

1. Create levels with `Tiled`
2. Store level data generated on the server side
3. Iterate over data `on` the server and build up a map of it internally for collision detection
4. Send data to the client to render the level `on new connection`
5. `Spawnables` should be stored in the level data as well so the server can keep track of where things should be.
6. All events on the client will be broadcast to the server, events will happen as so:
    1. Event will happen on client anyway and sent to the server
    2. The server runs checks to see if event could have happened and returns it's findings.
    3. If successful the server executes the event as well and the client is left alone, it is broadcast to other players
    4. If failed the server reverts the event and tells the client to as well, it is `not` broadcast to other players
7. Example client events are:
    1. Player spawning
    2. Movement
    3. Shooting
    4. Picking up stuff
    5. Dealing / Taking damage
8. Example server events are
    1. Pickup spawns
    2. New player connecting
    3. Player disconnecting
    4. Spawning enemies
    5. Moving enemies
    6. Dealing damage to players by NPCs