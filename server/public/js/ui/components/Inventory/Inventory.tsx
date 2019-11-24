import React from 'react';
import classNames from 'classnames';
import './Inventory.scss';
import { InventoryType } from '../../../../../shared/types';
import { InventoryItem } from './InventoryItem';

type InventoryProps = {
    inventory: InventoryType[];
    open: boolean;
};

export const Inventory: React.FC<InventoryProps> = props => {

    return (
        <div className={classNames({
            ["inventoryContainer"]: true,
            ["animateInFromLeft"]: props.open,
        })}>
            {props.open &&
            <>
                <h2>Inventory</h2>
                {props.inventory.map(({itemType, amount}) => <InventoryItem key={itemType} amount={amount} type={itemType} />)}
            </>
            }
        </div>
    )
}