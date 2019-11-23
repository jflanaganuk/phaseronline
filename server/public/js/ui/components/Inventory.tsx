import React from 'react';
import './Inventory.scss';
import { InventoryType } from '../../../../shared/types';

type InventoryProps = {
    inventory: InventoryType[];
};

export const Inventory: React.FC<InventoryProps> = props => {

    return (
        <div className={"inventoryContainer"}>
            {props.inventory.map(item => <p>{item.itemType} {item.amount}</p>)}
        </div>
    )
}