import React, {useEffect, useRef, useState} from 'react';
import {POST} from "../../api/api";
import {Modal, Col, Container, Row,} from 'react-bootstrap';
import AOS from "aos";
import "aos/dist/aos.css";
import LoadingModal from "../loading_modal/LoadingModal"
import styles from "./LarvaNFTBreeding.module.scss"
import breedIntro from "../../assets/images/breeding/breed_intro.mp4";
import {ERC721} from "../../utils/abi/ERC721";
import {PAUSABLE_NFT} from "../../utils/abi/PAUSABLE_NFT";
import {BREEDING_ABI} from "../../utils/abi/BREEDING_ABI";
import {contracts} from "../../utils/web3/contracts";
import Caver from "caver-js";
import SelectNftBoxModal from "./select_nft_box/SelectNftBoxModal";
import VisualBackground from "../../assets/images/breeding/back.jpg";
import VisualLogo from "../../assets/images/breeding/logo.png";
import VisualCharacter01 from "../../assets/images/breeding/breeding_visual_character_01.png";
import VisualCharacter02 from "../../assets/images/breeding/breeding_visual_character_02.png";
import VisualCharacter03 from "../../assets/images/breeding/breeding_visual_character_03.png";
import BreedingPlusIcon from "../../assets/images/icon/icon_plus.png";
import BreedingXIcon from "../../assets/images/icon/icon_x.png";
import BreedingOffLine from "../../assets/images/breeding/bar_off.png";
import BreedingOnLine from "../../assets/images/breeding/bar_on_01.png";
import BreedingOnLine2 from "../../assets/images/breeding/bar_on_02.png";
import BreedingOffButton from "../../assets/images/breeding/heart_01.png";
import BreedingOnButton from "../../assets/images/breeding/heart_02.png";
import SearchButton from "../../assets/images/icon/icon_search.png";
import {Link} from "react-router-dom";


