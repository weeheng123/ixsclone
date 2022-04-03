import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "../Navbar/Navbar";
import Background from "../Background/Background";
import Footer from "../Footer/Footer";
import Overlay from "./Overlay";
import { ethers } from "ethers";
import Main from "../Main/Main";
import Liquidity from "../Main/Liquidity";
import { ApolloProvider } from "@apollo/client";
import { client } from "../Main/Main";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const { Token } = require("@uniswap/sdk-core");
const ixsAddress = "0x73d7c860998ca3c01ce8c808f5577d94d545d1b4";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

function App() {
  const [overlayOut, setOverlayOut] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const [address, setAddress] = useState("");
  var userEthAddress: string;

  const appearOverlay = function () {
    setOverlayOut(!overlayOut);
  };

  useEffect(() => {
    if (!window.ethereum) {
      alert("No Metamask detected. Please install.");
    }
    if (window.localStorage.getItem("userEthAddress")) {
      userEthAddress = window.localStorage.getItem("userEthAddress");
      setAddress(userEthAddress);
      setHasAddress(true);
    }
  });

  async function loginWithEth() {
    if (window.ethereum) {
      console.log("hi");
      const ether = new ethers.providers.Web3Provider(window.ethereum);
      try {
        await window.ethereum.enable();
        const accounts = await ether.listAccounts();
        window.localStorage.setItem("userEthAddress", accounts[0]);
        setAddress(accounts[0]);
        setHasAddress(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("No ETH browser extension detected.");
    }
  }

  function logoutFromEth() {
    window.userEthAddress = "";
    window.localStorage.removeItem("userEthAddress");
    setHasAddress(false);
    setAddress("");
  }

  return (
    <React.Fragment>
      <Router>
        <ApolloProvider client={client}>
          <Background />
          <Navbar
            appearOverlay={appearOverlay}
            address={address}
            hasAddress={hasAddress}
          />
          <Routes>
            <Route path="/add/liquidity" element={<Liquidity />} />
            <Route path="/" element={<Main />} />
          </Routes>

          <Footer />
          <Overlay
            overlayOut={overlayOut}
            appearOverlay={appearOverlay}
            loginWithEth={loginWithEth}
            hasAddress={hasAddress}
            logoutFromEth={logoutFromEth}
          />
        </ApolloProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
