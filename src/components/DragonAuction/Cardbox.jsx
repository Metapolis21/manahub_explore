import { Button, Modal, Statistic } from "antd";
import React from "react";
import styless from "./Explores.module.css";
// import imgFake from 'assets/images/img-explore.png';
import ManahubsBoxGif from "assets/images/manahubs-box.gif";
import btnstyles from "./MysteryBox.module.css";
import { useState } from "react";
import {
  useMoralis,
  useMoralisWeb3Api,
  useWeb3ExecuteFunction,
} from "react-moralis";
import Constants from "constant";
import { getCollectionByAddress } from "helpers/collection";
import { checkWalletConnection } from "helpers/auth";
import { ethers } from "ethers";

let clickBuy = false;
let checkInstallMetamask = true;
let system = {};
const Cardbox = () => {
  const { Countdown } = Statistic;
  const deadline = new Date("2022-09-30T07:00:00+07:00"); // Hong Kong timezone
  const [amount, setAmount] = useState("");
  let flag = false;
  if (Date.now() >= deadline) {
    flag = true;
  }
  // flag = true
  const [isNFTSale, setIsNFTSale] = useState(flag);
  const [format, setFormat] = useState(
    "D [days] H [hours] m [minutes] s [seconds]"
  );

  const handleChange = (event) => {
    const result = event.target.value.replace(/\D/g, "");
    let maxAmount = system.dragonMax - system.curTokenId;
    if (parseInt(result) > maxAmount) {
      setAmount(maxAmount);
    } else if (parseInt(result) < 1 || result === "") {
      setAmount(1);
    } else {
      setAmount(result);
    }
  };

  const contractProcessor = useWeb3ExecuteFunction();
  const [loading, setLoading] = useState(false);
  let { Moralis, authenticate, account, isAuthenticated } = useMoralis();
  const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;
  const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
  Moralis.start({ serverUrl, appId });

  const nftCollectionABI = JSON.parse(Constants.contracts.NFT_COLLECTION_ABI);
  const nftCollectionAddr = Constants.contracts.NFT_COLLECTION_ADDRESS;
  if (checkInstallMetamask && document.getElementById("walletConnectAlert")) {
    setTimeout(async () => {
      checkInstallMetamask = false;
      if (typeof window.ethereum !== "undefined") {
        // console.log('MetaMask is installed!');
        checkAuth();
      } else {
        failPurchase("You need to install wallet to use this page!");
        window.open("https://metamask.io/");
      }
    }, 200);
  }
  async function checkAuth() {
    if (!account && document.getElementById("walletConnectAlert")) {
      document.getElementById("walletConnectAlert").click();
      // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // account = accounts[0];

      // account = req[0];
    }
  }

  async function updateRewardRefs(event) {
    console.log("Update rewards");
    console.log("Event", event);
    let amountValue = event.amountVal;

    const Profile = Moralis.Object.extend("profile");
    const query = new Moralis.Query(Profile);
    query.equalTo("address", event.owner);
    const profile = await query.first();
    console.log("Profile", profile?.attributes);
    profile.set(
      "amount",
      profile?.attributes?.amount
        ? profile?.attributes?.amount + amountValue
        : amountValue
    );
    profile.save(null, { useMasterKey: true });
    if (profile?.attributes?.refs) {
      let refs = JSON.parse(profile?.attributes?.refs);
      let price = parseInt(event.price);

      for (let index = 0; index < refs.length; index++) {
        const el = refs[index];
        const queryRef = new Moralis.Query("profile");
        queryRef.equalTo("address", el);
        let refInfo = await queryRef.first();
        const rewardForFirstRef = price * 0.1;
        const indexOfFirstRef = refs.length - 1;

        if (refInfo) {
          let rw =
            index === refs.length - 1
              ? rewardForFirstRef
              : rewardForFirstRef / 2 ** (indexOfFirstRef - index);

          refInfo.set(
            "rewards",
            refInfo?.attributes?.rewards
              ? refInfo?.attributes?.rewards + rw
              : rw
          );
          refInfo.set(
            "commission",
            refInfo?.attributes?.commission
              ? refInfo?.attributes?.commission + rw
              : rw
          );

          refInfo.set(
            "totalValue",
            refInfo?.attributes?.totalValue
              ? refInfo?.attributes?.totalValue + amountValue
              : amountValue
          );
          refInfo.save(null, { useMasterKey: true });
        }
      }
    }
  }
  async function mint() {
    setLoading(true);
    const tokenPrice = ethers.utils.parseEther((amount * Constants.NFT_PRICE).toString());
    console.log("Token price", tokenPrice?.toString());
    const ops = {
      contractAddress: nftCollectionAddr,
      functionName: "mint",
      abi: nftCollectionABI,
      params: {
        _mintAmount: amount,
      },
      msgValue: tokenPrice?.toString(),
    };
    console.log("Options", ops);
    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        updateRewardRefs({
          owner: account,
          price: tokenPrice,
          amountVal: amount * Constants.NFT_PRICE,
        });
        setLoading(false);
        succPurchase();
        clickBuy = false;
      },
      onError: (error) => {
        console.error(error);
        setLoading(false);
        failPurchase(error?.data?.message ?? error?.message ?? "Something went wrong when minting NFT");
      },
    });
  }
  async function handleMintClicked() {
    let enable = true;
    if (enable) {
      if (!account) {
        failPurchase("You need connection to wallet");
      } else {
        if (!clickBuy) {
          clickBuy = true;
          if (!amount || amount === 0) {
            setAmount(1);
          }
          await checkWalletConnection(isAuthenticated, authenticate, mint);
        }
      }
    }
  }
  function pre() {
    // getMaxTokenId();
    let newAmount = amount - 1;
    if (newAmount < 1) {
      setAmount(1);
    } else {
      setAmount(newAmount);
    }
  }
  function next() {
    // getMaxTokenId();
    let newAmount = (amount === "" ? 0 : Number(amount)) + 1;
    let maxAmount = system.dragonMax - system.curTokenId;

    if (newAmount > maxAmount) {
      setAmount(maxAmount);
    } else {
      setAmount(newAmount);
    }
  }
  function succPurchase() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `You have buy this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failPurchase(error) {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      // content: `There was a problem when buy this NFT`
      content: error + "",
    });
    clickBuy = false;
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }
  function handleChangeTimeCountDown(time) {
    if (time <= 60 * 60 * 24 * 1000) {
      setFormat("H [hours] m [minutes] s [seconds]");
    }
  }
  function handleFinishCountDown() {
    setIsNFTSale(true);
  }

  return (
    <div className={styless.cardbox}>
      <div
        className={styless.image}
        style={{ backgroundImage: `url(${ManahubsBoxGif})` }}
      >
        {/* <Avatar src={item.image} className={styless.avatar} size={80} /> */}
      </div>
      <div className={styless.content}>
        <div className={styless.title} style={{ fontFamily: "GILROY " }}>
          Magic Box
        </div>
        <div className={styless.byAuthor} style={{ fontFamily: "GILROY " }}>
          by <span style={{ fontFamily: "GILROY " }}>Manahubs</span>
        </div>
        {isNFTSale ? (
          <>
            <form>
              <Button
                className={btnstyles.exploreBtn}
                loading={loading}
                onClick={() => pre()}
                style={{
                  fontFamily: "GILROY ",
                  width: "15%",
                  textAlign: "center",
                  margin: " 10px",
                  color: " #ff9900",
                  border: "solid 1px #0e0a35",
                  borderRadius: "10px",
                  fontSize: "medium",
                }}
              >
                -
              </Button>
              <input
                type="text"
                id="inputAmount"
                placeholder="Amount"
                pattern="[0-9]*"
                style={{
                  width: "20%",
                  height: "25px",
                  textAlign: "center",
                  margin: " 10px",
                  color: " #ff9900",
                  border: "solid 1px #0e0a35",
                  borderRadius: "10px",
                  fontSize: "medium",
                }}
                value={amount}
                onChange={handleChange}
              />
              <Button
                className={btnstyles.exploreBtn}
                loading={loading}
                onClick={() => next()}
                style={{
                  fontFamily: "GILROY ",
                  width: "15%",
                  textAlign: "center",
                  margin: " 10px",
                  color: " #ff9900",
                  border: "solid 1px #0e0a35",
                  borderRadius: "10px",
                  fontSize: "medium",
                }}
              >
                +
              </Button>
            </form>
            <Button
              className={btnstyles.exploreBtn}
              loading={loading}
              onClick={() => handleMintClicked()}
              style={{ fontFamily: "GILROY " }}
              visible={isNFTSale ? 1 : 0}
            >
              BUY
            </Button>
          </>
        ) : (
          <>
            <div
              className={styless.description}
              style={{ fontFamily: "GILROY " }}
            >
              NFT Sale is Live after:
            </div>
            <Countdown
              onChange={handleChangeTimeCountDown}
              onFinish={handleFinishCountDown}
              value={deadline}
              format={format}
              valueStyle={{
                fontSize: "16px",
                fontWeight: "regular",
                textAlign: "center",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Cardbox;
