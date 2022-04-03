import "./Liquidity.css";
import { ReactComponent as LogoCross } from "../../assets/logo_cross.svg";
import { ReactComponent as LogoArrows } from "../../assets/logo_arrows.svg";
import { Pair } from "@uniswap/v2-sdk";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UniV2RouterABI from "../../abi/UniswapV2RouterABI.json";
import IXSTokenABI from "../../abi/IXSTokenABI.json";

const ethers = require("ethers");
const { Token } = require("@uniswap/sdk-core");

function Liquidity() {
  const ixsAddress = "0x73d7c860998ca3c01ce8c808f5577d94d545d1b4";
  const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const uniV2RouterAddress = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";

  const [ethPerIxs, setEthPerIxs] = useState(0);
  const [ixsPerEth, setIxsPerEth] = useState(0);

  const [hasAddress, setHasAddress] = useState(false);
  const [ixsTokenBalance, setIXSTokenBalance] = useState(0);
  const [ethTokenBalance, setETHTokenBalance] = useState(0);

  const [ethAmount, setETHAmount] = useState(0.0);
  const [ixsAmount, setIXSAmount] = useState(0.0);

  var userEthAddress = "";

  function onETHChange(event) {
    event.preventDefault();
    setETHAmount(event.target.value);
    setIXSAmount(event.target.value * ixsPerEth);
  }

  function onIXSChange(event) {
    event.preventDefault();
    setIXSAmount(event.target.value);
    setETHAmount(event.target.value * ethPerIxs);
  }

  function maxAmountETH() {
    if (ixsPerEth !== 0) {
      if (ethTokenBalance === 0) {
        setETHAmount(0);
        setIXSAmount(0);
      } else {
        setETHAmount(ethTokenBalance);
        setIXSAmount(ethTokenBalance * ixsPerEth);
      }
    } else {
      alert("Waiting for IXS per ETH to load...");
    }
  }

  function maxAmountIXS() {
    if (ixsPerEth !== 0) {
      if (ixsTokenBalance === 0) {
        setIXSAmount(0);
        setETHAmount(0);
      } else {
        setIXSAmount(ixsTokenBalance);
        setETHAmount(ixsTokenBalance * ethPerIxs);
      }
    } else {
      alert("Waiting for ETH per IXS to load...");
    }
  }

  function checkHasAddress() {
    userEthAddress = window.localStorage.getItem("userEthAddress");
    if (userEthAddress) {
      setHasAddress(true);
    } else {
      setHasAddress(false);
    }
  }

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

    checkHasAddress();

    async function getAccountTokenBalances() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const ixsTokenContract = new ethers.Contract(
          ixsAddress,
          IXSTokenABI,
          provider
        );
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        var ixsTokenBalance = await ixsTokenContract.balanceOf(signerAddress);
        var ethTokenBalance = await provider.getBalance(signerAddress);
        ethTokenBalance = ethers.utils.formatEther(ethTokenBalance);
        ixsTokenBalance = ethers.utils.formatEther(ixsTokenBalance);
        setIXSTokenBalance(Number(ixsTokenBalance));
        setETHTokenBalance(Number(ethTokenBalance));
      } catch (error) {
        console.log(error);
      }
    }

    getAccountTokenBalances();

    fetchPairPrice();
  }, []);

  const addLiquidity = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const routerContract = new ethers.Contract(
        uniV2RouterAddress,
        UniV2RouterABI,
        provider
      );

      const signer = await provider.getSigner();
      await routerContract.addLiquidity(
        wethAddress,
        ixsAddress,
        ixsAmount,
        ethAmount,
        ixsAmount * 0.9,
        ethAmount * 0.9,
        signer,
        Date.now() + 5 * 60000
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="liquidity-container">
      <div className="container">
        <div className="liquidity-header">
          <h2>Add Liquidity</h2>
          <Link to={"/"}>
            <LogoCross className="cross-logo" />
          </Link>
        </div>
        <div className="liquidity-content">
          <div className="content">
            <div className="content-header">
              <h3>ETH</h3>
              <h4>
                Balance:{" "}
                <span>
                  {ethTokenBalance === 0
                    ? "0.0000000"
                    : ethTokenBalance.toPrecision(6)}
                </span>
              </h4>
            </div>
            <div className="content-converter">
              <input
                className="currency-amount"
                type="number"
                placeholder="0.0"
                onChange={onETHChange}
                value={ethAmount === 0 ? null : ethAmount}
              />
              <button className="max" onClick={maxAmountETH}>
                <h2>max</h2>
              </button>
            </div>
          </div>
          <div className="content">
            <div className="content-header">
              <h3>IXS</h3>
              <h4>
                Balance:{" "}
                <span>
                  {ixsTokenBalance === 0
                    ? "0.0000000"
                    : ixsTokenBalance.toPrecision(6)}
                </span>
              </h4>
            </div>
            <div className="content-converter">
              <input
                className="currency-amount"
                type="number"
                placeholder="0.0"
                onChange={onIXSChange}
                value={ixsAmount === 0 ? null : ixsAmount}
              />
              <button className="max" onClick={maxAmountIXS}>
                <h2>max</h2>
              </button>
            </div>
          </div>
        </div>
        <div className="liquidity-footer">
          <div className="conversion">
            <div className="conversion-left-div">
              <h4>ETH per IXS</h4>
              <h5 className="number">
                {ethPerIxs === 0 ? "0.000000" : ethPerIxs}
              </h5>
            </div>
            <LogoArrows className="logo-arrow" />
            <div className="conversion-right-div">
              <h4>IXS per ETH</h4>
              <h5 className="number">
                {ixsPerEth === 0 ? "0.000000" : ixsPerEth}
              </h5>
            </div>
          </div>
        </div>
        <div className="add-liquidity-button">
          <button className="add-liquidity" onClick={addLiquidity}>
            Add Liquidity
          </button>
        </div>
      </div>
    </div>
  );
}

export default Liquidity;
