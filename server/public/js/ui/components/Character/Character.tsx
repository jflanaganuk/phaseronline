import React from 'react';
import classNames from 'classnames';
import './Character.scss';
import { CharacterWeaponRow } from './CharacterWeaponRow';
import { EquipmentTypeUI } from '../App';

type CharacterProps = {
    open: boolean;
    equipment: EquipmentTypeUI;
};

export const Character: React.FC<CharacterProps> = props => {

    return (
        <div className={classNames({
            ["characterContainer"]: true,
            ["animateInFromRight"]: props.open,
        })}>
            {props.open &&
            <>
                <h2>Character</h2>
                <div className="characterImageContainer">
                    <img 
                        className="characterImage" 
                        src={require("../../../../../assets/TopDownCharacter/Character/Character_Still.png")} 
                        alt="Character Image" 
                    />
                </div>
                <CharacterWeaponRow equipment={props.equipment}/>
            </>
            }
        </div>
    );
}