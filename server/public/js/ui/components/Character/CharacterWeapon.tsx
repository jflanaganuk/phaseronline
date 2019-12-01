import React from 'react';
import './CharacterWeapon.scss';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../App';
import { EventEmitter } from '../../../events';

type CharacterWeaponProps = {
    hasEquipped: boolean;
    equipType: 'main' | 'ranged' | 'ammo';
    type: string | false;
    amount: number | false;
}

type DraggedItemProps = {
    type: string;
    invType: string;
    amount: number;
}

export const CharacterWeapon: React.FC<CharacterWeaponProps> = props => {

    const [, drop] = useDrop({
        accept: props.equipType,
        drop: (obj: DraggedItemProps) => equipItem(obj)
    });

    const equipItem = (obj: DraggedItemProps) => {
        EventEmitter.dispatch('equipItem', {kind: obj.type, type: obj.invType, amount: obj.amount});
    }
    
    return (
        <div className="characterWeaponContainer" ref={drop}>
            {props.hasEquipped && props.type &&
            <>
                <img 
                    className="characterWeaponImg"
                    src={require(`../../../../../assets/${props.type}.png`)} 
                    alt={props.type} 
                />
                {props.amount &&
                    <p className="characterWeaponAmount">{props.amount}</p>
                }
            </>
            }
        </div>
    )
}