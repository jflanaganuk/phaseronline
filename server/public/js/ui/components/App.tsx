import React, { useState } from 'react';
import { Inventory } from './Inventory';
import { EventEmitter } from '../../events';

import './App.scss';

type AppProps = {
    className: string;
};

export const App: React.FC<AppProps> = props => {

    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);

    EventEmitter.subscribe('inventoryChange', (event: any) => {
        setInventory(event.inventory);
        setOpen(event.opened);
    });

    return (
        <div className={props.className}>
            <p>Phaser Online</p>
            {open &&
                <>
                    <div className={"inventoryModal"}></div>
                    <Inventory inventory={inventory} />
                </>
            }
        </div>
    )
}

export default App;