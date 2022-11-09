import React, {useEffect, useRef, useState} from 'react';
import {POST} from "../../api/api";
import {Modal} from 'react-bootstrap';
import AOS from "aos";
import "aos/dist/aos.css";
import LoadingModal from "../loading_modal/LoadingModal"
import styles from "./LarvaNFTBreeding.module.scss"
import breedIntro from "../../assets/images/breeding/breed_intro.mp4";
import {PAUSABLE_NFT} from "../../utils/abi/PAUSABLE_NFT";
import {BREEDING_ABI} from "../../utils/abi/BREEDING_ABI";
import {DATA_CONTRACT} from "../../utils/abi/DATA_CONTRACT";
import {ERC20_ABI} from "../../utils/abi/ERC20";
import {contracts} from "../../utils/web3/contracts";
import {secondToTime, drawTime} from "../../utils/anvUtils";
import Web3 from "web3";
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
    // 알림창 닫기
    function closeAlert() {
        setShowAlertModal(false);
        setAlerts("");
    }
    // 브리딩 완료 창 닫기
    function closeBreedingResultModal() {
        setShowBreedingResultModal(false);
        setBreedingNftName("");
        setBreedingNftImg("");
    }

    const [firstToken, setFirstToken] = useState({id: '', img: '', character: ''}); // 1번 선택된 토큰 ID
    const [firstHover, setFirstHover] = useState(false); // 1번 선택된 박스 마우스 hover 상태
    const [secondToken, setSecondToken] = useState({id: '', img: '', character: ''}); // 2번 선택된 토큰 ID
    const [secondHover, setSecondHover] = useState(false); // 2번 선택된 박스 마우스 hover 상태
    const [breedingNftName, setBreedingNftName] = useState(""); // 브리딩 성공한 NFT 토큰 ID
    const [breedingNftImg, setBreedingNftImg] = useState(""); // 브리딩 성공한 NFT 토큰 ID 이미지 URL

    const provider = window['klaytn'];
    const caver = new Caver(provider);
    const BREEDING_CONTRACT_ADDRESS = contracts['breeding_contract'][props.networkId];
    const PFP_3D_NFT_CONTRACT_ADDRESS = contracts['pfp_3d_nft_contract'][props.networkId];
    const KANV_CONTRACT_ADDRESS = contracts['kanv_contract'][props.networkId];
    const DATA_CONTRACT_ADDRESS = contracts['data_contract'][props.networkId];
    const breedingContract = new caver.klay.Contract(BREEDING_ABI, BREEDING_CONTRACT_ADDRESS);
    const nftContract = new caver.klay.Contract(PAUSABLE_NFT, PFP_3D_NFT_CONTRACT_ADDRESS);
    const kanvContract = new caver.klay.Contract(ERC20_ABI, KANV_CONTRACT_ADDRESS);
    const dataContract = new caver.klay.Contract(DATA_CONTRACT, DATA_CONTRACT_ADDRESS);
    const breedingKanv = Web3.utils.toWei('500', 'ether')
    // 브리딩에 필요한 부모 토큰 ID 체크
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
    const [legendaryCount, setLegendaryCount] = useState(0); // 남은시간
    // 숫자인지 체크
    const numberCheck = (e) => {
        const regex = /^[0-9\b -]{0,13}$/;
        if (regex.test(e.target.value)) {
            setSearchTokenId(e.target.value);
            setCoolTime(null);
        }
    }

    // 지갑연결 확인
    function walletCheck() {
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
    // 토큰 쿨타임 확인
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
            setCoolTime(coolTime);
        } catch (e) {
            console.log(e);
            setAlerts("Please check the tokenID");
            setShowAlertModal(true);
            return false
        }
        return false
    }

    // 레전더리 쿨타임확인
    async function legendaryCoolTimeCheck() {
        let time, firstCoolTime, SecondCoolTime;
        if ((firstToken.character === 'Pink' || firstToken.character === 'Brown') && (secondToken.character === 'Brown' || secondToken.character === 'Pink')) {
            firstCoolTime = await breedingContract.methods.getCoolTime(PFP_3D_NFT_CONTRACT_ADDRESS, firstToken.id).call().then(e => {
                return e;
            });
            SecondCoolTime = await breedingContract.methods.getCoolTime(PFP_3D_NFT_CONTRACT_ADDRESS, secondToken.id).call().then(e => {
                return e;
            })
            time = parseInt(firstCoolTime) + parseInt(SecondCoolTime);

        }
        if (time > 0) {
            return Math.max(parseInt(firstCoolTime), parseInt(SecondCoolTime));
        } else {
            return null;
        }
    }

    // KANV에 대한 어프로브 확인
    async function approveCheck() {
        const approveAmount = await kanvContract.methods.allowance(props.accounts[0], BREEDING_CONTRACT_ADDRESS).call().then(e => {
            return e;
        });
        if (approveAmount >= breedingKanv) {
            return true;
        } else {
            return false;
        }
    }

    // 브리딩 실행
    async function nftBreeding() {
        if (!breedTokenIdCheck()) {
            return false;
        }
        const legendaryCoolTimeResult = await legendaryCoolTimeCheck(); // 레전더리 쿨타임 확인
        if (legendaryCoolTimeResult !== null) {
            setAlerts("Wait CoolTime\n" + secondToTime(legendaryCoolTimeResult));
            setShowAlertModal(true);
            return false;
        }
        // 어프로브 체크
        if (!await approveCheck()) {
            const balanceAmount = await kanvContract.methods.balanceOf(props.accounts[0]).call();
            if (Number.parseFloat(breedingKanv) > Number.parseFloat(balanceAmount)) {
                setAlerts("The KANV is insufficient.");
                setShowAlertModal(true);
                return false;
            }
            try {
                const gasLimitApprove = await kanvContract.methods.approve(BREEDING_CONTRACT_ADDRESS, breedingKanv).estimateGas({
                    from: props.accounts[0],
                });
                await kanvContract.methods.approve(BREEDING_CONTRACT_ADDRESS, breedingKanv).send({
                    from: props.accounts[0],
                    gas: gasLimitApprove
                });
            } catch (e) {
                console.log(e);
                return false;
            }
        }
        let breedingIdx;
        let breedingResult;
        let breedingError
        let breedingHash = null;
        try {
            // api 호출전 히스토리 요청
            const breedingBeforeResult = await POST(`/api/v1/breeding/log_before`, {
                firstTokenId: firstToken.id,
                secondTokenId: secondToken.id,
                address: props.accounts[0],
            }, props.apiToken);
            if (breedingBeforeResult.result === 'error') {
                throw new Error(breedingBeforeResult.error);
            }
            breedingIdx = breedingBeforeResult.data.idx;
            if (breedingIdx) {
                // 브리딩 실행
                try {
                    const gasLimit = await breedingContract.methods.breeding(PFP_3D_NFT_CONTRACT_ADDRESS, firstToken.id, secondToken.id).estimateGas({
                        from: props.accounts[0],
                    });
                    // const gasLimit = 1000000;
                    const gasPrice = await caver.klay.getGasPrice();
                    breedingResult = await breedingContract.methods.breeding(PFP_3D_NFT_CONTRACT_ADDRESS, firstToken.id, secondToken.id).send({
                        from: props.accounts[0],
                        gas: gasLimit,
                        gasPrice,
                    });
                    console.log(breedingResult); // 브리딩 결과값
                    console.log(`breed Token ID : ${breedingResult.events.Breeded.returnValues[1]}`);
                    const kidsJson = await fetch(`https://metadata-store.klaytnapi.com/1f5d655e-3529-df24-5f0a-65824feec987/larva-kids-${breedingResult.events.Breeded.returnValues[1]}.json`).then((res) => res.json());
                    setBreedingNftName(kidsJson.name);
                    setBreedingNftImg(kidsJson.image);
                    breedingHash = breedingResult.transactionHash;
                    breedIntroPlay(); // 영상재생
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
        setFirstToken({id: '', img: '', character: ''});
        setSecondToken({id: '', img: '', character: ''});
    }

    // 첫번째 선택 초기화
    function initFirstToken() {
        setFirstToken({id: '', img: '', character: ''});
    }

    // 두번째 선택 초기화
    function initSecondToken() {
        setSecondToken({id: '', img: '', character: ''});
    }

    // nft 리스트 출력
    function myNftListOpen(sequence) {
        if (!walletCheck()) {
            return false;
        }
        setSelectBox(true);
        setSelectSequence(sequence);
    }


    useEffect(() => {
        // 애니메이션 활성
        AOS.init({
            duration: 1000
        });
        // 레전더리 갯수
        setInterval(drawTime, 1000);
    }, []);

    // useEffect(() => {
    //     if(dataContract){
    //         async function getLegendaryCount() {
    //             try {
    //                 const count = await dataContract.methods.getAmount(1).call();
    //                 setLegendaryCount(200 - count);
    //             } catch (e) {
    //                 console.log(e);
    //                 return false
    //             }
    //             return false
    //         }
    //         getLegendaryCount();
    //     }
    // }, [dataContract]);

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
                        <h3>
                            남은 레전더리 라바 키즈<br/>
                            <span>{legendaryCount}</span>
                        </h3>
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
                            <input ref={searchTokenIdInput} type="text" name="tokenId" value={searchTokenId}
                                   maxLength="4"
                                   onChange={numberCheck} placeholder={"Please enter Token ID"}/>
                            <button onClick={() => {
                                tokenIdTimeCheck()
                            }}><img src={SearchButton} alt="search button"/></button>
                        </label>
                        {
                            coolTime != null && (
                                <div className={styles.time_box}>
                                    LEGENDARY COOL TIME : <span class="countTimer">{secondToTime(coolTime)}</span>
                                </div>

                            )
                        }
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
                                   userAddress={props.accounts[0]} networkId={props.networkId}
                                   setFirstToken={setFirstToken} breedingContract={breedingContract} PFP_3D_NFT_CONTRACT_ADDRESS={PFP_3D_NFT_CONTRACT_ADDRESS}
                                   firstToken={firstToken} secondToken={secondToken} setSecondToken={setSecondToken}
                                   selectSequence={selectSequence}
                                   setShowLoading={setShowLoading}/>) : (<></>)
            }
        </>
    )
}

export default LarvaNFTBreeding
