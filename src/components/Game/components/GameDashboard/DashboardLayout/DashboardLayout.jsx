import clsx from "clsx";
import React, { useEffect } from "react";
import styles from "../../../styles.module.css";
import DashboardLayoutHeader from "./DashboardLayoutHeader";
import LayoutItem from "./LayoutItem";
import { useMoralis } from 'react-moralis';
import { useState } from "react";
import Web3 from "web3";
import axios from "axios";
import Constants from "constant";
import { failureModal } from "helpers/modals";
import { ethers } from "ethers";

const DashboardLayout = ({ setShow, show }) => {
  const { account, isAuthenticated } = useMoralis();
  const [balance, setBalance] = useState(0);
  const abiCollection = JSON.parse(Constants.contracts.NFT_COLLECTION_ABI);
  const addrCollection = Constants.contracts.NFT_COLLECTION_ADDRESS;
  const [NFTs, setNFTs] = useState([]);
  const web3Js = new Web3(new Web3.providers.WebsocketProvider('wss://ws-nd-524-739-052.p2pify.com/9984e6c12c83e092549386bc36509a29'));
  const smNFTs = new web3Js.eth.Contract(abiCollection, addrCollection);

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
            tokenURI = `https://${arrStr[0]}.ipfs.${Constants.GATEWAY_HOSTNAME}/${arrStr[1]}`;
          }
          const metadata = (await axios.get(tokenURI)).data;
          if (metadata) {
            // ipfs://[CID]/1.png
            let linkImage = metadata.image.replace('ipfs://', '');
            let arrStr = linkImage.split('/');
            let nameImage = arrStr[1];
            const imageUrl = Constants.GOOGLE_CLOUD_STORAGE_BUCKET + nameImage;
            let item = {
              image: imageUrl,
              description: metadata.description,
              tokenId: tokenId,
              name: metadata.name,
            }
            setNFTs((NFTs) => [...NFTs, item]);
          }
        }
      }
    } catch (error) {
      console.log(error);
      failureModal("Some thing went wrong", error.message);
    }

  };
  useEffect(() => {
    if (isAuthenticated) {
      if (account) {
        setNFTs([]);
        (async () => {
          const provider = new ethers.providers.WebSocketProvider('wss://ws-nd-524-739-052.p2pify.com/9984e6c12c83e092549386bc36509a29');
          const contract = new ethers.Contract(addrCollection, abiCollection, provider);
          const balanceOf = await contract.balanceOf(account);
          console.log("BalanceOf", balanceOf.toString());
          setBalance(balanceOf.toString())
          getNFTs()
        })()
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
        balance={balance}
      />

      <div className={clsx(styles.gameLayoutBody, styles.dasboardLayoutBody)}>
        {
          NFTs.map((e, index) => (
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
              setBalance={setBalance}
            />
          ))
        }
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
