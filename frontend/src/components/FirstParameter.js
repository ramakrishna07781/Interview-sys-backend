import React from 'react';
import icon1 from "../images/icon1.svg";
import icon2 from "../images/icon2.svg";
import icon3 from "../images/icon3.svg";
import icon4 from "../images/icon4.svg";
import icon5 from "../images/icon5.svg";
import icon6 from "../images/icon6.svg";
import icon7 from "../images/icon7.svg";

export default function FirstParameter()
{
    return(
        <>
        <div className="parameter3-container">
            <div className="parameter3-tab">
              <h1 className="parameter3-head">
                <img src={icon1} />
                1st Parameter{" "}
              </h1>
              <p className="parameter3-para">
                parameter determines the amount of text that the model takes.
              </p>
            </div>
            <div class="grid-container">
              <div class="grid-item">
                <p>
                  <img src={icon2} />
                  Parent and sub-issues.{" "}
                  <span>Break larger tasks into smaller issues.</span>
                </p>
              </div>
              <div class="grid-item">
                <p>
                  <img src={icon3} />
                  Automated backlog.{" "}
                  <span>Linear will auto-close and auto-archive issues.</span>
                </p>
              </div>
              <div class="grid-item">
                <p>
                  <img src={icon4} />
                  Custom workflows.{" "}
                  <span>Define unique issues states each team.</span>
                </p>
              </div>
              <div class="grid-item">
                <p>
                  <img src={icon5} />
                  Filters and custom views.{" "}
                  <span>See only what's relevant for you.</span>
                </p>
              </div>
              <div class="grid-item">
                <p>
                  <img src={icon6} />
                  Discussion.{" "}
                  <span>Collaborate on issues without losing context.</span>
                </p>
              </div>
              <div class="grid-item">
                <p>
                  <img src={icon7} />
                  Issue templates.{" "}
                  <span>Guide your team to write effective issues.</span>
                </p>
              </div>
            </div>
          </div>
        </>
    )
}