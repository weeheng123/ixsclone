import React, { Component } from "react";
import { ReactComponent as TgLogo } from "../../assets/logo_telegram.svg";
import { ReactComponent as TwtLogo } from "../../assets/logo_twitter.svg";
import { ReactComponent as MediumLogo } from "../../assets/logo_medium.svg";

class Socmed extends Component {
  constructor(props) {
    super(props);

    const Link = [
      {
        icon: <TgLogo />,
        hyperlink: "https://t.me/ixswapofficial",
      },
      {
        icon: <TwtLogo />,
        hyperlink: "https://twitter.com/IxSwap",
      },
      {
        icon: <MediumLogo />,
        hyperlink: "https://ixswap.medium.com/",
      },
    ];

    this.state = { Link };
  }
  render() {
    return (
      <div className="right-div">
        {this.state.Link.map((object, index) => (
          <a
            className="footer-logo"
            key={index.toString()}
            href={object.hyperlink}
          >
            {object.icon}
          </a>
        ))}
      </div>
    );
  }
}

export default Socmed;
