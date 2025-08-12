import React, { useState } from "react";
import html from "../images/html.svg";
import css from "../images/css.svg";
import js from "../images/JavaScript.svg";
import java from "../images/Java-1.svg";
import python from "../images/Python.svg";
import cpp from "../images/C++.svg";
import go from "../images/Go.svg";
import right from "../images/Frame.svg";
import left from "../images/Frame-1.svg";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import "./Certifications.css";

export default function Certifications() {
  const images = [html, css, js, java, python, cpp, go];

  const [currentPage, setCurrentPage] = useState(0);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, images.length - 1));
    
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  return (
    <div className="Certifications">
      <div className=" Certifications-content">
        <h1 className="certification-head">Comprehensive Certifications Under One Roof</h1>
        <p className="certification-para">
Achieve Recognition: Dive into a curated selection from our extensive
catalog of industry-leading certifications.
        </p>
      </div>
      <div className="pagination-content">

        <div className="image-list" style={{ transform: `translateX(-${currentPage * 30}%)` }}>
          {images.map((image, index) => (
            <img className="pag-img" key={index} src={image} />
          ))}

        </div>

        <div className="buttons">
        <button onClick={handlePrevPage} className="pagination-button">
            <img src={right}/>
          {/* <KeyboardArrowLeftIcon/> */}
        </button>
        <button onClick={handleNextPage} className="pagination-button">
        <img src={left}/>
          {/* <KeyboardArrowRightIcon/> */}
        </button>
    </div>

      </div>
      
    </div>
  );
}
