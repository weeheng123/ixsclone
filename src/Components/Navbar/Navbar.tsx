import "./Navbar.css";
import { ReactComponent as LogoIxswap } from "../../assets/logo_ixswap.svg";
import { ReactComponent as LogoUniswap } from "../../assets/logo_uniswap.svg";
import { ReactComponent as LogoWallet } from "../../assets/logo_wallet.svg";
import React, { useState, useEffect } from "react";

function Navbar(props: any) {
  var tempAddress: string;
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (props.address) {
      if (props.address.length > 20) {
        tempAddress =
          props.address.substr(0, 4) +
          "..." +
          props.address.substr(props.address.length - 4, props.address.length);
      }
      setAddress(tempAddress);
    }
  }, [props.hasAddress]);

  return (
    <nav className="nav-bar">
      <div className="container">
        <div className="left-div">
          <LogoIxswap />
        </div>
        <div className="right-div">
          <a>
            <LogoUniswap className="logoUniswap" />
          </a>

          <button className="wallet-container" onClick={props.appearOverlay}>
            <LogoWallet className="logoWallet" />
            <span className="address">
              {props.hasAddress ? address : "Connect Wallet"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
