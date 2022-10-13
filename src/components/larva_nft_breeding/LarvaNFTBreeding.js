import React, {useEffect, useRef, useState} from 'react';
import {POST} from "../../api/api";
import {Modal, Col, Container, Row,} from 'react-bootstrap';
import LoadingModal from "../loading_modal/LoadingModal"
import styles from "./LarvaNFTBreeding.module.scss"
import backgroundImg from "../../assets/images/body_bg.jpg";
import breedIntro from "../../assets/images/breed_intro.mp4";
import titleImg from "../../assets/images/mv_title_reveal.png";
import {ERC721} from "../../utils/abi/ERC721";
import {PAUSABLE_NFT} from "../../utils/abi/PAUSABLE_NFT";
import {BREEDING_ABI} from "../../utils/abi/BREEDING_ABI";
import {contracts} from "../../utils/web3/contracts";
import Caver from "caver-js";
import SelectNftBoxModal from "./select_nft_box/SelectNftBoxModal";

function LarvaNFTBreeding(props) {
    const [showLoading, setShowLoading] = useState(false); // 로딩 모달
    const [selectBox, setSelectBox] = useState(false); // 셀렉트 박스
    const [selectSequence, setSelectSequence] = useState(true); // 셀렉트 박스

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showBreedingModal, setShowBreedingModal] = useState(false);
    const [alerts, setAlerts] = useState("");
    const AGREE_YN = localStorage.getItem('agreeYN');
    const [showPopupModal, setShowPopupModal] = useState(false);

    const [firstTokenId, setFirstTokenId] = useState("");
    const [firstTokenImg, setFirstTokenImg] = useState("");
    const [secondTokenId, setSecondTokenId] = useState("");
    const [secondTokenImg, setSecondTokenImg] = useState("");

    const provider = window['klaytn'];
    const caver = new Caver(provider);
    // const CURRENT_NFT_CONTRACT_ADDRESS = contracts['current_nft_contract'][props.networkId];
    // const REVEAL_CONTRACT_ADDRESS = contracts['reveal_contract'][props.networkId];
    const BREEDING_CONTRACT_ADDRESS = contracts['breeding_contract'][props.networkId];
    const PFP_3D_NFT_CONTRACT_ADDRESS = contracts['pfp_3d_nft_contract'][props.networkId];
    // const currentNftContract = new caver.klay.Contract(ERC721, CURRENT_NFT_CONTRACT_ADDRESS);
    const breedingContract = new caver.klay.Contract(BREEDING_ABI, BREEDING_CONTRACT_ADDRESS);
    const nftContract = new caver.klay.Contract(PAUSABLE_NFT, PFP_3D_NFT_CONTRACT_ADDRESS);

    function tokenIdCheck() {
        if (firstTokenId === "" || secondTokenId === "") {
            setAlerts("Please select your NFT.");
            setShowAlertModal(true);
            return false;
        }
        return true;
    }

    const [breedIntroStatus, setBreedIntroStatus] = useState(false);

    function breedIntroPlay() {
        const breedIntro = document.getElementById('breed_intro');
        setBreedIntroStatus(true);
        setShowAlertModal(true);
        breedIntro.play();
    }

    // async function nftBreeding() {
    //     if (!tokenIdCheck()) {
    //         return false;
    //     }
    //     setShowLoading(true);
    //     let breedingResult;
    //     let alertMsg = `Token ID ${tokenId} Reveal Success`; // 에러메세지
    //     let breedingStatus = false; // 리빌 상태
    //     try {
    //         const gasLimit = await breedingContract.methods.revealToken(firstTokenId, secondTokenId).estimateGas({
    //             from: props.accounts[0],
    //         })
    //         const gasPrice = await caver.rpc.klay.getGasPrice();
    //         breedingResult = await breedingContract.methods.revealToken(firstTokenId, secondTokenId).send({
    //             from: props.accounts[0],
    //             gas: gasLimit,
    //             gasPrice,
    //         });
    //         console.log(breeding); // 리빌 결과값
    //         breedingStatus = true;
    //     } catch (e) {
    //         console.log(e);
    //         setAlerts("breeding Fail ");
    //     }
    //     // 리빌이 성공하였을때
    //     if (breedingStatus) {
    //         try {
    //             const mintResult = await POST(`/api/v1/larvaBreeding/save`, {
    //                 tokenId,
    //                 txHash: breedingResult.transactionHash
    //             }, props.apiToken);
    //             console.log(mintResult)
    //             if (mintResult.result === 'error') {
    //                 throw new Error(mintResult.error);
    //             }
    //         } catch (e) {
    //             console.log(e);
    //         }
    //         setAlerts(`${alertMsg}`);
    //     }
    //     setShowAlertModal(true);
    //     setTokenId("");
    //     setShowBreedingModal(false);
    //     setShowLoading(false);
    //     return true;
    // }

    function myNftListOpen(sequence) {
        setSelectBox(true);
        setSelectSequence(sequence);
    }

    function agreePopup() {
        // 로컬스토리지 저장
        // localStorage.setItem('agreeYN', 'Y');
        setShowPopupModal(false);
    }

    useEffect(() => {
        // localStorage.removeItem('agreeYN');
        // 팝업 오늘 하루닫기 체크
        // if (AGREE_YN === null) {
        //     setShowPopupModal(true);
        // } else{
        //     setShowPopupModal(false);
        // }
    }, []);

    useEffect(() => {
        // todo : 선택한 NFT 그리기
    }, [firstTokenId, secondTokenId]);
    return (
        <>
            <section className={styles.breeding_nft}
                     style={{background: `url(${backgroundImg}) no-repeat center center fixed`}}>
                <div className={styles.content_box}>
                    <div className={styles.content_info}>
                        <h3>
                            Baby LARVA Breeding
                        </h3>
                        <h3>How to Breed Baby Larva</h3>
                        <p>
                            각각 다른 2가지 캐릭터 Larva NFT로 Baby Larva NFT를 Breeding할 수 있습니다.
                            총 2,000개의 Baby Larva NFT를 브리딩 할 수 있으며, 특별 200개 한정 레전더리 베이
                            비 라바를 ‘Brown’ 과 ‘Pink’로 브리딩 할 수 있으며, 선착순으로 마감됩니다.
                            마감 후 부터는 일반 베이비라바로 브리딩이 됩니다.
                            레전더리 베이비 라바 브리딩 외 조합으로는 일반 베이비라바 브리딩만 가능합니다.
                        </p>
                    </div>
                    <div className={styles.select_view_box}>
                        <div className={styles.first_box} onClick={() => {
                            myNftListOpen(1)
                        }}>
                            <h3>박스1</h3>
                            {firstTokenImg && <img src={firstTokenImg} alt={firstTokenId}/>}
                            {firstTokenId}
                        </div>
                        {firstTokenId && secondTokenId ? (
                            <button onClick={() => setShowBreedingModal(true)}
                                    className={styles.reveal_btn}>BREEDING!</button>
                        ) : (
                            <button onClick={() => breedIntroPlay()}
                                    className={styles.reveal_btn}>BREEDING!</button>
                        )}
                        <div className={styles.second_box} onClick={() => {
                            myNftListOpen(2)
                        }}>
                            <h3>박스2</h3>
                            {secondTokenImg && <img src={secondTokenImg} alt={secondTokenId}/>}
                            {secondTokenId}
                        </div>
                    </div>


                </div>
            </section>
            <div className={styles.fixed_screen} style={{display: breedIntroStatus ? 'block' : 'none'}}
                 id="breed_intro_box">
                <video id="breed_intro" className="breed_intro" onEnded={() => setBreedIntroStatus(false)}>
                    <source src={breedIntro} type="video/mp4"/>
                    지원하지 않는 브라우저입니다.
                </video>
            </div>
            {/*팝업 모달*/}
            <Modal centered size="lg" show={showPopupModal}
                   onHide={() => setShowPopupModal(false)} backdrop="static"
                   keyboard={false} dialogClassName="modal-90w">
                <Modal.Header>
                    <Container>
                        <Row>
                            <Col xs={9} md={6}>
                                <Modal.Title>[동의 및 확인]</Modal.Title>
                            </Col>
                            <Col xs={9} md={6}>
                                <Modal.Title>[Agree and Confirm]</Modal.Title>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer className={styles.alert_box}>
                    <button variant="" onClick={() => agreePopup()} className={styles.popup_btn}>
                        AGREE
                    </button>
                </Modal.Footer>
            </Modal>
            {/*알림창 모달*/}
            <Modal centered show={showAlertModal}
                   onHide={() => setShowAlertModal(false)}>
                <Modal.Body>
                    <div className="text-center mt-5">
                        <p className={styles.alert_msg}> {alerts}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className={styles.alert_box}>
                    <button variant="" onClick={() => setShowAlertModal(false)} className={styles.alert_btn}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
            {/*브리딩확인 모달*/}
            <Modal centered size="lg" show={showBreedingModal}
                   onHide={() => setShowBreedingModal(false)}>
                <Modal.Body>
                    <div className="text-center mt-5">
                        <p className={styles.alert_msg}>
                            {firstTokenId} + {secondTokenId}.<br/>
                            <span className={styles.alert_msg_span}>※ 뭐나올지 모름~</span>
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer className={styles.alert_box}>
                    {/*<button onClick={() => nftBreeding()} className={`${styles.alert_btn} ${styles.point_color}`}>*/}
                    {/*    Breeding*/}
                    {/*</button>*/}
                    <button onClick={() => setShowBreedingModal(false)} className={styles.alert_btn}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
            <LoadingModal showLoading={showLoading} setShowLoading={setShowLoading}/>
            {selectBox ? (
                <SelectNftBoxModal selectBox={selectBox} setSelectBox={setSelectBox} nftContract={nftContract}
                                   userAddress={props.accounts[0]} setFirstTokenId={setFirstTokenId}
                                   firstTokenId={firstTokenId} setFirstTokenImg={setFirstTokenImg}
                                   secondTokenId={secondTokenId} setSecondTokenId={setSecondTokenId}
                                   setSecondTokenImg={setSecondTokenImg}
                                   selectSequence={selectSequence}/>) : (<></>)
            }
        </>
    )
}

export default LarvaNFTBreeding
