import React from "react";
import "./Overlay.css";
import ConnectWallet from "../Navbar/ConnectWallet";

function Overlay(props: any) {
  return (
    <React.Fragment>
      {props.overlayOut ? (
        <div className="overlay">
          <ConnectWallet
            appearOverlay={props.appearOverlay}
            loginWithEth={props.loginWithEth}
            hasAddress={props.hasAddress}
            logoutFromEth={props.logoutFromEth}
          />
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
}

export default Overlay;
