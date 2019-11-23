import React from 'react';
import './Inventory.scss';
import { InventoryType } from '../../../../shared/types';
import { InventoryItem } from './InventoryItem';

type InventoryProps = {
    inventory: InventoryType[];
};

export const Inventory: React.FC<InventoryProps> = props => {

    return (
        <div className={"inventoryContainer"}>
            {props.inventory.map(({itemType, amount}) => <InventoryItem key={itemType} amount={amount} type={itemType} />)}
        </div>
    )
}