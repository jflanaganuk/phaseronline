import { SceneWithPlayersAndInputType } from "../../../shared/types";

export function processInputs(context: SceneWithPlayersAndInputType, lockCharacter: boolean){
    if (context.cursors.left && context.cursors.left.isDown || context.joyStickKeys.left && context.joyStickKeys.left.isDown) {
        context.leftKeyPressed = true;
    } else {
        context.leftKeyPressed = false;
    }  
    
    if (context.cursors.right && context.cursors.right.isDown || context.joyStickKeys.right && context.joyStickKeys.right.isDown) {
        context.rightKeyPressed = true;
    } else {
        context.rightKeyPressed = false;
    }

    if (context.cursors.up && context.cursors.up.isDown || context.joyStickKeys.up && context.joyStickKeys.up.isDown) {
        context.upKeyPressed = true;
    } else {
        context.upKeyPressed = false;
    }
    
    if (context.cursors.down && context.cursors.down.isDown || context.joyStickKeys.down && context.joyStickKeys.down.isDown) {
        context.downKeyPressed = true;
    } else {
        context.downKeyPressed = false;
    }

    if (context.cursors.shift && context.cursors.shift.isDown || context.virtualKeys.shift.isDown) { 
        context.shiftKeyPressed = true;
    } else {
        context.shiftKeyPressed = false;
    }

    if (context.mouse.rightButtonDown()) {
        context.pickupKeyPressed = true;
    } else {
        context.pickupKeyPressed = false;
    }

    if (context.cursors.inventory && context.cursors.inventory.isDown || context.virtualKeys.inventory.isDown) {
        context.inventoryKeyPressed = true;
    } else {
        context.inventoryKeyPressed = false;
    }

    if (context.mouse.leftButtonDown()) {
        context.swingKeyPressed = true;
    } else {
        context.swingKeyPressed = false;
    }

    if (lockCharacter) {
        context.socket.emit('playerInput', {
            left: false,
            right: false,
            up: false,
            down: false,
            shift: false,
            pickup: false,
            inventory: context.inventoryKeyPressed,
            swing: false,
        });
    } else {
        context.socket.emit('playerInput', {
            left: context.leftKeyPressed,
            right: context.rightKeyPressed,
            up: context.upKeyPressed,
            down: context.downKeyPressed,
            shift: context.shiftKeyPressed,
            pickup: context.pickupKeyPressed,
            inventory: context.inventoryKeyPressed,
            swing: context.swingKeyPressed,
        });
    }
    //reset mobile keys
    context.virtualKeys = {
        shift: {
            isDown: false
        },
        pickup: {
            isDown: false
        },
        inventory: {
            isDown: false
        },
        swing : {
            isDown: false
        },
    }

}