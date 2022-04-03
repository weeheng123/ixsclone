import "./ConnectWallet.css";
import { ReactComponent as LogoCross } from "../../assets/logo_cross.svg";
import { ReactComponent as LogoMetamask } from "../../assets/logo_metamask.svg";
import { ReactComponent as LogoWC } from "../../assets/logo_walletconnect.svg";

function ConnectWallet(props: any) {
  return (
    <div className="connect-wallet">
      <div className="connect-wallet-header">
        <h2>Wallet</h2>
        <LogoCross className="cross-logo" onClick={props.appearOverlay} />
      </div>
      <div className="button-container">
        <div
          className={
            props.hasAddress ? "connection-button clicked" : "connection-button"
          }
          onClick={props.hasAddress ? props.logoutFromEth : props.loginWithEth}
        >
          <LogoMetamask className="button-logo" />
          <span>MetaMask</span>
        </div>
        <div className="connection-button">
          <LogoWC className="button-logo" />
          <span>Wallet Connect</span>
        </div>
      </div>
    </div>
  );
}

export default ConnectWallet;
