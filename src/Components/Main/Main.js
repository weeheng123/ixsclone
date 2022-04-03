import "./Main.css";
import { ReactComponent as LogoEthereum } from "../../assets/logo_ethereum.svg";
import { ReactComponent as LogoArrows } from "../../assets/logo_arrows.svg";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "@apollo/client";
import { HttpLink } from "apollo-link-http";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import React, { useState, useEffect } from "react";

import { Route as UniRoute, Pair } from "@uniswap/v2-sdk";
const { Token } = require("@uniswap/sdk-core");
const ethers = require("ethers");
const ixsAddress = "0x73d7c860998ca3c01ce8c808f5577d94d545d1b4";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  }),
  fetchOptions: {
    mode: "no-cors",
  },
  cache: new InMemoryCache(),
});

const IXS_QUERY = gql`
  query tokens($tokenAddress: Bytes!) {
    tokens(where: { id: $tokenAddress }) {
      derivedETH
      totalLiquidity
    }
  }
`;

const WETH_PRICE_QUERY = gql`
  query ethPrice {
    bundle(id: "1") {
      ethPrice
    }
  }
`;

function Main() {
  const {
    loading: ethLoading,
    error,
    data: ethPriceData,
  } = useQuery(WETH_PRICE_QUERY);
  const {
    loading: ixsLoading,
    error: ixsError,
    data: ixsData,
  } = useQuery(IXS_QUERY, {
    variables: {
      tokenAddress: "0x73d7c860998ca3c01ce8c808f5577d94d545d1b4",
    },
  });

  const ixsPriceInEth = ixsData && ixsData.tokens[0].derivedETH;
  const ixsTotalLiquidity = ixsData && ixsData.tokens[0].totalLiquidity;
  const ethPriceInUSD = ethPriceData && ethPriceData.bundle.ethPrice;

  useEffect(() => {
    async function fetchPairPrice() {
      const CHAIN_ID = 1;
      // const tokenA = WETH9[CHAIN_ID];
      const tokenA = new Token(CHAIN_ID, wethAddress, 18, "WETH", "WETH");
      const tokenB = new Token(CHAIN_ID, ixsAddress, 18, "IXS", "IXS");
      const pairAddress = Pair.getAddress(tokenA, tokenB);

      const api = new ethers.providers.JsonRpcProvider(
        "https://mainnet.infura.io/v3/42b23a8a71c1428285e81b3bb6dfb60e"
      );

      const contract = new ethers.Contract(
        pairAddress,
        [
          "function getReserves() external view returns(uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
          "function token0() external view returns (address)",
          "function token1() external view returns (address)",
        ],
        api
      );

      const reserves = await contract.getReserves();

      setEthPerIxs((reserves.reserve1 / reserves.reserve0).toPrecision(6));
      setIxsPerEth((reserves.reserve0 / reserves.reserve1).toPrecision(6));
    }

    fetchPairPrice();
  }, []);

  const [ethPerIxs, setEthPerIxs] = useState(0);
  const [ixsPerEth, setIxsPerEth] = useState(0);

  return (
    <React.Fragment>
      <div className="main">
        <div className="container">
          <section className="home">
            <div className="container">
              <div className="header">
                <LogoEthereum />
                <h3>ETH</h3>
              </div>
              <div className="data-feed">
                <div className="left-main">
                  <div className="first-token">
                    <h3>ETH</h3>
                    <h4>ETH per IXS</h4>
                    <h4 className="number">
                      {ethPerIxs === 0 ? "0.000000" : ethPerIxs}
                    </h4>
                  </div>
                  <LogoArrows className="logo-arrow" />
                  <div className="second-token">
                    <h3>IXS</h3>
                    <h4>IXS per ETH</h4>
                    <h4 className="number">
                      {ixsPerEth === 0 ? "0.000000" : ixsPerEth}
                    </h4>
                  </div>
                </div>
                <div className="right-main">
                  <div className="lp-tokens">
                    <h4>IXS price</h4>
                    <h4 className="number">
                      {ixsLoading || ethLoading
                        ? "0.000000000"
                        : "$" +
                          (
                            parseFloat(ixsPriceInEth) *
                            parseFloat(ethPriceInUSD)
                          ).toFixed(4)}
                    </h4>
                  </div>
                  <div className="lp-tokens">
                    <h4>ETH price</h4>
                    <h4 className="number">
                      {ethLoading
                        ? "0.000000000"
                        : "$" + parseFloat(ethPriceInUSD)}
                    </h4>
                  </div>
                  <div className="lp-tokens">
                    <h4>Liquidity Pool Tokens</h4>
                    <h4 className="number">0.000000</h4>
                  </div>
                  <div className="apr">
                    <h4>APR</h4>
                    <h4 className="number">0.000000</h4>
                  </div>
                </div>
              </div>
              <Link to={"/add/liquidity"}>
                <button className="add-liquidity">
                  <h2>Add Liquidity</h2>
                </button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Main;
