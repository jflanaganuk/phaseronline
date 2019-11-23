import React from 'react';
import { Inventory } from './Inventory';
import { InventoryType } from '../../../../shared/types';

type AppProps = {
    className: string;
    socket: SocketIOClient.Socket;
};

type SharedExposedProps = {
    inventory: InventoryType[];
    inventoryOpen: boolean;
};

const sharedExposed: SharedExposedProps = {
    inventory: [],
    inventoryOpen: false,
};

export const App: React.FC<AppProps> = props => {

    props.socket.on('inventoryToggle', (payload: {playerId: string, opened: boolean, inventory: InventoryType[]}) => {
        if (payload.playerId === props.socket.id) {
            sharedExposed.inventory = payload.inventory;
            sharedExposed.inventoryOpen = payload.opened;

            console.log(sharedExposed);
        }
    });

    return (
        <div className={props.className}>
            <AppInner
                inventory={sharedExposed.inventory}
                inventoryOpen={sharedExposed.inventoryOpen}
            />
        </div>
    )
}

const AppInner: React.FC<SharedExposedProps> = props => {
    console.log(props);
    return (
        <>
            <p>Phaser Online</p>
            {props.inventoryOpen &&
                <Inventory 
                    inventory={props.inventory}
                />
            }
        </>
    )
}

export default App;