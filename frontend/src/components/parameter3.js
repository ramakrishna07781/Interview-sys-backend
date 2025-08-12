import * as React from "react";
import checklist from "../images/Group 237767.svg";
import icon1 from "../images/icon1.svg";
import icon2 from "../images/icon2.svg";
import icon3 from "../images/icon3.svg";
import icon4 from "../images/icon4.svg";
import icon5 from "../images/icon5.svg";
import icon6 from "../images/icon6.svg";
import icon7 from "../images/icon7.svg";
import most_complete from "../images/The Most Complete.svg";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ShiftingTabs from "./Tabs.js";
import "./parameter3.css";

export default function ScrollableTabsButtonForce() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="parameter-container">
      <div className="parameter-box">
        <div className="parameter-box-1">
          <div className="parameter-box-11"></div>
          <div className="parameter-box-12"></div>
        </div>
        <div className="parameter-box-2">
          <div className="parameter-box-21"></div>
          <div className="parameter-box-22">
                    <div className='animation-line2' >
                    <div className='animation-line1' >
            <img className="parameter-box-img animation-line0" src={checklist} />
                    </div>
                    </div>
            <div className="parameter-head-content ">
              <div>
              <h1>7 - Parameters Test</h1>
              <p>
                A 7-parameter test offers comprehensive insights with precision,
                leaving no stone unturned in evaluating complex variables.
              </p></div>
            </div>
            <h2 className="parameter-tagline">
              <h3 className="chrome">The Most Complete</h3>
              {/* <div  className="tagline-animation"></div> */}
              {/* <img src={most_complete} /> */}
            </h2>
          </div>
        </div>
        <div className="parameter-box-3"></div>
      </div>
      <ShiftingTabs />
    </div>
  );
}
