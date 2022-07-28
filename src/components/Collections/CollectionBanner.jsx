import { Avatar } from 'antd';
import React from 'react';
import styless from './Collections.module.css';
// import FloorPriceIcon from './FloorPriceIcon';
// import { getCollectionsByChain } from "helpers/collection";
import { useMoralis } from "react-moralis";
import { networkCollections } from 'helpers/collection';

import headerData from './header.json';

// const avatarFake =
//   'https://cdn.sanity.io/images/kt6t0x48/production/41e51630c43b9ade112281066bb22327dbc16fcd-2000x2000.jpg';
// const imgFake =
//   'https://cdn.sanity.io/images/kt6t0x48/production/edd4104b305b8275532dda27e6ccb8657108f3e2-1920x768.jpg';

const CollectionBanner = ({ address }) => {

  const { chainId } = useMoralis();
  // const NFTCollections = getCollectionsByChain(chainId);
  const info = networkCollections[chainId]?.find(ele => ele.addrs === address.addrs);
  return (
    <div>
      <div>
        <div className="" style={{display:"flex", height:"250px"}}>
          <div className="slide-vertical st1 mr-20">
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st2">
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st3 ml-20">
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st1 mr-20">
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st2">
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st3 ml-20">
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st1 mr-20">
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st2">
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st3 ml-20">
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          {/* slide 2 */}
          <div className="slide-vertical st1 mr-20">
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st2">
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st3 ml-20">
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st1 mr-20">
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st2">
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st3 ml-20">
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st1 mr-20">
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st2">
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st3 ml-20">
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          {/* slide 3 */}
          <div className="slide-vertical st1 mr-20">
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st2">
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st3 ml-20">
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st1 mr-20">
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st2">
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st3 ml-20">
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st1 mr-20">
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st1.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st2">
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st2.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="slide-vertical st3 ml-20">
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
            <div className="box">
              {headerData.st3.map((img, i) => (
                <div className="img" key={i}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          className={styless.bg}
          style={{ backgroundImage: `url(${info?.banner})` }}
        >
          <Avatar src={info?.image} className={styless.avatar} size={160} />
        </div>
        <div className={styless.bannerContent}>
          <div className={styless.bannerTitle}>{info?.name}</div>
          {/* <div className={styless.createdBy}>
          Created by <span>MetaMints</span>
        </div> */}
          <div className={styless.statics}>
            {/* <Row gutter={{ xs: 12, sm: 32, xl: 64 }}>
            <Col>
              <Space direction="vertical" size={0}>
                <span className={styless.number}>300</span>
                <span className={styless.attr}>Items</span>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size={0}>
                <span className={styless.number}>1</span>
                <span className={styless.attr}>Owners</span>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size={0}>
                <span className={styless.number}>
                  <Space>
                    <FloorPriceIcon className={styless.icon} />
                    300
                  </Space>
                </span>
                <span className={styless.attr}>Floor Price</span>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" size={0}>
                <span className={styless.number}>150.5K</span>
                <span className={styless.attr}>Volume Traded</span>
              </Space>
            </Col>
          </Row> */}
          </div>
          {/* <div className={styless.desc}>
          AI Robotic brings the next level of AI-infused companions to life
          seamlessly
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default CollectionBanner;
