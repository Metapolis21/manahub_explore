import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "../../../styles.module.css";
import { Button } from "antd";
import Web3 from "web3";
import abiStaking from "../abi_staking";
import abiNFTs from "../abi_nfts";
import { useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';


const LayoutItem = ({ item, type, image }) => {
  const { Moralis, authenticate, account } = useMoralis();
  const addrNFTs = "0x505D5fF937bB7E377Ed94b99A992db40A0276B67";
  const addrStaking = "0x1b22c2332DB992D1c8052C3B02D432Ca5D70dbC2";
  const contractProcessor = useWeb3ExecuteFunction();
  const [isDisable, setIsDisable] = useState(false);
  

  async function staking() {
    const ops = {
      contractAddress: addrStaking,
      functionName: "stake",
      abi: abiStaking,
      params: {
        _tokenIds: [item.tokenId]
      },
    };
    await contractProcessor.fetch({
      params: ops,
      onSuccess: async() => {
        const Staking = Moralis.Object.extend("Staking");
        const staking = new Staking();
        staking.set("tokenId", item.tokenId);
        staking.set("staker", account);
        staking.set("addressNFT", addrNFTs);
        staking.set("addressStaking", addrStaking);
        staking.set("image", image);
        staking.set("type", type);
        staking.set("unstake", false);
        staking.set("name", item.name);
        staking.set("description", item.description);
        await staking.save();
        window.location.reload();
      }
    });
  }

  async function approveAll() {
    console.log(item);
    authenticate({
      onSuccess: async () => {
        const ops = {
          contractAddress: addrNFTs,
          functionName: "setApprovalForAll",
          abi: abiNFTs,
          params: {
            operator: addrStaking,
            approved: true
          },
        };
        await contractProcessor.fetch({
          params: ops,
          onSuccess: async () => {
            await staking();
          }
        });
      },
      onError: () => {
        console.log('err');
      }
    })
  }

  async function stake() {
    setIsDisable(true);
    approveAll();
  }
  return (
    <div className={clsx([styles.layoutItem, styles[type]])}>
      <span className={styles.code}>{item.code}</span>
      <span className={styles.type}>{item.code}</span>
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
          disabled={isDisable}
          onClick={() => stake()}
          block
        >
          Start Staking
        </Button>

        {/* <Button className={styles.sellOnMpBtn} block>
          Sell on Marketplace
        </Button> */}
      </div>
    </div>
  );
};

LayoutItem.propTypes = {
  type: PropTypes.oneOf(["ssr", "sr", "r"]),
};

export default LayoutItem;
