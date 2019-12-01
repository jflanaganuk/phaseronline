import React from 'react';
import './CharacterWeaponRow.scss';
import { CharacterWeapon } from './CharacterWeapon';
import { EquipmentTypeUI } from '../App';

type CharacterWeaponRowProps = {
    equipment: EquipmentTypeUI;
};

export const CharacterWeaponRow: React.FC<CharacterWeaponRowProps> = props => {
    return (
        <div className="characterWeaponRowContainer">
            <CharacterWeapon
                hasEquipped={Boolean(props.equipment.main)}
                equipType={'main'}
                type={props.equipment.main && props.equipment.main.type}
                amount={props.equipment.main && props.equipment.main.amount}
            />
            <CharacterWeapon
                hasEquipped={Boolean(props.equipment.ranged)}
                equipType={'ranged'}
                type={props.equipment.ranged && props.equipment.ranged.type}
                amount={props.equipment.ranged && props.equipment.ranged.amount}
            />
            <CharacterWeapon
                hasEquipped={Boolean(props.equipment.ammo)}
                equipType={'ammo'}
                type={props.equipment.ammo && props.equipment.ammo.type}
                amount={props.equipment.ammo && props.equipment.ammo.amount}
            />
        </div>
    )
}