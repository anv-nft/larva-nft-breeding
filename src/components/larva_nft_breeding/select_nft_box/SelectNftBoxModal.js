import React, {useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap';
import {POST} from "../../../api/api";
import styles from "./SelectNftBoxModal.module.scss"
import iconX from "../../../assets/images/icon/icon_x_s.png";
import {secondToTime} from "../../../utils/anvUtils";
function SelectNftBoxModal(props) {
    const [selectModal, setSelectModal] = useState(false);
    const [listItem, setListItem] = useState([]);
    const [selectedNft, setSelectedNft] = useState("");

    function selectNft(e) {
        const box = e.currentTarget;
        if (selectedNft !== "") {
            selectedNft.classList.remove(styles.active);
        }
        setSelectedNft(box);
        box.classList.add(styles.active);
    }

    function selectComplete() {
        if (props.selectSequence === 1) {
            props.setFirstToken({
                id: selectedNft.childNodes[1].childNodes[1].innerText,
                img: selectedNft.childNodes[0].src,
                character: selectedNft.childNodes[2].innerText,
            });
        } else {
            props.setSecondToken({
                id: selectedNft.childNodes[1].childNodes[1].innerText,
                img: selectedNft.childNodes[0].src,
                character: selectedNft.childNodes[2].innerText,
            });

        }
        props.setSelectBox(false);
    }

    useEffect(() => {
        async function getNft() {
            props.setShowLoading(true);
            // const nftAddress = props.PFP_3D_NFT_CONTRACT_ADDRESS;
            const token = localStorage.getItem('aniverse_token');
            const address = props.userAddress;
            await POST(`/api/v1/breeding/getNft`, {
                address,
            }, token).then(async (result) => {
                if (result.result === 'success') {
                    const nftList = result.data;
                    for (let index = 0; index < nftList.length; index++) {
                        if (props.firstToken.character === nftList[index].character || props.secondToken.character === nftList[index].character) {
                            nftList[index].status = 'same character';
                        }
                        if ('0x' + parseInt(props.firstToken.id).toString(16) === nftList[index].tokenId) {
                            nftList[index].status = 'selected';
                        }
                        if ('0x' + parseInt(props.secondToken.id).toString(16) === nftList[index].tokenId) {
                            nftList[index].status = 'selected';
                        }
                        if(nftList[index].character === 'Pink' || nftList[index].character === 'Brown'){
                            try{
                                const coolTime = await props.breedingContract.methods.getCoolTime(props.PFP_3D_NFT_CONTRACT_ADDRESS, nftList[index].tokenId).call().then(e => {
                                    return e;
                                })
                                if(coolTime){
                                    if(parseInt(coolTime) > 0){
                                        nftList[index].cooltime = secondToTime(coolTime);
                                    }
                                }
                            }catch (e){
                            }
                        }
                    }
                    setListItem(result.data);
                    setSelectModal(true);
                } else {
                }
            });
            props.setShowLoading(false);
        }
        getNft();
    }, [props.selectBox]);
    return (
        <Modal id={styles.myNftBox} centered size="xs" show={selectModal}
               onHide={() => props.setSelectBox(false)}>
            <Modal.Body>
                <div className={styles.select_nft_title}>
                    <h3>
                        My NFT Collection book
                        <div>
                            {(selectedNft) ? (
                                <div className={styles.on_status} onClick={() => selectComplete()}>
                                    Select
                                </div>
                            ) : (
                                <div className={styles.off_status}>
                                    0 / 1
                                </div>
                            )}
                            <img onClick={() => props.setSelectBox(false)} src={iconX} alt="close icon"/>
                        </div>

                    </h3>

                </div>
                <div className={styles.select_nft_box}>
                    {
                        listItem.map((nft) => (
                            (nft.status) ? (
                                <div key={nft.tokenId} className={`${styles.nft_box} ${styles.selected_box}`}>
                                    <img className={styles.nft_img} src={nft.image} alt={nft.tokenId}/>
                                    <span>#<span>{parseInt(nft.tokenId, 16)}</span> Larva</span>
                                    <span className={styles.hide}>{nft.character}</span>
                                    {
                                        (nft.cooltime) &&
                                        <span className={styles.coolTime}>
                                            LEGENDARY COOL TIME<br/>
                                            <span className={`countTimer`}>{nft.cooltime}</span>
                                        </span>
                                    }
                                    <div className={styles.selected_dim}>{nft.status}</div>
                                </div>
                            ) : (
                                <div key={nft.tokenId} className={styles.nft_box} onClick={(event) => {
                                    selectNft(event)
                                }}>
                                    <img className={styles.nft_img} src={nft.image} alt={nft.tokenId}/>
                                    <span>#<span>{parseInt(nft.tokenId, 16)}</span> Larva</span>
                                    <span className={styles.hide}>{nft.character}</span>
                                    {
                                        (nft.cooltime) &&
                                        <span className={styles.coolTime}>
                                            LEGENDARY COOL TIME<br/>
                                            <span className={`countTimer`}>{nft.cooltime}</span>
                                        </span>
                                    }
                                </div>
                            )
                        ))
                    }
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default SelectNftBoxModal
