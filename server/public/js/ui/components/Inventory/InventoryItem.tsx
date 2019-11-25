import React, { useState } from 'react';
import './InventoryItem.scss';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../App';

type InventoryItemProps = {
    type: string;
    title: string;
    description: string;
    damage: number;
    speed: number;
    amount: number | false;
}

export const InventoryItem: React.FC<InventoryItemProps> = props => {

    const [hovered, setHovered] = useState(false);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.ITEM, invType: props.type, amount: props.amount },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        })
    })

    return (
        <>
            <div 
                className={"inventoryItemContainer"} 
                ref={drag} 
                style={{opacity: isDragging ? 0.2 : 1}}
                onMouseMove={e => {
                    setMouseX(e.pageX);
                    setMouseY(e.pageY);
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <img 
                    className={"inventoryItemImg"}
                    src={require(`../../../../../assets/${props.type}.png`)} 
                    alt={props.type}
                />
                {Boolean(props.amount) &&
                    <p className={"inventoryItemAmount"}>{props.amount}</p>
                }
            </div>
            {hovered && !isDragging &&
                <div className={"inventoryItemTooltip"} style={{top: `${mouseY - 10}px`, left: `${mouseX - 10}px`}}>
                    <h2>{props.title}</h2>
                    <small>Damage: {props.damage}{' '}</small>
                    <small>Speed: {props.speed}{' '}</small>
                    <p>{props.description}</p>
                </div>
            }
        </>
    )
}