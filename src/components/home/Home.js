import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {Swiper, SwiperSlide} from 'swiper/react';
import "swiper/swiper.scss";
import AOS from "aos";
import "aos/dist/aos.css";
import VisualBackground from "../../assets/images/home/back.jpg";
import VisualLogo from "../../assets/images/home/logo_larvakids_01.png";
import VisualCharacter from "../../assets/images/home/home_visual_character.png";
import KidsLogo from "../../assets/images/home/logo_larvakids_02.png";
import Nft01 from "../../assets/images/home/nft_01.png";
import Nft02 from "../../assets/images/home/nft_02.png";
import Nft03 from "../../assets/images/home/nft_03.png";
import Nft04 from "../../assets/images/home/nft_04.png";
import Nft05 from "../../assets/images/home/nft_05.png";
import IconPala from "../../assets/images/icon/icon_pala.png";
import IconOpenSea from "../../assets/images/icon/icon_opensea.png";
import StoryBackground from "../../assets/images/home/back_story.png";
import StoryVisual from "../../assets/images/home/frame.png";
import styles from "./Home.module.scss";
import {Modal} from "react-bootstrap";

export default function Home(props) {

    const [faqStatus, setFaqStatus] = useState(0);
    const [showAlertModal, setShowAlertModal] = useState(false); // 알림창 모달
    const [alerts, setAlerts] = useState(""); // 알림 메세지
    function closeAlert() {
        setShowAlertModal(false);
        setAlerts("");
    }

    // 브리딩 시간안내
    function breedingAlert() {
        setAlerts(`${props.t("breeding_date")} \n2022/11/8 20:00 ~ 2022/11/9 20:00`);
        setShowAlertModal(true);
        return false;
    }
    //
    function comingSoon() {
        setAlerts(`Coming Soon`);
        setShowAlertModal(true);
        return false;
    }

    function faqToggle(index) {
        if (faqStatus === index) {
            setFaqStatus(0);
        } else {
            setFaqStatus(index);
        }
    }

    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    });
    return (
        <>
            <section className={styles.visual_section}>
                <img className={styles.background_img} src={VisualBackground} alt="Visual Background"/>
                <img src={VisualLogo} alt="VisualLogo"/><br/>
                {(props.openedStatus === "open") ? (
                    <Link data-aos="zoom-out" to="/breeding" className={styles.hrefButton}>
                        {props.t("breeding_btn")}
                    </Link>
                ) : (
                    <Link data-aos="zoom-out" onClick={() => {
                        breedingAlert()
                    }} className={styles.hrefButton}>
                        {props.t("breeding_btn")}
                    </Link>
                )
                }
                <img data-aos="fade-up" data-aos-duration="1000"
                     data-aos-anchor-placement="top-bottom" className={styles.characterImg} src={VisualCharacter}
                     alt="VisualCharacter"/>
            </section>
            <section className={styles.nft_section} id="LARVA_KIDS_NFT">
                <img className={styles.kids_logo} src={KidsLogo} alt="KidsLogo"/><br/>
                <Swiper
                    className={styles.nft_list_box}
                    spaceBetween={50}
                    slidesPerView={4}
                >
                    <SwiperSlide className={styles.swiper_img}><img src={Nft01} alt="Nft01"/></SwiperSlide>
                    <SwiperSlide className={styles.swiper_img}><img src={Nft02} alt="Nft02"/></SwiperSlide>
                    <SwiperSlide className={styles.swiper_img}><img src={Nft03} alt="Nft03"/></SwiperSlide>
                    <SwiperSlide className={styles.swiper_img}><img src={Nft04} alt="Nft04"/></SwiperSlide>
                    <SwiperSlide className={styles.swiper_img}><img src={Nft05} alt="Nft05"/></SwiperSlide>
                </Swiper>
                <div>
                    <a data-aos="zoom-out" href="https://opensea.io/collection/larva-kids" target={"_blank"} className={styles.hrefButton}>
                        <img src={IconOpenSea} alt="IconOpenSea"/> Buy on OpenSea
                    </a>
                    <a data-aos="zoom-out" href="https://pala.io/square/project/85f7b053e80db93c32b04248a921bff6ffe4fc92" target={"_blank"} className={styles.hrefButton}>
                        <img src={IconPala} alt="IconPala"/> Buy on PalaSquare
                    </a>
                </div>
            </section>
            <section className={styles.story_section} id="STORY">
                <div className={styles.story_background}>
                    <img src={StoryBackground} alt="StoryBackground"/>
                    <div className={styles.story_content}>
                        <img data-aos="fade-down" data-aos-duration="3000" src={StoryVisual} alt="StoryVisual"/>
                        <div data-aos="zoom-in" data-aos-duration="2000">
                            <h2>{props.t("story_title")}</h2>
                            <p>
                                {props.t("story_01").split("\n").map((line, index) => (
                                    <span key={index}>{line}</span>))}
                                <br/>
                                {props.t("story_02").split("\n").map((line, index) => (
                                    <span key={index}>{line}</span>))}
                                <br/>
                                {props.t("story_03").split("\n").map((line, index) => (
                                    <span key={index}>{line}</span>))}
                                <br/>
                                {props.t("story_04").split("\n").map((line, index) => (
                                    <span key={index}>{line}</span>))}
                                <br/>
                            </p>
                        </div>
                    </div>
                </div>

            </section>
            <section className={styles.roadmap_section} id="ROADMAP">
                <h2>{props.t("ROADMAP")}</h2>
                <div className={styles.roadmap_box}>
                    <div data-aos="flip-right" className={`${styles.item} ${styles.complete}`}>
                        <p className={styles.num}><span>01</span></p>
                        <div className={styles.box}>
                            <div>
                                {props.t("rode_map_01")}
                            </div>
                        </div>
                    </div>
                    <div data-aos="flip-right" className={`${styles.item} ${styles.complete}`}>
                        <p className={styles.num}><span>02</span></p>
                        <div className={styles.box}>
                            <div>
                                {props.t("rode_map_02")}
                            </div>
                        </div>
                    </div>
                    <div data-aos="flip-right" className={`${styles.item} ${styles.progress}`}>
                        <p className={styles.num}><span>03</span></p>
                        <div className={styles.box}>
                            <div>
                                {props.t("rode_map_03")}
                            </div>
                        </div>
                    </div>
                    <div data-aos="flip-right" className={`${styles.item} `}>
                        <p className={styles.num}><span>04</span></p>
                        <div className={styles.box}>
                            <div>
                                {props.t("rode_map_04")}
                            </div>
                        </div>
                    </div>
                    <div data-aos="flip-right" className={`${styles.item} ${styles.complete}`}>
                        <p className={styles.num}><span>05</span></p>
                        <div className={styles.box}>
                            <div>
                                {props.t("rode_map_05")}
                            </div>
                        </div>
                    </div>
                    <div data-aos="flip-right" className={`${styles.item} `}>
                        <p className={styles.num}><span>06</span></p>
                        <div className={styles.box}>
                            <div>
                                {props.t("rode_map_06")}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className={styles.faq_section} id="FAQ">
                <h2>FAQ</h2>
                <div data-aos="fade-up" className={styles.faq_content}>
                    <ul>
                        <li>
                            <div className={`${styles.q} ${faqStatus === 1 ? styles.faq_q_active : ""}`}
                                 onClick={() => faqToggle(1)}>
                                <p>{props.t("faq_q_01")}</p>
                            </div>
                            <div className={`${styles.a} ${faqStatus === 1 ? styles.faq_a_active : ""}`}>
                                <div>
                                    {props.t("faq_a_01")}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={`${styles.q} ${faqStatus === 2 ? styles.faq_q_active : ""}`}
                                 onClick={() => faqToggle(2)}>
                                <p>{props.t("faq_q_02")}</p>
                            </div>
                            <div className={`${styles.a} ${faqStatus === 2 ? styles.faq_a_active : ""}`}>
                                <div>
                                    {props.t("faq_a_02")}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={`${styles.q} ${faqStatus === 3 ? styles.faq_q_active : ""}`}
                                 onClick={() => faqToggle(3)}>
                                <p>{props.t("faq_q_03")}</p>
                            </div>
                            <div className={`${styles.a} ${faqStatus === 3 ? styles.faq_a_active : ""}`}>
                                <div>
                                    {props.t("faq_a_03")}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={`${styles.q} ${faqStatus === 4 ? styles.faq_q_active : ""}`}
                                 onClick={() => faqToggle(4)}>
                                <p>{props.t("faq_q_04")}</p>
                            </div>
                            <div className={`${styles.a} ${faqStatus === 4 ? styles.faq_a_active : ""}`}>
                                <div>
                                    {props.t("faq_a_04")}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className={`${styles.q} ${faqStatus === 5 ? styles.faq_q_active : ""}`}
                                 onClick={() => faqToggle(5)}>
                                <p>{props.t("faq_q_05")}</p>
                            </div>
                            <div className={`${styles.a} ${faqStatus === 5 ? styles.faq_a_active : ""}`}>
                                <div>
                                    {props.t("faq_a_05")}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
            {/*알림창 모달*/}
            <Modal centered show={showAlertModal}
                   onHide={() => closeAlert()}>
                <Modal.Body>
                    <div className="text-center mt-5">
                        <p className={styles.alert_msg}> {alerts}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className={styles.alert_box}>
                    <button variant="" onClick={() => closeAlert()} className={styles.alert_btn}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
