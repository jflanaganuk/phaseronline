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

export type EquipmentTypeUI = {
    main: {
        type: string;
        amount: number | false;
    } | false;
    ranged: {
        type: string;
        amount: number | false;
    } | false;
    ammo: {
        type: string;
        amount: number | false;
    } | false;
}

export const App: React.FC<AppProps> = props => {

    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [equipment, setEquipment] = useState<EquipmentTypeUI>({
        main: false,
        ranged: false,
        ammo: false
    });

    EventEmitter.subscribe('inventoryChange', (event: any) => {
        setInventory(event.inventory);
        setOpen(event.opened);
    });

    EventEmitter.subscribe('equipmentChange', (event: any) => {
        setEquipment({
            ...equipment,
            [event.kind]: {
                type: event.type,
                amount: event.amount
            }
        })
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={props.className}>
                {open &&
                <div className={"inventoryModal"}></div>
            }
                <Inventory inventory={inventory} open={open} />
                <Character open={open} equipment={equipment} />
            </div>
        </DndProvider>
    )
}

export default App;