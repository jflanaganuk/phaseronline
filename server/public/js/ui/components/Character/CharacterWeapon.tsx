import React from 'react';
import './CharacterWeapon.scss';

type CharacterWeaponProps = {
    hasEquipped: boolean;
    type?: string;
    amount?: number;
}

export const CharacterWeapon: React.FC<CharacterWeaponProps> = props => {
    return (
        <div className="characterWeaponContainer">
            {props.hasEquipped &&
            <>
                <img 
                    className="characterWeaponImg"
                    src={require(`../../../../../assets/${props.type}.png`)} 
                    alt={props.type} 
                />
                <p className="characterWeaponAmount">{props.amount}</p>
            </>
            }
        </div>
    )
}