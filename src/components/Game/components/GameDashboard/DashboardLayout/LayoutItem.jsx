import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "../../../styles.module.css";
import { Button } from "antd";
import { useState } from "react";
import { useMoralis } from 'react-moralis';
import Constants from "constant";
import { checkWalletConnection } from "helpers/auth";
import { failureModal } from "helpers/modals";
import { ethers } from "ethers";

const LayoutItem = ({ item, type, image }) => {
  const { Moralis, authenticate, account, isAuthenticated } = useMoralis();
  const serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;
  const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
  Moralis.initialize(appId);
  Moralis.serverURL = serverURL;
  const addrStaking = Constants.contracts.STAKING_ADDRESS;
  const abiStaking = JSON.parse(Constants.contracts.STAKING_ABI);
  const addrCollection = Constants.contracts.NFT_COLLECTION_ADDRESS;
  const abiCollection = JSON.parse(Constants.contracts.NFT_COLLECTION_ABI);
  const [isLoading, setIsLoading] = useState(false);

  const saveStakingInfo = async (tokenId) => {
    const Staking = Moralis.Object.extend("Staking");
    const query = new Moralis.Query(Staking);
    query.equalTo("tokenId", tokenId);
    query.equalTo("staker", account);
    query.equalTo("addressNFT", addrCollection);
    query.equalTo("addressStaking", addrStaking);
    console.log("Query", query)
    const result = await query.first();
    console.log("Result", result)
    if (!result) {
      const staking = new Staking()
      staking.set("tokenId", tokenId);
      staking.set("staker", account);
      staking.set("addressNFT", addrCollection);
      staking.set("addressStaking", addrStaking);
      staking.set("image", image);
      staking.set("type", type);
      staking.set("unstake", false);
      staking.set("name", item.title);
      staking.set("stakeTime", new Date());
      staking.set("description", item.description);
      await staking.save();
    }
    else {
      result.set("stakeTime", new Date());
      result.set("unstake", false);
      await result.save();
    }
    console.log("Save success")
    setIsLoading(false)
  }


  async function stakeNFT() {
    const tokenId = item?.tokenId.toString()
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const userSigner = await provider.getSigner()
      console.log("User signer", userSigner);
      const contractNFT = new ethers.Contract(addrCollection, abiCollection, userSigner)
      const contractStaking = new ethers.Contract(addrStaking, abiStaking, userSigner)
      console.log("Approve tokenId", tokenId)
      const txApprove = await contractNFT.approve(addrStaking, tokenId);
      await txApprove.wait();
      console.log("Tx approve hash", txApprove.hash);
      console.log("Stake tokenId", tokenId);
      const txStake = await contractStaking.stake([tokenId])
      await txStake.wait();
      console.log("Tx stake hash", txStake.hash);
      await saveStakingInfo(tokenId)
      setIsLoading(false)
      window.location.reload()
    } catch (err) {
      setIsLoading(false);
      const error = { err };
      console.log("Stake Error", error);
      const reason = error?.err?.reason?.toString() ?? error?.err?.message?.toString();
      if (reason?.length !== 0) {
        if (reason === "execution reverted: Can't stake tokens you don't own!") {
          failureModal("Stake Error", "You don't own this nft")
        } else {
          failureModal("Stake Error", reason)
        }

      }
    }
    // const ops = {
    //   contractAddress: addrCollection,
    //   functionName: "approve",
    //   abi: abiCollection,
    //   params: {
    //     to: addrStaking,
    //     tokenId: item?.tokenId
    //   },
    // };
    // await contractProcessor.fetch({
    //   params: ops,
    //   onSuccess: () => {
    //     console.log("Approve success");
    //     (async () => {
    //       await staking()
    //     })()
    //   },
    //   onError: (error) => {
    //     setIsLoading(false)
    //     failureModal("Approve failed", error?.data?.message ?? error.message ?? "Something went wrong");
    //     console.log("Approve failed");
    //     return new Promise((resolve, reject) => reject(error))
    //   }
    // });
  }

  async function handleStakingClicked() {
    setIsLoading(true);
    await checkWalletConnection(isAuthenticated, authenticate, stakeNFT)
  }
  return (
    <div className={clsx([styles.layoutItem, styles[type]])}>
      {/* <span className={styles.code}>{item.code}</span>
      <span className={styles.type}>{item.code}</span> */}
      <img alt="" src={image} />

      <div className={styles.layoutItemRight}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.description}>{item.description}</p>
        {/* <div
          className={clsx("input-text")}
          style={{ marginBottom: 5, marginTop: "auto" }}
        >
          10
        </div> */}

        <Button
          style={{ marginBottom: 5, marginTop: "auto" }}
          className={styles.startStakingBtn}
          loading={isLoading}
          onClick={() => handleStakingClicked()}
          block
        >
          Start Staking
        </Button>
      </div>
    </div>
  );
};

LayoutItem.propTypes = {
  type: PropTypes.oneOf(["ssr", "sr", "r"]),
};

export default LayoutItem;
