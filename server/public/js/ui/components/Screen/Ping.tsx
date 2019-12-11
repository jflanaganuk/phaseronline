import React, { useState } from 'react';
import './Ping.scss';
import { EventEmitter } from '../../../events';

type PingProps = {};

export const Ping: React.FC<PingProps> = () => {
    const [ping, setPing] = useState(99999);

    EventEmitter.subscribe('pingUpdate', (event: any) => {
        setPing(event);
    });

    return (
        <p className="pingContainer">
            {`Ping: ${ping}ms`}
        </p>
    )
}