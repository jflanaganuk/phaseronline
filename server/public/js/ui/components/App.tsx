import React, { useState } from 'react';
import { Inventory } from './Inventory/Inventory';
import { EventEmitter } from '../../events';

import './App.scss';
import { Character } from './Character/Character';

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
            {open &&
            <div className={"inventoryModal"}></div>
            }
            <Inventory inventory={inventory} open={open} />
            <Character open={open} />
        </div>
    )
}

export default App;