import React from 'react';
import LarvaNFTBreeding from './larva_nft_breeding/LarvaNFTBreeding'

export default function Home(props) {

    return (
        <>
            <LarvaNFTBreeding accounts={props.accounts} networkId={props.networkId} apiToken={props.apiToken} isConnected={props.isConnected}
                            handleKaikasConnect={() => props.handleKaikasConnect()} handleLogout={() => props.handleLogout()}/>
        </>
    );
}
