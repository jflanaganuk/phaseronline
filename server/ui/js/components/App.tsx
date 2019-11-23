import React from 'react';

type AppProps = {
    className: string;
};

export const App: React.FC<AppProps> = props => {
    return (
        <div className={props.className}>
            <p>Phaser Online</p>
        </div>
    )
}

export default App;