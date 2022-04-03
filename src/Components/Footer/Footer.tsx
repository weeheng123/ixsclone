import "./Footer.css";
import Socmed from "./Socmed";

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="left-div">
          <span>
            © 2020-2021 <span className="ixswap">IX Swap</span>. All rights
            reserved.
            <br /> Powered by <span className="underline">FacultyGroup</span>
          </span>
        </div>
        <Socmed />
      </div>
    </footer>
  );
}

export default Footer;
