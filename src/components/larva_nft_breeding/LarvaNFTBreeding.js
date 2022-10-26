import React, {useEffect, useRef, useState} from 'react';
import {POST} from "../../api/api";
import {Modal, Col, Container, Row,} from 'react-bootstrap';
import AOS from "aos";
import "aos/dist/aos.css";
import LoadingModal from "../loading_modal/LoadingModal"
import styles from "./LarvaNFTBreeding.module.scss"
import breedIntro from "../../assets/images/breeding/breed_intro.mp4";
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
        setBreedingNftName("");
        setBreedingNftImg("");
    }

    const [firstToken, setFirstToken] = useState({id:'',img:'',character:''}); // 1번 선택된 토큰 ID
    const [firstHover, setFirstHover] = useState(false); // 1번 선택된 박스 마우스 hover 상태
    const [secondToken, setSecondToken] = useState({id:'',img:'',character:''}); // 2번 선택된 토큰 ID
    const [secondHover, setSecondHover] = useState(false); // 2번 선택된 박스 마우스 hover 상태
    const [breedingNftName, setBreedingNftName] = useState(""); // 브리딩 성공한 NFT 토큰 ID
    const [breedingNftImg, setBreedingNftImg] = useState(""); // 브리딩 성공한 NFT 토큰 ID 이미지 URL

    const provider = window['klaytn'];
    const caver = new Caver(provider);
    const BREEDING_CONTRACT_ADDRESS = contracts['breeding_contract'][props.networkId];
    const PFP_3D_NFT_CONTRACT_ADDRESS = contracts['pfp_3d_nft_contract'][props.networkId];
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
    const [coolTime, setCoolTime] = useState(null); // 남은시간
    // 숫자인지 체크
    const numberCheck = (e) => {
        const regex = /^[0-9\b -]{0,13}$/;
        if (regex.test(e.target.value)) {
            setSearchTokenId(e.target.value);
            setCoolTime(null);
        }
    }
    // 지갑연결 확인
    function walletCheck(){
        console.log(props.accounts[0]);
        if (props.accounts[0] === undefined) {
            setAlerts("Please connect wallet.");
            setShowAlertModal(true);
            return false;
        }
        return true;
    }
    // 쿨타임 토큰아이디 체크
    function searchTokenIdCheck() {
        if (searchTokenIdInput.current.value === "") {
            setAlerts("Please enter your token ID.");
            setShowAlertModal(true);
            searchTokenIdInput.current.focus();
            return false;
        }
        return true;
    }

    function secondToTime(seconds) {
        let hour = parseInt(seconds/3600);
        let min = parseInt((seconds%3600)/60);
        let sec = seconds%60;
        if (hour.toString().length==1) hour = "0" + hour;
        if (min.toString().length==1) min = "0" + min;
        if (sec.toString().length==1) sec = "0" + sec;
        return hour + ":" + min + ":" + sec;
    }
    async function tokenIdTimeCheck() {
        if (!walletCheck()) {
            return false;
        }
        if (!searchTokenIdCheck()) {
            return false;
        }
        try {
            const coolTime = await breedingContract.methods.getCoolTime(PFP_3D_NFT_CONTRACT_ADDRESS, searchTokenId).call().then(e => {
                return e;
            })
            console.log(coolTime[0]);
            setCoolTime(coolTime[0]);
        } catch (e) {
            console.log(e);
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
        let breedingError
        let breedingHash = null;
        let alertMsg = `Token ID ${firstToken.id} + ${secondToken.id} breed Success`; // 에러메세지
        try {
            // api 호출전 히스토리 요청
            const breedingBeforeResult = await POST(`/api/v1/breeding/log_before`, {
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
                    // const gasLimit = await breedingContract.methods.breeding(props.accounts[0],firstToken.id, secondToken.id).estimateGas({
                    //     from: props.accounts[0],
                    // })
                    const gasLimit = 1000000
                    const gasPrice = await caver.rpc.klay.getGasPrice();
                    breedingResult = await breedingContract.methods.breeding(PFP_3D_NFT_CONTRACT_ADDRESS,firstToken.id, secondToken.id).send({
                        from: props.accounts[0],
                        gas: gasLimit,
                        gasPrice,
                    });
                    console.log(breedingResult); // 브리딩 결과값
                    // {
                    //     "blockHash": "0x40542f0a004616c3dd2dd91224773a6bf6620a7e729156942a2d897f2796e8b3",
                    //     "blockNumber": 105102194,
                    //     "contractAddress": null,
                    //     "effectiveGasPrice": "0x5d21dba00",
                    //     "from": "0x05c462b4014e148ed4524a1eb3bb8cab75ec0735",
                    //     "gas": "0xf4240",
                    //     "gasPrice": "0xba43b7400",
                    //     "gasUsed": 254565,
                    //     "input": "0x14d849b80000000000000000000000007957753231959287b22685a4d7f40d262c556b6f00000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000d05",
                    //     "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000810000040000000020000000000000000008000000001000000008000000000000000000000000000000000000000000000000020000000000000000000800000000000000040000000090000000000008000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000002000000000000000000000008000000000000000000000000000020000000000000000000000000000000000000000000000000001000000400000000",
                    //     "nonce": "0x9e",
                    //     "senderTxHash": "0x4c02c5f07affea9f8c8da664b2e58ed63b9e6ef539b0470371b15a905beea4f8",
                    //     "signatures": [
                    //     {
                    //         "V": "0x7f5",
                    //         "R": "0x55522373020960ac30f9e865d651793d372ee8a89f6f0cb09a76a508206955da",
                    //         "S": "0x508232b58de60969b8a84ee72c65f45890320d9a4411327595612a8b44475369"
                    //     }
                    // ],
                    //     "status": true,
                    //     "to": "0x066ccfa3f04220724481628a3032bd6ae53b1387",
                    //     "transactionHash": "0x4c02c5f07affea9f8c8da664b2e58ed63b9e6ef539b0470371b15a905beea4f8",
                    //     "transactionIndex": 0,
                    //     "type": "TxTypeLegacyTransaction",
                    //     "typeInt": 0,
                    //     "value": "0x0",
                    //     "events": {
                    //     "0": {
                    //         "address": "0xdf95b2aBD60EA66A530485a460eC199E0455208a",
                    //             "blockNumber": 105102194,
                    //             "transactionHash": "0x4c02c5f07affea9f8c8da664b2e58ed63b9e6ef539b0470371b15a905beea4f8",
                    //             "transactionIndex": 0,
                    //             "blockHash": "0x40542f0a004616c3dd2dd91224773a6bf6620a7e729156942a2d897f2796e8b3",
                    //             "logIndex": 0,
                    //             "id": "log_8cd49628",
                    //             "returnValues": {},
                    //         "signature": null,
                    //             "raw": {
                    //             "data": "0x",
                    //                 "topics": [
                    //                 "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                    //                 "0x0000000000000000000000000000000000000000000000000000000000000000",
                    //                 "0x00000000000000000000000005c462b4014e148ed4524a1eb3bb8cab75ec0735",
                    //                 "0x000000000000000000000000000000000000000000000000000000000000000a"
                    //             ]
                    //         }
                    //     },
                    //     "Breeded": {
                    //         "address": "0x066CcfA3f04220724481628A3032bd6aE53b1387",
                    //             "blockNumber": 105102194,
                    //             "transactionHash": "0x4c02c5f07affea9f8c8da664b2e58ed63b9e6ef539b0470371b15a905beea4f8",
                    //             "transactionIndex": 0,
                    //             "blockHash": "0x40542f0a004616c3dd2dd91224773a6bf6620a7e729156942a2d897f2796e8b3",
                    //             "logIndex": 1,
                    //             "id": "log_8758d726",
                    //             "returnValues": {
                    //             "0": "0x05c462B4014E148eD4524a1eB3bb8cAB75eC0735",
                    //                 "1": "10",
                    //                 "2": "1",
                    //                 "tokenOwner": "0x05c462B4014E148eD4524a1eB3bb8cAB75eC0735",
                    //                 "tokenId": "10",
                    //                 "_breedingType": "1"
                    //         },
                    //         "event": "Breeded",
                    //             "signature": "0x466e7676a69a4f354fee5532512019a096d1b19c5e5770d92ab2bd904e92e6f0",
                    //             "raw": {
                    //             "data": "0x00000000000000000000000005c462b4014e148ed4524a1eb3bb8cab75ec0735000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000001",
                    //                 "topics": [
                    //                 "0x466e7676a69a4f354fee5532512019a096d1b19c5e5770d92ab2bd904e92e6f0"
                    //             ]
                    //         }
                    //     }
                    // }
                    // }
                    // const kidsJson = await fetch(`https://metadata-store.klaytnapi.com/1f5d655e-3529-df24-5f0a-65824feec987/larva_${breedingResult.tokenId}.json`).then((res) => res.json());
                    const kidsJson = await fetch(`https://metadata-store.klaytnapi.com/1f5d655e-3529-df24-5f0a-65824feec987/larva_1000.json`).then((res) => res.json());
                    setBreedingNftName(kidsJson.name);
                    setBreedingNftImg(kidsJson.image);
                    breedingHash = breedingResult.transactionHash;
                    breedIntroPlay();
                } catch (e) {
                    breedingError = e.message;
                    console.log(breedingError);
                    setAlerts("breeding Fail ");
                    setShowAlertModal(true);
                    setShowBreedingModal(false);
                }
                // api 호출후 히스토리 요청
                try {
                    const breedingAfterResult = await POST(`/api/v1/breeding/log_after`, {
                        address: props.accounts[0],
                        breedingIdx,
                        txHash: breedingHash,
                        errorMsg: breedingError,
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
    // nft 리스트 출력
    function myNftListOpen(sequence) {
        if (!walletCheck()) {
            return false;
        }
        setSelectBox(true);
        setSelectSequence(sequence);
    }
    async function test(){
        const kidsJson = await fetch(`https://metadata-store.klaytnapi.com/1f5d655e-3529-df24-5f0a-65824feec987/larva_1000.json`).then((res) => res.json());
        setBreedingNftName(kidsJson.name);
        setBreedingNftImg(kidsJson.image);
        setShowBreedingResultModal(true);
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
                                <button onClick={() => breedTokenIdCheck()}
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
                            <input ref={searchTokenIdInput} type="text" name="tokenId" value={searchTokenId} maxLength="4"
                                   onChange={numberCheck} placeholder={"Please enter Token ID"}/>
                            <button onClick={() => {
                                tokenIdTimeCheck()
                            }}><img src={SearchButton} alt="search button"/></button>
                        </label>
                        {
                            coolTime != null && (
                                <div className={styles.time_box}>
                                    {`남은 시간 ${secondToTime(coolTime)}`}
                                </div>

                            )
                        }
                        <button onClick={() => test()}
                                className={styles.breeding_btn}><img src={BreedingOnButton}
                                                                     alt="breeding button"/></button>
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
                        <span>{breedingNftName}</span>
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
