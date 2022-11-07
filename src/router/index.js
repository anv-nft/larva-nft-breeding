import React, {useEffect, useRef, useState} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Header from "../containers/header/Header";
import Footer from "../containers/footer/Footer";
import Home from "../components/home/Home";
import {GET, POST} from "../api/api";
import {useWeb3React} from "@web3-react/core";
import {kaikasConnector} from "../utils/web3/connectors";
import Caver from "caver-js";
import {isTestNet} from "../utils/web3/networks";
import {store} from "../store";
import {CHANGE_ADDRESS} from "../store/actions/walletAddress";
import LarvaNFTBreeding from "../components/larva_nft_breeding/LarvaNFTBreeding";
import {useTranslation} from "react-i18next";
import i18next from "../lang/i18n";

function Index() {
    const {t} = useTranslation();
    const {account, active, activate, deactivate} = useWeb3React();
    const didMount = useRef(true);
    const [accounts, setAccounts] = useState([]);
    const [apiToken, setApiToken] = useState(null);
    const [networkId, setNetworkId] = useState(1);
    const [isConnectedWallet, setConnectWallet] = useState(undefined);
    const [language, setLanguage] = useState("ko");
    const [openedStatus, setOpenedStatus] = useState("close");

    const langChangeHandler = (lang) => {
        setLanguage(lang);
        i18next.changeLanguage(lang);
    }

    useEffect(() => {
        async function openedCheck() {
            const status = await GET(`/api/v1/breeding/isOpened`);
            if (status.result === 'success') {
                setOpenedStatus("open");
            }
            console.log(status);
        }

        openedCheck();
        if (window.location.pathname === '/breeding') {
            const isConnected = window.localStorage.getItem("isConnected");
            if (isConnected === 'YES') {
                connectKaikas();
            } else {
                setConnectWallet("NO");
            }
            checkWalletClosed();
        }
    }, []);


    useEffect(() => { // CHECK CONNECTION
        async function logoutEffect() {
            await logout();
        }

        if (didMount.current) {
            didMount.current = false;
            return;
        }
        if (!active) {
            logoutEffect();
        }
        // 새고로침시 로그아웃 되는 로직개선
        if (account) {
            const storeAddress = store.getState().wallet.address;
            if (storeAddress !== account.toLowerCase()) {
                logoutEffect();
            }
        }
    }, [active, account]);

    async function checkWalletClosed() {
        setInterval(async () => {
            const isConnected = window.localStorage.getItem("isConnected");
            // console.log(isConnected);
            if (isConnected === 'YES') {
                const isUnlocked = await window.klaytn._kaikas.isUnlocked();
                // console.log(isUnlocked);
                if (!isUnlocked) {
                    await logout();
                }
            } else {
                setConnectWallet("NO");
            }
        }, 1000);
    }

    function loadWalletAttributes(account, chainId) {
        setConnectWallet('YES');
        let tempAccounts = [];
        tempAccounts.push(account);
        setAccounts(tempAccounts);
        store.dispatch(CHANGE_ADDRESS(account, chainId));
        setNetworkId(chainId);
        window.localStorage.setItem('isConnected', 'YES');
    }

    async function connectKaikas() {
        if (isKaikasWalletInstalled()) {
            try {
                await activate(kaikasConnector);

                const accounts = await window.klaytn.enable();
                const account = accounts[0]
                if (!isTestNet) {
                    if (window.klaytn.networkVersion !== 8217) {
                        alert('Please switch your wallet to the mainnet.');
                        throw 'error';
                    }
                }

                const token = localStorage.getItem('aniverse_token');
                if (token === null) {
                    //토큰생성
                    const res = await GET(`/api/v1/auth/breeding/${account}/uuid`);
                    // sign
                    const message = res.uuid;
                    const provider = window['klaytn'];
                    const caver = new Caver(provider);
                    //서명받기
                    await caver.klay.sign(message, account).then(async (message) => {
                        // get JWT
                        // jwt = await requestSignin(address, signedMessage);
                        await POST(`/api/v1/auth/breeding/signin`, {
                            address: account,
                            message
                        }).then((sign) => {
                            localStorage.setItem('aniverse_token', sign.token);
                            setApiToken(sign.token);
                            loadWalletAttributes(account, window.klaytn.networkVersion);
                        });
                        // save JWT
                    });


                } else if (token) {
                    const tokenCheck = await POST(`/api/v1/auth/tokencheck`, {address: account}, token);
                    if (tokenCheck.result === 'success' && tokenCheck.address === account) {
                        setApiToken(token);
                        loadWalletAttributes(account, window.klaytn.networkVersion);
                    } else {
                        await logout();
                    }
                } else {
                    await logout();
                }
            } catch (e) {
                await logout();
                console.log(e)
            }
        } else {
            alert("Please install Kaikas");
        }
    }


    function isKaikasWalletInstalled() {
        return window.klaytn !== undefined
    }

    async function logout() {
        setConnectWallet("NO");
        window.localStorage.setItem("isConnected", "NO");
        window.localStorage.removeItem("aniverse_token");
        setNetworkId(undefined);
        setAccounts([]);
        try {
            await deactivate();
        } catch (e) {
            console.log(e);
        }
    }

    return (

        <Router>
            <Header accounts={accounts} apiToken={apiToken} isConnected={isConnectedWallet} networkId={networkId}
                    openedStatus={openedStatus}
                    handleKaikasConnect={() => connectKaikas()} handleLogout={() => logout()}
                    langChangeHandler={langChangeHandler} t={t} language={language}/>
            <Routes>
                {
                    (openedStatus === "open") &&
                    <Route exact path="/breeding" element={<LarvaNFTBreeding accounts={accounts} apiToken={apiToken}
                                                                             isConnected={isConnectedWallet}
                                                                             networkId={networkId}
                                                                             handleKaikasConnect={() => connectKaikas()}
                                                                             handleLogout={() => logout()}/>}>
                    </Route>
                }
                <Route exact path="*"
                       element={<Home t={t} openedStatus={openedStatus}/>}>
                </Route>
            </Routes>
            <Footer/>
        </Router>
    )
}

export default Index
