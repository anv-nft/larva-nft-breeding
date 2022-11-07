import React from 'react'
import styles from "./Footer.module.scss"
import {useLocation} from 'react-router-dom';
import logo from "../../assets/images/common/logo_aniverse.png";
import aniverseIcon from "../../assets/images/icon/icon_larvaNFT_wh.png";
import discordIcon from "../../assets/images/icon/icon_discord_wh.png";
import twitterIcon from "../../assets/images/icon/icon_twitter_wh.png";
import kakaoIcon from "../../assets/images/icon/icon_kakao_wh.png";
import aniverseIconGray from "../../assets/images/icon/icon_larvaNFT_gr.png";
import discordIconGray from "../../assets/images/icon/icon_discord_gr.png";
import twitterIconGray from "../../assets/images/icon/icon_twitter_gr.png";
import kakaoIconGray from "../../assets/images/icon/icon_kakao_gr.png";
function Footer() {
    const location = useLocation();
    return (
        <footer className={`${styles.footer} ${(location.pathname === '/breeding') && styles.breeding_footer}`}>
            <div>
                <img src={logo} style={{width: '200px'}} alt={`logo_img`}/>
            </div>
            <div className={styles.icon_list}>
                <a href="https://larvanft.aniverse.io/" target="_blank" rel="noopener noreferrer"><img src={(location.pathname === '/breeding') ? aniverseIcon : aniverseIconGray} alt="aniverse.io"/></a>
                <a href="https://discord.gg/larvanft" target="_blank" rel="noopener noreferrer"><img src={(location.pathname === '/breeding') ? discordIcon : discordIconGray} alt="discord link"/></a>
                <a href="https://twitter.com/ANIVERSE_NFT" target="_blank" rel="noopener noreferrer"><img src={(location.pathname === '/breeding') ? twitterIcon : twitterIconGray} alt="twitter link"/></a>
                <a href="https://open.kakao.com/o/gCGOxhAc" target="_blank" rel="noopener noreferrer"><img src={(location.pathname === '/breeding') ? kakaoIcon : kakaoIconGray} alt="kakao link"/></a>
            </div>
            <div className={styles.copyright}>
                <p>COPYRIGHT © ANIVERSE All RIGHTS RESERVED.</p>
            </div>
        </footer>
    )
}

export default Footer
