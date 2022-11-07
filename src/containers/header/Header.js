import React, {useState} from 'react'
import { useLocation} from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import logo from "../../assets/images/common/logo.png";
import menuButton from "../../assets/images/icon/menu_btn.png";
import engButton from "../../assets/images/icon/eng_btn.png";
import koButton from "../../assets/images/icon/ko_btn.png";
import ConnectWallet from "../../components/connect_wallet/ConnectWallet";
import styles from "./Header.module.scss";
import aniverseIcon from "../../assets/images/icon/icon_larvaNFT.png";
import discordIcon from "../../assets/images/icon/icon_discord.png";
import twitterIcon from "../../assets/images/icon/icon_twitter.png";
import kakaoIcon from "../../assets/images/icon/icon_kakao.png";
function Header(props) {
    const location = useLocation();
    const [menuStatus, setMenuStatus] = useState(false);
    const menuToggle = () => {
        // 👇️ passed function to setState
        setMenuStatus(current => !current);
    };
    return (
        <>
            <div className={styles.header}>
                <img className={styles.logo_img} src={logo} alt="header logo"/>
                {props.openedStatus === "open" && location.pathname === '/breeding'  ? (
                    <>
                        {
                            props.accounts && props.accounts.length > 0 && props.isConnected === 'YES' ? (

                                <ConnectWallet accounts={props.accounts} apiToken={props.apiToken}
                                               isConnected={props.isConnected} networkId={props.networkId}
                                               handleKaikasConnect={() => props.handleKaikasConnect()}
                                               handleLogout={() => props.handleLogout()}/>


                            ) : (
                                <ConnectWallet accounts={props.accounts} apiToken={props.apiToken}
                                               isConnected={props.isConnected}
                                               networkId={props.networkId}
                                               handleKaikasConnect={() => props.handleKaikasConnect()}/>
                            )

                        }
                    </>
                ) : (
                    <>
                        <HashLink to="#LARVA_KIDS_NFT">
                            {props.t('LARVA_KIDS_NFT')}
                        </HashLink>
                        <HashLink to="#STORY">
                            {props.t('STORY')}
                        </HashLink>
                        <HashLink to="#ROADMAP">
                            {props.t('ROADMAP')}
                        </HashLink>
                        <HashLink to="#FAQ">
                            {props.t('FAQ')}
                        </HashLink>
                        <div>
                            {props.language === 'ko' ? (
                                <button className={styles.img_button} onClick={() => props.langChangeHandler("en")}><img src={engButton} alt="ENG Button"/></button>
                            ) : (
                                <button className={styles.img_button} onClick={() => props.langChangeHandler("ko")}><img src={koButton} alt="KO Button"/></button>
                            )}
                            <button className={styles.img_button} onClick={() => menuToggle()}><img src={menuButton} alt="menu Button"/></button>
                            <div className={styles.menu_button} style={{display: menuStatus ? 'block' : 'none'}}>
                                <a href="https://larvanft.aniverse.io/" target="_blank" rel="noopener noreferrer"><img src={aniverseIcon} alt="aniverse.io"/> {props.t('LARVA_NFT')}</a>
                                <a href="https://discord.gg/larvanft" target="_blank" rel="noopener noreferrer"><img src={discordIcon} alt="discord link"/> {props.t('DISCORD')}</a>
                                <a href="https://twitter.com/ANIVERSE_NFT" target="_blank" rel="noopener noreferrer"><img src={twitterIcon} alt="twitter link"/> {props.t('TWITTER')}</a>
                                <a href="https://open.kakao.com/o/gCGOxhAc" target="_blank" rel="noopener noreferrer"><img src={kakaoIcon} alt="kakao link"/> {props.t('KAKAO')}</a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Header
