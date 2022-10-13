import React, {useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap';
import {POST} from "../../../api/api";
import styles from "./SelectNftBoxModal.module.scss"

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
        if (props.selectSequence === 1) {
            props.setFirstTokenId(selectedBox.childNodes[1].childNodes[1].innerText);
            props.setFirstTokenImg(selectedBox.childNodes[0].src);
        } else {
            props.setSecondTokenId(selectedBox.childNodes[1].childNodes[1].innerText);
            props.setSecondTokenImg(selectedBox.childNodes[0].src);
        }
        props.setSelectBox(false);
    }

    useEffect(async () => {
        async function getNft() {
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
                    })
                    setListItem(result.data);
                    setSelectModal(true);
                } else {
                }
            });
        }

        await getNft();

    }, [props.selectBox]);
    return (
        <Modal id={styles.myNftBox} centered size="xs" show={selectModal}
               onHide={() => selectModal(false)}>
            <Modal.Header closeButton>
                MY NFT
            </Modal.Header>
            <Modal.Body>
                <div className={styles.select_nft_box}>
                    {
                        listItem.map((nft, index) => (
                            <>
                                {
                                    nft.selected === true ? (
                                        <div key={nft.tokenId} className={`${styles.nft_box} ${styles.selected_box}`}>
                                            <img src={nft.image} alt={nft.tokenId}/>
                                            <p>TokenID : <span>{parseInt(nft.tokenId, 16)}</span></p>
                                            <span>SELECTED</span>
                                        </div>

                                    ) : (
                                        <div key={nft.tokenId} className={styles.nft_box} onClick={(event) => {
                                            selectNft(event)
                                        }}>
                                            <img src={nft.image} alt={nft.tokenId}/>
                                            <p>TokenID : <span>{parseInt(nft.tokenId, 16)}</span></p>
                                        </div>
                                    )
                                }
                            </>
                        ))
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className={styles.alert_box}>
                <button onClick={() => selectComplete()} className={styles.alert_btn}>
                    Confirm
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default SelectNftBoxModal
