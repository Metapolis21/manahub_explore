import clsx from "clsx";
import React from "react";
import styles from "../../styles.module.css";
import { Button } from "antd";

import LayoutItemContent from "./DashboardLayout/LayoutItemContent";
import DashboardLayoutHeader from "./DashboardLayout/DashboardLayoutHeader";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import Web3 from "web3";
import Constants from "constant";
import { ethers } from "ethers";

const GameDashboardContent = ({ setShow, show }) => {
  const [balance, setBalance] = useState(0);
  const serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;
  const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
  const [isLoading, setIsLoading] = useState(false);
  const abiCollection = JSON.parse(Constants.contracts.NFT_COLLECTION_ABI);
  const addrCollection = Constants.contracts.NFT_COLLECTION_ADDRESS;
  const { Moralis, account, isAuthenticated } = useMoralis();
  Moralis.initialize(appId);
  Moralis.serverURL = serverURL;
  const web3Js = new Web3(
    Web3.givenProvider || "https://data-seed-prebsc-1-s1.binance.org:8545/"
  );
  const [total, setTotal] = useState(0);
  const [NFTs, setNFTs] = useState([]);
  const NFTaddr = Constants.contracts.NFT_COLLECTION_ADDRESS;
  const abiStaking = JSON.parse(Constants.contracts.STAKING_ABI);
  const addrStaking = Constants.contracts.STAKING_ADDRESS;
  const contractProcessor = useWeb3ExecuteFunction();
  const smStaking = new web3Js.eth.Contract(abiStaking, addrStaking);
  // console.log("Nfts", NFTs)
  const claim = async () => {
    setIsLoading(true);
    // console.log('claim');
    const ops = {
      contractAddress: addrStaking,
      functionName: "claimRewards",
      abi: abiStaking,
      params: {},
    };
    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        setIsLoading(false);
        setTotal(0);
      },
      onError: (error) => {
        setIsLoading(false);
        console.error(error);
      },
    });
  };
  let arr = [];
  const getNFTs = async () => {
    const Staking = Moralis.Object.extend("Staking");
    const query = new Moralis.Query(Staking);
    query.equalTo("staker", account);
    query.equalTo("addressNFT", NFTaddr);
    query.equalTo("addressStaking", addrStaking);
    query.equalTo("unstake", false);
    const arrObj = await query.find();
    // console.log("arrObj", arrObj)
    setNFTs(arrObj);
  };

  const getTotal = async () => {
    const res = await smStaking.methods.userStakeInfo(account).call();
    // // console.log(res);
    setTotal(res._availableRewards / 10 ** 18);
  };

  useEffect(() => {
    if (isAuthenticated && account) {
      (async () => {
        await getNFTs();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const provider = new ethers.providers.WebSocketProvider('wss://ws-nd-524-739-052.p2pify.com/9984e6c12c83e092549386bc36509a29');
        const contract = new ethers.Contract(
          addrCollection,
          abiCollection,
          provider
        );
        const balanceOf = await contract.balanceOf(account);
        // console.log("BalanceOf", balanceOf.toString());
        setBalance(balanceOf.toString());
      })();
    } else {
      setNFTs([]);
    }
  }, [account, isAuthenticated]);
  useEffect(() => {
    if (account && isAuthenticated) {
      getTotal();
    } else {
      setTotal(0);
    }
  }, [account, isAuthenticated]);

  return (
    <div className={clsx(styles.gameDashboard)}>
      <DashboardLayoutHeader
        setShow={setShow}
        show={show}
        extraCn={styles.gameDashboardHeaderMobile}
        balance={balance}
      />

      <div className={clsx(styles.gameDashboardTitle)}>Staking</div>

      <div className={clsx(styles.gameDashboardContent)}>
        {NFTs.map((e, index) => (
          <LayoutItemContent
            key={index}
            item={{
              title: e.attributes.name,
              description: e.attributes.description,
              code: "#" + e.attributes.tokenId,
              tokenId: e.attributes.tokenId,
              stakeTime: e.attributes?.stakeTime ?? e.attributes.createdAt,
            }}
            type={e.attributes.type}
            image={e.attributes.image}
          />
        ))}
      </div>

      <div
        className={clsx(styles.gameDashboardFooter, {
          [styles.show]: show,
        })}
      >
        <div>
          <p className={styles.gameDashboardFooterTitle}>Total Rewards</p>
          <div className={clsx("input-text", styles.inputCollectible)}>
            {total.toFixed(5)} {Constants.token.TOKEN_SYMBOL}
          </div>
        </div>

        <div>
          <p className={styles.gameDashboardFooterTitle}>Daily NFTs Staking</p>
          <Button
            block
            disabled={total <= 0}
            loading={isLoading}
            onClick={() => claim()}
          >
            Claim
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameDashboardContent;
