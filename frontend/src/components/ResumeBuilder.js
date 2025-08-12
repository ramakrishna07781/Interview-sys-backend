import React from "react";
import "./resume-builder.css";

export default function Resumebuilder() {
  return (
    <div>
      <hr />
      <div className="resume-builder">
        <div className="ai-logos">
          <div className="ai-logo-box">
                      <div className='animation-line2' ><div className='animation-line1' >
                  {/* <img className="animation-line0" src={logo1} alt="logo" /> */}
                  </div></div>
                        <div className='animation-line2' > <div className='animation-line1' >
                  {/* <img  className="animation-line0" src={logo2} alt="logo" /> */}
                     </div></div>
          </div>
        </div>

        <div className="resume-content content">
          <h1>AI resume builder</h1>
          <p>The Most Efficient AI Resume Creator Online</p>
        </div>

        {/* <img className="resumepic" src={resumepic} alt="logo" /> */}
      </div>
      <hr />
      <div className="Mock-interview">
      <div className='animation-line2' > <div className='animation-line1' >
        {/* <img className="mock-interview-img animation-line0" src={logo3} alt="Mock Interview" /> */}
            </div></div>
        
        <div className="mock-content content">
          <h1 style={{marginTop:'-2.4rem'}}>Mock Interview</h1>
          <p>The meaning of a mock interview is self-explanatory</p>
        </div>
        {/* <img className="resumepic " src={mockinterview} alt="logo" /> */}
      </div>
      <div className="box-3">
      <div className='animation-line2' > <div className='animation-line1' >
        {/* <img className="box-3-img animation-line0"  src={logo4} alt="" /> */}
        </div></div>
        <div className="mock-content content">
          <h1>Built for your future.</h1>
          <p className="box-3-para">
            Experience the most enjoyable, powerful way for you to learn and
            transform your career.
          </p>
        </div>
       {/* <RequestButton text={"Request Early Access"}/> */}
      </div>
    </div>
  );
}
