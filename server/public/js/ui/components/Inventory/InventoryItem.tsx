import React from 'react';
import './InventoryItem.scss';

type InventoryItemProps = {
    type: string;
    amount: number;
}

export const InventoryItem: React.FC<InventoryItemProps> = props => {
    return (
        <div className={"inventoryItemContainer"}>
            <img 
                className={"inventoryItemImg"}
                src={require(`../../../../../assets/${props.type}.png`)} 
                alt={props.type}
            />
            <p className={"inventoryItemAmount"}>{props.amount}</p>
        </div>
    )
}