import { SceneWithPlayersAndInputType } from "../../../shared/types";

export function processInputs(context: SceneWithPlayersAndInputType){
    const left = context.leftKeyPressed;
    const right = context.rightKeyPressed;
    const up = context.upKeyPressed;
    const down = context.downKeyPressed;
    const shift = context.shiftKeyPressed;
    const pickup = context.pickupKeyPressed;
    const inventory = context.inventoryKeyPressed;

    if (context.cursors.left && context.cursors.left.isDown || context.joyStickKeys.left && context.joyStickKeys.left.isDown) {
        context.leftKeyPressed = true;
    } else if (context.cursors.right && context.cursors.right.isDown || context.joyStickKeys.right && context.joyStickKeys.right.isDown) {
        context.rightKeyPressed = true;
    } else {
        context.leftKeyPressed = false;
        context.rightKeyPressed = false;
    }

    if (context.cursors.up && context.cursors.up.isDown || context.joyStickKeys.up && context.joyStickKeys.up.isDown) {
        context.upKeyPressed = true;
    } else if (context.cursors.down && context.cursors.down.isDown || context.joyStickKeys.down && context.joyStickKeys.down.isDown) {
        context.downKeyPressed = true;
    } else {
        context.upKeyPressed = false;
        context.downKeyPressed = false;
    }

    if (context.cursors.shift && context.cursors.shift.isDown || context.virtualKeys.shift.isDown) { 
        context.shiftKeyPressed = true;
    } else {
        context.shiftKeyPressed = false;
    }

    if (context.cursors.pickup && context.cursors.pickup.isDown || context.virtualKeys.pickup.isDown) {
        context.pickupKeyPressed = true;
    } else {
        context.pickupKeyPressed = false;
    }

    if (context.cursors.inventory && context.cursors.inventory.isDown || context.virtualKeys.inventory.isDown) {
        context.inventoryKeyPressed = true;
    } else {
        context.inventoryKeyPressed = false;
    }

    if (left !== context.leftKeyPressed || right !== context.rightKeyPressed || up !== context.upKeyPressed || down !== context.downKeyPressed || shift !== context.shiftKeyPressed || pickup !== context.pickupKeyPressed || inventory !== context.inventoryKeyPressed) {
        context.socket.emit('playerInput', {
            left: context.leftKeyPressed,
            right: context.rightKeyPressed,
            up: context.upKeyPressed,
            down: context.downKeyPressed,
            shift: context.shiftKeyPressed,
            pickup: context.pickupKeyPressed,
            inventory: context.inventoryKeyPressed,
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
        }
    }

}