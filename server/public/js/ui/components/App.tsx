import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Inventory } from './Inventory/Inventory';
import { EventEmitter } from '../../events';

import './App.scss';
import { Character } from './Character/Character';

type AppProps = {
    className: string;
};

export const ItemTypes = {
    ITEM: 'item'
}

export const App: React.FC<AppProps> = props => {

    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);

    EventEmitter.subscribe('inventoryChange', (event: any) => {
        setInventory(event.inventory);
        setOpen(event.opened);
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={props.className}>
                {open &&
                <div className={"inventoryModal"}></div>
            }
                <Inventory inventory={inventory} open={open} />
                <Character open={open} />
            </div>
        </DndProvider>
    )
}

export default App;