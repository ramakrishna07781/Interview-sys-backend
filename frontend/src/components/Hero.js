import React, { useEffect, useRef } from "react";
// import Typed from "typed.js";
import route from "./images/route.svg";
// import heropic from "../images/main dashboard.svg";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import RequestButton from "./RequestButton";
import "./Hero.css";

export default function Hero() {

  return (
    <>
      <div className="hero">

        <div className="left">
          <div
            className="hero-button"
            variant="outlined"
            style={{
              backgroundColor: "#262728",
              border: "1px solid #3B3C3D",
              textTransform: "capitalize",
              color: "white",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            Launching our Private Beta <KeyboardArrowRightRoundedIcon />
          </div>
          <h1>
            Your Success Journey Begins with <span className="brand">edu.AI</span>
            <div className="typing-div">
            </div>{" "}
          </h1>
          <p>
            Learning, Certifications, AI Resume Builder, Mock Interviews and
            Much More..
          </p>
          {/* <RequestButton text={"Request Early Access"} /> */}
        </div>

        <div className="right">
          <img src={route} alt="" />
        </div>
      </div>
      {/* <img className="heropic animation-line" src={heropic} /> */}

      
    </>
  );
}
