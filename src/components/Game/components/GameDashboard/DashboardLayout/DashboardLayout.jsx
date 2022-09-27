import clsx from "clsx";
import React, {useEffect} from "react";
import styles from "../../../styles.module.css";
import DashboardLayoutHeader from "./DashboardLayoutHeader";
import LayoutItem from "./LayoutItem";
import { useMoralis } from 'react-moralis';
import { useState } from "react";
import Web3 from "web3";
import axios from "axios";
import Constants from "constant";

const DashboardLayout = ({ setShow, show }) => {
  const web3Js = new Web3(new Web3.providers.WebsocketProvider('wss://ws-nd-524-739-052.p2pify.com/9984e6c12c83e092549386bc36509a29'));
  const { account, isAuthenticated } = useMoralis();
  const [NFTs, setNFTs] = useState([]);
  const abiCollection = JSON.parse(Constants.contracts.NFT_COLLECTION_ABI);
  const addrCollection = Constants.contracts.NFT_COLLECTION_ADDRESS;
  const smNFTs = new web3Js.eth.Contract(abiCollection, addrCollection);
  let arr = [];

  const getNFTs = async () => {
    try {
      if (account && smNFTs) {
        let balance = await smNFTs.methods.balanceOf(account).call();
        for (let i = 0; i < balance; i++) {
          let tokenId = await smNFTs.methods.tokenOfOwnerByIndex(account, i).call();
          let tokenURI = await smNFTs.methods.tokenURI(tokenId).call();
          if (tokenURI.includes('ipfs://bafy')) {
            tokenURI = tokenURI.replace('ipfs://', '');
            let arrStr = tokenURI.split('/');
            tokenURI = 'https://'+ arrStr[0]+'.ipfs.nftstorage.link/'+arrStr[1];
          }
          const metadata = (await axios.get(tokenURI)).data;
          // console.log(metadata);
          if (metadata) {
            let linkImage = metadata.image.replace('ipfs://', '');
            let arrStr = linkImage.split('/');
            linkImage = 'https://'+ arrStr[0]+'.ipfs.nftstorage.link/'+arrStr[1];
            let item = {
              image: linkImage,
              description: metadata.description,
              tokenId: tokenId,
              name: metadata.name,
            }
            arr.push(item);
          }

        }
        setNFTs(arr);
      }
    } catch (error) {
      console.log(error);
    }

  };
  useEffect(() => {
    if (isAuthenticated) {
      if (account) {
        getNFTs();
      }
    } else {
      setNFTs([]);
    }
  }, [account, isAuthenticated]);

  return (
    <div
      className={clsx(styles.gameLayout, styles.gameDashboardLayout, {
        [styles.show]: show,
      })}>
      <DashboardLayoutHeader
        show={show}
        setShow={setShow}
        extraCn={styles.gameDashboardHeaderDesktop}
      />

      <div className={clsx(styles.gameLayoutBody, styles.dasboardLayoutBody)}>
        {
          NFTs.map((e,index) => (
            <LayoutItem
              key={index}
              item={{
                title: e.name,
                description: e.description,
                code: "#" + e.tokenId,
                tokenId: e.tokenId,
              }}
              type="sr"
              image={e.image}
            />
          ))
        }
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
