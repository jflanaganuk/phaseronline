import React from 'react';
import './CharacterWeaponRow.scss';
import { CharacterWeapon } from './CharacterWeapon';

type CharacterWeaponRowProps = {};

export const CharacterWeaponRow: React.FC<CharacterWeaponRowProps> = props => {
    return (
        <div className="characterWeaponRowContainer">
            <CharacterWeapon
                hasEquipped={false}
            />
            <CharacterWeapon
                hasEquipped={false}
            />
            <CharacterWeapon
                hasEquipped={false}
            />
        </div>
    )
}