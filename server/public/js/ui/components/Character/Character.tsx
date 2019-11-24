import React from 'react';
import './Character.scss';
import { CharacterWeaponRow } from './CharacterWeaponRow';

type CharacterProps = {};

export const Character: React.FC<CharacterProps> = props => {
    return (
        <div className="characterContainer">
            <h2>Character</h2>
            <div className="characterImageContainer">
                <img 
                    className="characterImage" 
                    src={require("../../../../../assets/TopDownCharacter/Character/Character_Still.png")} 
                    alt="Character Image" 
                />
            </div>
            <CharacterWeaponRow/>
        </div>
    );
}