function LarvaNFTBreeding(props) {
    const [showLoading, setShowLoading] = useState(false); // 로딩 모달
    const [selectBox, setSelectBox] = useState(false); // 셀렉트 박스
    const [selectSequence, setSelectSequence] = useState(0); // 1,2 토큰 구분

    const [showAlertModal, setShowAlertModal] = useState(false); // 알림창 모달
    const [showBreedingModal, setShowBreedingModal] = useState(false); // 브리딩 확인 모달
    const [showBreedingResultModal, setShowBreedingResultModal] = useState(false); // 브리딩 완료 모달
    const [alerts, setAlerts] = useState(""); // 알림 메세지
    function closeAlert() {
        setShowAlertModal(false);
        setAlerts("");
    }
    function closeBreedingResultModal() {
        setShowBreedingResultModal(false);
        setBreedingNftTokenId("");
        setBreedingNftImg("");
    }

    const [firstToken, setFirstToken] = useState({id:'',img:'',character:''}); // 1번 선택된 토큰 ID
    const [firstHover, setFirstHover] = useState(false); // 1번 선택된 박스 마우스 hover 상태
    const [secondToken, setSecondToken] = useState({id:'',img:'',character:''}); // 2번 선택된 토큰 ID
    const [secondHover, setSecondHover] = useState(false); // 2번 선택된 박스 마우스 hover 상태
    const [breedingNftTokenId, setBreedingNftTokenId] = useState(""); // 브리딩 성공한 NFT 토큰 ID
    const [breedingNftImg, setBreedingNftImg] = useState(""); // 브리딩 성공한 NFT 토큰 ID 이미지 URL

    const provider = window['klaytn'];
    const caver = new Caver(provider);
    // const CURRENT_NFT_CONTRACT_ADDRESS = contracts['current_nft_contract'][props.networkId];
    // const REVEAL_CONTRACT_ADDRESS = contracts['reveal_contract'][props.networkId];
    const BREEDING_CONTRACT_ADDRESS = contracts['breeding_contract'][props.networkId];
    const PFP_3D_NFT_CONTRACT_ADDRESS = contracts['pfp_3d_nft_contract'][props.networkId];
    // const currentNftContract = new caver.klay.Contract(ERC721, CURRENT_NFT_CONTRACT_ADDRESS);
    const breedingContract = new caver.klay.Contract(BREEDING_ABI, BREEDING_CONTRACT_ADDRESS);
    const nftContract = new caver.klay.Contract(PAUSABLE_NFT, PFP_3D_NFT_CONTRACT_ADDRESS);

    function breedTokenIdCheck() {
        if (firstToken.id === "" || secondToken.id === "") {
            setAlerts("Please select your NFT.");
            setShowAlertModal(true);
            return false;
        }
        return true;
    }

    const searchTokenIdInput = useRef(); // 타임 검색용 토큰 ID
    const [searchTokenId, setSearchTokenId] = useState(""); // 타임 검색용 토큰 ID
    // 숫자인지 체크
    const numberCheck = (e) => {
        const regex = /^[0-9\b -]{0,13}$/;
        if (regex.test(e.target.value)) {
            setSearchTokenId(e.target.value);
        }
    }

    function searchTokenIdCheck() {
        if (searchTokenIdInput.current.value === "") {
            setAlerts("Please enter your token ID.");
            setShowAlertModal(true);
            searchTokenIdInput.current.focus();
            return false;
        }
        return true;
    }

    async function tokenIdTimeCheck() {
        if (!searchTokenIdCheck()) {
            return false;
        }
        try {
            const coolTime = await breedingContract.methods.getCoolTime(PFP_3D_NFT_CONTRACT_ADDRESS, searchTokenId).call().then(e => {
                return e;
            });
            console.log(coolTime);
        } catch (e) {
            setAlerts("Please check the tokenID");
            setShowAlertModal(true);
            return false
        }
        return false
    }
    // 브리딩 실행
    async function nftBreeding() {
        if (!breedTokenIdCheck()) {
            return false;
        }
        let breedingIdx;
        let breedingResult;
        let alertMsg = `Token ID ${firstToken.id} + ${secondToken.id} breed Success`; // 에러메세지
        try {
            // api 호출전 히스토리 요청
            const breedingBeforeResult = await POST(`/api/v1/larvaBreeding/log_before`, {
                firstTokenId: firstToken.id,
                secondTokenId: secondToken.id,
                address: props.accounts[0],
            }, props.apiToken);
            console.log(breedingBeforeResult)
            if (breedingBeforeResult.result === 'error') {
                throw new Error(breedingBeforeResult.error);
            }
            breedingIdx = breedingBeforeResult.data.idx;
            if(breedingIdx){
                // 브리딩 실행
                try {
                    const gasLimit = await breedingContract.methods.breed(firstToken.id, secondToken.id).estimateGas({
                        from: props.accounts[0],
                    })
                    const gasPrice = await caver.rpc.klay.getGasPrice();
                    breedingResult = await breedingContract.methods.breed(firstToken.id, secondToken.id).send({
                        from: props.accounts[0],
                        gas: gasLimit,
                        gasPrice,
                    });
                    console.log(breedingResult); // 브리딩 결과값
                    setBreedingNftTokenId(""); // todo : 완료 토큰 및 이미지
                    setBreedingNftImg("");
                    breedIntroPlay();
                } catch (e) {
                    console.log(e);
                    setAlerts("breeding Fail ");
                    setShowAlertModal(true);
                    setShowBreedingModal(false);
                }
                // api 호출후 히스토리 요청
                try {
                    const breedingAfterResult = await POST(`/api/v1/larvaBreeding/log_after`, {
                        breedingIdx,
                        txHash: breedingResult.transactionHash,
                        address: props.accounts[0],
                    }, props.apiToken);
                    console.log(breedingAfterResult)
                    if (breedingAfterResult.result === 'error') {
                        throw new Error(breedingAfterResult.error);
                    }

                } catch (e) {
                    console.log(e);
                }
            }
        } catch (e) {
            console.log(e);
            setAlerts("breeding History Save Fail ");
            setShowAlertModal(true);
            setShowBreedingModal(false);
        }



        return true;
    }
    const [breedIntroStatus, setBreedIntroStatus] = useState(false);
    // 성공시 영상 재생
    function breedIntroPlay() {
        const breedIntro = document.getElementById('breed_intro');
        setBreedIntroStatus(true);
        setShowBreedingResultModal(true);
        initSelected()
        breedIntro.play();
    }
    // 전체 선택초기화
    function initSelected() {
        setShowBreedingModal(false);
        setFirstToken({id:'',img:'',character:''});
        setSecondToken({id:'',img:'',character:''});
    }
    // 첫번째 선택 초기화
    function initFirstToken() {
        setFirstToken({id:'',img:'',character:''});
    }
    // 두번째 선택 초기화
    function initSecondToken() {
        setSecondToken({id:'',img:'',character:''});
    }
    function myNftListOpen(sequence) {
        console.log(props.accounts);
        if (props.accounts[0]) {
            setSelectBox(true);
            setSelectSequence(sequence);
        } else {
            alert('지갑을 연결해주세요.');
        }

    }


    useEffect(() => {
        // 애니메이션 활성
        AOS.init({
            duration: 1000
        });
    }, []);

    return (
        <>
            <section className={styles.visual_section}>
                <img className={styles.background_img} src={VisualBackground} alt="Visual Background"/>
                <img className={styles.visual_logo} src={VisualLogo} alt="VisualLogo"/><br/>
                <Link data-aos="zoom-out" to="/" className={styles.hrefButton}>
                    Home
                </Link>
                <img data-aos="fade-up" data-aos-duration="1000"
                     data-aos-anchor-placement="top-bottom"
                     className={`${styles.characterImg01} ${styles.characterImg}`} src={VisualCharacter01}
                     alt="VisualCharacter01"/>
                <img data-aos="fade-up" data-aos-duration="1000"
                     data-aos-anchor-placement="top-bottom"
                     className={`${styles.characterImg02} ${styles.characterImg}`} src={VisualCharacter02}
                     alt="VisualCharacter02"/>
                <img data-aos="fade-up" data-aos-duration="1000"
                     data-aos-anchor-placement="top-bottom"
                     className={`${styles.characterImg03} ${styles.characterImg}`} src={VisualCharacter03}
                     alt="VisualCharacter03"/>
            </section>
            <section className={styles.breeding_nft}>
                <div className={styles.content_box}>
                    <h3 className={styles.content_title}>How to Breed Larva Kids NFT</h3>
                    <div className={styles.content_info}>
                        <p>
                            각각 다른 2가지 캐릭터 Larva NFT를 사용하여<br/>
                            총 2,000개의 Larva Kids NFT를 브리딩 할 수 있습니다.<br/>
                            그 중 200개의 한정 레전더리 Larva Kids NFT를 ‘Brown’과 ‘Pink’로<br/>
                            브리딩 할 수 있으며, 선착순으로 마감됩니다.<br/>
                            마감 이후 부터는 일반 Larva Kids NFT 브리딩만 가능합니다.<br/>
                        </p>
                    </div>
                    <div className={styles.select_view_box}>
                        {(firstToken.img) ? (
                            <div className={styles.nft_box} onClick={() => {
                                initFirstToken()
                            }} onMouseEnter={() => setFirstHover(true)} onMouseLeave={() => setFirstHover(false)}>
                                <img className={styles.nft_img} src={firstToken.img} alt={firstToken.id}/>
                                <span>#{firstToken.id} Larva</span>
                                <div className={`${styles.hover_box} ${firstHover && styles.show_display}`}>
                                    <img src={BreedingXIcon} alt="icon"/>
                                    <p>클릭 시 NFT 선택이 해제됩니다.</p>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.select_box} onClick={() => {
                                myNftListOpen(1)
                            }}>
                                <div>
                                    <img src={BreedingPlusIcon} alt="plus_icon"/>
                                    <p>NFT를 선택해주세요.</p>
                                </div>
                            </div>
                        )}
                        <div className={styles.status_box}>
                            {(firstToken.id) ? (
                                (firstToken.id && secondToken.id) ? (
                                    <img src={BreedingOnLine2} alt="status ready"/>
                                ) : (
                                    <img src={BreedingOnLine} alt="status on"/>
                                )
                            ) : (
                                <img src={BreedingOffLine} alt="status off"/>
                            )}
                            {firstToken.id && secondToken.id ? (
                                <button onClick={() => setShowBreedingModal(true)}
                                        className={styles.breeding_btn}><img src={BreedingOnButton}
                                                                             alt="breeding button"/></button>
                            ) : (
                                <button onClick={() => alert("NFT를 선택해주세요.")}
                                        className={styles.breeding_btn}><img src={BreedingOffButton}
                                                                             alt="breeding button"/></button>
                            )}
                            {(secondToken.id) ? (
                                (firstToken.id && secondToken.id) ? (
                                    <img src={BreedingOnLine2} alt="status ready"/>
                                ) : (
                                    <img src={BreedingOnLine} alt="status on"/>
                                )
                            ) : (
                                <img src={BreedingOffLine} alt="status off"/>
                            )}
                        </div>
                        {(secondToken.img) ? (
                            <div className={styles.nft_box} onClick={() => {
                                initSecondToken()
                            }} onMouseEnter={() => setSecondHover(true)} onMouseLeave={() => setSecondHover(false)}>
                                <img className={styles.nft_img} src={secondToken.img} alt={secondToken.id}/>
                                <span>#{secondToken.id} Larva</span>
                                <div className={`${styles.hover_box} ${secondHover && styles.show_display}`}>
                                    <img src={BreedingXIcon} alt="icon"/>
                                    <p>클릭 시 NFT 선택이 해제됩니다.</p>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.select_box} onClick={() => {
                                myNftListOpen(2)
                            }}>
                                <div>
                                    <img src={BreedingPlusIcon} alt="plus_icon"/>
                                    <p>NFT를 선택해주세요.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <section className={styles.breeding_nft}>
                <div className={styles.content_box}>
                    <h3 className={styles.content_title}>Check Breeding Possibilities</h3>
                    <div>
                        <label className={styles.input_box}>
                            <span>Token ID</span>
                            <input ref={searchTokenIdInput} type="text" name="tokenId" value={searchTokenIdInput} maxLength="4"
                                   onChange={numberCheck} placeholder={"Please enter Token ID"}/>
                            <button onClick={() => {
                                tokenIdTimeCheck()
                            }}><img src={SearchButton} alt="search button"/></button>
                        </label>
                        <div className={styles.time_box}>
                            {'사용 불가능'}<br/>
                            {'남은 시간 : 00:00:00'}
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
            {/*브리딩확인 모달*/}
            <Modal centered size="xs" show={showBreedingModal}
                   onHide={() => setShowBreedingModal(false)} className={styles.breeding_modal}>
                <div className={styles.breeding_confirm}>
                    <h3>Breed</h3>
                    <p className={styles.alert_msg}>
                        {firstToken.id} + {secondToken.id}<br/>
                        Do you want to proceed<br/>
                        with Breeding?
                        {/*<span className={styles.alert_msg_span}>※ 뭐나올지 모름~</span>*/}
                    </p>
                    <button onClick={() => setShowBreedingModal(false)} className={styles.alert_btn}>
                        Cancel
                    </button>
                    <button onClick={() => nftBreeding()} className={`${styles.alert_btn} ${styles.point_color}`}>
                        OK
                    </button>
                </div>
            </Modal>
            {/*브리딩완료 모달*/}
            <Modal centered size="xs" show={showBreedingResultModal}
                   onHide={() => closeBreedingResultModal()} className={styles.breeding_result_modal}>
                <div className={styles.breeding_confirm}>
                    <div className={styles.nft_box}>
                        <img className={styles.nft_img} src={breedingNftImg} alt="breeding NFT"/>
                        <span>#{breedingNftTokenId} Larva</span>
                    </div>

                    <button onClick={() => closeBreedingResultModal()}
                            className={`${styles.alert_btn} ${styles.point_color}`}>
                        OK
                    </button>
                </div>
            </Modal>

            <LoadingModal showLoading={showLoading} setShowLoading={setShowLoading}/>

            {selectBox ? (
                <SelectNftBoxModal selectBox={selectBox} setSelectBox={setSelectBox} nftContract={nftContract}
                                   userAddress={props.accounts[0]} setFirstToken={setFirstToken}
                                   firstToken={firstToken} secondToken={secondToken} setSecondToken={setSecondToken}
                                   selectSequence={selectSequence}
                                   setShowLoading={setShowLoading}/>) : (<></>)
            }
        </>
    )
}

export default LarvaNFTBreeding
