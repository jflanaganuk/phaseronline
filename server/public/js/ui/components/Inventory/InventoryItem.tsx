import React from 'react';
import './InventoryItem.scss';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../App';

type InventoryItemProps = {
    type: string;
    amount: number;
}

export const InventoryItem: React.FC<InventoryItemProps> = props => {

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.ITEM, invType: props.type, amount: props.amount },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        })
    })

    return (
        <div className={"inventoryItemContainer"} ref={drag} style={{opacity: isDragging ? 0.2 : 1}}>
            <img 
                className={"inventoryItemImg"}
                src={require(`../../../../../assets/${props.type}.png`)} 
                alt={props.type}
            />
            <p className={"inventoryItemAmount"}>{props.amount}</p>
        </div>
    )
}