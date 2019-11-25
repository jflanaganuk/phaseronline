import React from 'react';
import './CharacterWeaponRow.scss';
import { CharacterWeapon } from './CharacterWeapon';

type CharacterWeaponRowProps = {};

export const CharacterWeaponRow: React.FC<CharacterWeaponRowProps> = props => {
    return (
        <div className="characterWeaponRowContainer">
            <CharacterWeapon
                hasEquipped={false}
                equipType={'main'}
            />
            <CharacterWeapon
                hasEquipped={false}
                equipType={'ranged'}
            />
            <CharacterWeapon
                hasEquipped={false}
                equipType={'ammo'}
            />
        </div>
    )
}