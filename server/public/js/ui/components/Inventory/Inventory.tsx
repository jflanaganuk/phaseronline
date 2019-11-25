import React from 'react';
import classNames from 'classnames';
import './Inventory.scss';
import { InventoryType } from '../../../../../shared/types';
import { InventoryItem } from './InventoryItem';

type InventoryProps = {
    inventory: InventoryType[];
    open: boolean;
};

type ItemDatabaseEntry = {
    item_name: string;
    readable_name: string;
    description: string;
    damage: number;
    speed: number;
    stackable: boolean;
    equip_type: "main" | "ranged" | "ammo";
}

const item_database: {[key: string]: ItemDatabaseEntry} = require('../../../../../shared/item_database.json');

export const Inventory: React.FC<InventoryProps> = props => {

    return (
        <div className={classNames({
            ["inventoryContainer"]: true,
            ["animateInFromLeft"]: props.open,
        })}>
            {props.open &&
            <>
                <h2>Inventory</h2>
                {props.inventory.map(({itemType, amount}) => {
                    if (item_database[itemType].stackable) {
                        return <InventoryItem 
                                    key={itemType} 
                                    amount={amount} 
                                    type={itemType} 
                                    title={item_database[itemType].readable_name}
                                    description={item_database[itemType].description}
                                    damage={item_database[itemType].damage}
                                    speed={item_database[itemType].speed}
                                    equipType={item_database[itemType].equip_type}
                                />
                    } else {
                        return (
                            <>
                                {Array.from(Array(amount)).map((_, index) => {
                                    return <InventoryItem 
                                                key={`${itemType}${index}`} 
                                                amount={false} 
                                                type={itemType}
                                                title={item_database[itemType].readable_name}
                                                description={item_database[itemType].description}
                                                damage={item_database[itemType].damage}
                                                speed={item_database[itemType].speed}
                                                equipType={item_database[itemType].equip_type}
                                            />
                                })}
                            </>
                        )
                    }
                })}
            </>
            }
        </div>
    )
}