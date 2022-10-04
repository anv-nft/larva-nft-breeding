import React, {useEffect, useRef, useState} from 'react';
import {POST} from "../../../api/api";
import {Modal, Col, Container, Row,} from 'react-bootstrap';
import LoadingModal from "../../loading_modal/LoadingModal"
import styles from "./LarvaNFTBreeding.module.scss"
import backgroundImg from "../../../assets/images/body_bg.jpg";
import titleImg from "../../../assets/images/mv_title_reveal.png";
import {ERC721} from "../../../utils/abi/ERC721";
import {PAUSABLE_NFT} from "../../../utils/abi/PAUSABLE_NFT";
import {BREEDING_ABI} from "../../../utils/abi/BREEDING_ABI";
import {contracts} from "../../../utils/web3/contracts";
import Caver from "caver-js";

function LarvaNFTBreeding(props) {
    const [showLoading, setShowLoading] = useState(false); // 로딩 모달

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showBreedingModal, setShowBreedingModal] = useState(false);
    const [alerts, setAlerts] = useState("");
    const AGREE_YN = localStorage.getItem('agreeYN');
    const [showPopupModal, setShowPopupModal] = useState(false);

    const [firstTokenId, setFirstTokenId] = useState("");
    const [secondTokenId, setSecondTokenId] = useState("");
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
    }, [firstTokenId,secondTokenId]);
    return (
        <>
            <section className={styles.breeding_nft}
                     style={{background: `url(${backgroundImg}) no-repeat center center fixed`}}>
                <div className={styles.content_box}>
                    <div className={styles.select_view_box}>
                        <div className={styles.first_box}>
                            박스1
                        </div>
                            <img src={titleImg} alt="타이틀"/>
                        <div className={styles.second_box}>
                            박스2
                        </div>
                    </div>
                    {firstTokenId && secondTokenId ? (
                        <button onClick={() => setShowBreedingModal(true)}
                                className={styles.reveal_btn}>BREEDING!</button>
                    ) : (
                        <button onClick={() => alert('브리딩할려면 NFT 선택')}
                                className={styles.reveal_btn}>BREEDING!</button>
                    )}

                </div>
            </section>
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
                    <Container>
                        <Row>
                            <Col xs={9} md={6}>
                                <div className="text-left">
                                    <p className={styles.popup_msg}>
                                        라바 NEW PFP NFT로 교환하신 이후, 기존의 라바 NFT는 자동 소각됩니다.<br/>
                                        이와 동시에 라바 스테이킹 서비스에서 자동으로 예치 해제되며,<br/>
                                        그동안 해당 라바 NFT로 수확한 리워드 총량은 자동으로 Total Mined KANV로 귀속됩니다.<br/>
                                        <br/>
                                        기존의 라바 NFT로 이용할 수 있는 스테이킹 서비스는 10월 31일 (월) 정오까지 운영할 예정이며,<br/>
                                        이후에는 해당 페이지에 접근할 수 없게 될 예정입니다.<br/>
                                        <br/>
                                        이에 라바 NEW PFP NFT로 전부 교환하신 후,<br/>
                                        이전 스테이킹 서비스에서는 Total Mined KANV를 전부 Get All Rewards 하여 그동안의 리워드를 전부 회수한 후,<br/>
                                        새 스테이킹 서비스에서 다시 지갑 연결하여 풀 별로 스테이킹 시작해 주시면 되겠습니다.<br/>
                                        <br/>
                                        라바 NEW PFP NFT로의 교환 및 그동안의 리워드 회수,<br/>
                                        그리고 새 스테이킹 서비스에서 다시 스테이킹 시작하는 모든 과정을 직접 진행해 주셔야 합니다.<br/>
                                        교환과 동시에 자동 예치되는 것이 아님을 알려드립니다.<br/>
                                        <br/>
                                        감사합니다.
                                    </p>
                                </div>
                            </Col>
                            <Col xs={9} md={6}>
                                <div className="text-left">
                                    <p className={styles.popup_msg}>
                                        After exchanging for Larva NEW PFP NFT, the existing Larva NFT will be
                                        automatically burned.<br/>
                                        At the same time, the deposit is automatically released from the larva staking
                                        service,<br/>
                                        and the total amount of rewards harvested with the larva NFT during that time is
                                        automatically returned to Total Mined KANV.<br/>
                                        <br/>
                                        The staking service that can be used with the existing Larva NFT will operate
                                        until noon on
                                        Monday,<br/>
                                        October 31, after which the page will be inaccessible.<br/>
                                        <br/>
                                        So, after exchanging all of them with Lava NEW PFP NFT,<br/>
                                        you can collect all of the rewards from the previous staking service by getting
                                        all Total
                                        Mined KANV as Get All Rewards,<br/>
                                        then connect your wallet again in the new staking service and start staking by
                                        pool.<br/>
                                        <br/>
                                        Exchanging to Larva NEW PFP NFT, collecting rewards, and staking in the new
                                        staking service
                                        must be performed by yourself.<br/>
                                        Please note that it is not automatically deposited at the same time as the
                                        exchange.<br/>
                                        <br/>
                                        Thank you.
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
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
        </>
    )
}

export default LarvaNFTBreeding
