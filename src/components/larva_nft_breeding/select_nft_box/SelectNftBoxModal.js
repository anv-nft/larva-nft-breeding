import React, {useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap';
import {POST} from "../../../api/api";
import styles from "./SelectNftBoxModal.module.scss"
import iconX from "../../../assets/images/icon/icon_x_s.png";
function SelectNftBoxModal(props) {
    const [selectModal, setSelectModal] = useState(false);
    const [listItem, setListItem] = useState([]);
    const [selectedBox, setSelectedBox] = useState("");

    function selectNft(e) {
        const box = e.currentTarget;
        if (selectedBox !== "") {
            selectedBox.classList.remove(styles.active);
        }
        console.log(box.childNodes[0].src);
        setSelectedBox(box);
        box.classList.add(styles.active);
    }

    function selectComplete() {
        console.log(selectedBox.childNodes[1]);
        console.log(selectedBox.childNodes[1].childNodes[1]);
        console.log(selectedBox.childNodes[1].childNodes[1].innerText);
        if (props.selectSequence === 1) {
            props.setFirstTokenId(selectedBox.childNodes[1].childNodes[1].innerText);
            props.setFirstTokenImg(selectedBox.childNodes[0].src);
        } else {
            props.setSecondTokenId(selectedBox.childNodes[1].childNodes[1].innerText);
            props.setSecondTokenImg(selectedBox.childNodes[0].src);
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
            }, token).then((result) => {
                console.log(result);
                if (result.result === 'success') {
                    result.data.forEach((key, value) => {
                        if ('0x' + parseInt(props.firstTokenId).toString(16) === key.tokenId) {
                            result.data[value].selected = true;
                        }
                        if ('0x' + parseInt(props.secondTokenId).toString(16) === key.tokenId) {
                            result.data[value].selected = true;
                        }
                        if ('0x' + parseInt(props.secondTokenId).toString(16) === key.tokenId) {
                            result.data[value].selected = true;
                        }
                    })
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
                            {(selectedBox) ? (
                                <div className={styles.on_status} onClick={() => selectComplete()}>
                                    breed
                                </div>
                            ):(
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
                            (nft.selected === true) ? (
                                <div key={nft.tokenId} className={`${styles.nft_box} ${styles.selected_box}`}>
                                    <img className={styles.nft_img} src={nft.image} alt={nft.tokenId}/>
                                    <span>#<span>{parseInt(nft.tokenId, 16)}</span> Larva</span>
                                    <span>SELECTED</span>
                                </div>

                            ) : (
                                <div key={nft.tokenId} className={styles.nft_box} onClick={(event) => {
                                    selectNft(event)
                                }}>
                                    <img className={styles.nft_img} src={nft.image} alt={nft.tokenId}/>
                                    <span>#<span>{parseInt(nft.tokenId, 16)}</span> Larva</span>
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
