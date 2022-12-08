import clsx from "clsx";
import React, { useCallback, useEffect } from "react";
import styles from "../../../styles.module.css";
import DashboardLayoutHeader from "./DashboardLayoutHeader";
import LayoutItem from "./LayoutItem";
import { useMoralis } from "react-moralis";
import { useState } from "react";
import axios from "axios";
import Constants from "constant";
import { failureModal } from "helpers/modals";
import { ethers } from "ethers";

const DashboardLayout = ({ setShow, show }) => {
  const { account, isAuthenticated } = useMoralis();
  // const { data: NFTBalances, isFetching } = useNFTBalances();
  const [balance, setBalance] = useState(0);
  const addrCollection = Constants.contracts.NFT_COLLECTION_ADDRESS;
  const abiCollection = JSON.parse(Constants.contracts.NFT_COLLECTION_ABI);
  const [NFTs, setNFTs] = useState([]);
  // comment this
  // const web3Js = new Web3(
  //   new Web3.providers.WebsocketProvider(
  //     "wss://ws-nd-524-739-052.p2pify.com/9984e6c12c83e092549386bc36509a29"
  //   )
  // );
  // const contract = useCallback(() => {
  //   return contract;
  // }, [addrCollection, abiCollection]);
  const getNFTs = useCallback(async () => {
    if (account) {
      console.log('window.ethereum', window.ethereum)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("provider", provider)
      const signer = await provider.getSigner();
      console.log("signer", signer)
      const contract = new ethers.Contract(addrCollection, abiCollection, signer);
      try {
        // const sm = new ethers.Contract(addrCollection, ['function balanceOf(address) external view returns (uint256)'], signer);
        // console.log("account", await sm.balanceOf(account))
        let balance = parseInt((await contract.balanceOf(account)).toString());
        setBalance(balance);
        console.log("balance", balance)
        for (let i = 0; i < balance; i++) {
          let tokenId = await contract.tokenOfOwnerByIndex(account, i);
          let tokenURI = await contract.tokenURI(tokenId);
          if (tokenURI.includes("ipfs://bafy")) {
            tokenURI = tokenURI.replace("ipfs://", "");
            let arrStr = tokenURI.split("/");
            tokenURI = `https://${arrStr[0]}.ipfs.${Constants.GATEWAY_HOSTNAME}/${arrStr[1]}`;
          }
          const metadata = (await axios.get(tokenURI)).data;
          if (metadata) {
            // ipfs://[CID]/1.png
            let linkImage = metadata.image.replace("ipfs://", "");
            let arrStr = linkImage.split("/");
            let nameImage = arrStr[1];
            const imageUrl = Constants.GOOGLE_CLOUD_STORAGE_BUCKET + nameImage;
            let item = {
              image: imageUrl,
              description: metadata.description,
              tokenId: tokenId,
              name: metadata.name,
            };

            setNFTs((NFTs) => [...NFTs, item]);
          }
        }
      } catch (error) {
        // console.log(error);
        failureModal("Some thing went wrong", error.message);
      }
    }
  }, [abiCollection, account, addrCollection]);

  useEffect(() => {
    // console.log("isAuthenticated", isAuthenticated);
    if (isAuthenticated && account) {
      getNFTs();
    }
  }, [isAuthenticated, account]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     if (account && NFTBalances) {
  //       setNFTs([]);
  //       const nfts = NFTBalances.result;

  //       const nftsOfCollection = nfts.filter((nft) => {
  //         return nft.token_address === addrCollection.toLowerCase();
  //       });
  //       // console.log("nftsOfCollection", nftsOfCollection);
  //       const nftMapped = nftsOfCollection
  //         .map((nft) => {
  //           if (nft.metadata) {
  //             let linkImage = nft.metadata.image.replace("ipfs://", "");
  //             let arrStr = linkImage.split("/");
  //             let nameImage = arrStr[1];
  //             const imageUrl =
  //               Constants.GOOGLE_CLOUD_STORAGE_BUCKET + nameImage;
  //             let item = {
  //               image: imageUrl,
  //               description: nft.metadata.description,
  //               tokenId: nft.token_id,
  //               name: nft.metadata?.name,
  //             };
  //             // console.log(item);
  //             return item;
  //           }
  //         })
  //         .filter((nft) => nft);
  //       const nftMappeds = nftsOfCollection.map((nft) => {
  //         if (nft.metadata) {
  //           let linkImage = nft.metadata.image.replace("ipfs://", "");
  //           let arrStr = linkImage.split("/");
  //           let nameImage = arrStr[1];
  //           const imageUrl = Constants.GOOGLE_CLOUD_STORAGE_BUCKET + nameImage;
  //           let item = {
  //             image: imageUrl,
  //             description: nft.metadata.description,
  //             tokenId: nft.token_id,
  //             name: nft.metadata?.name,
  //           };
  //           // console.log(item);
  //           return item;
  //         }
  //       });
  //       setNFTs(nftsOfCollection);
  //       setBalance(nftsOfCollection.length);
  //     }
  //   } else {
  //     setNFTs([]);
  //   }
  // }, [account, isAuthenticated, NFTBalances]);

  return (
    <div
      className={clsx(styles.gameLayout, styles.gameDashboardLayout, {
        [styles.show]: show,
      })}
    >
      <DashboardLayoutHeader
        show={show}
        setShow={setShow}
        extraCn={styles.gameDashboardHeaderDesktop}
        balance={balance}
      />

      {/* {// console.log("NFTBalances", NFTBalances)} */}

      <div className={clsx(styles.gameLayoutBody, styles.dasboardLayoutBody)}>
        {NFTs.map((e, index) => (
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
        ))}
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
