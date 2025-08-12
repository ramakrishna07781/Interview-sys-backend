import React, { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TabContent from './Tab';

const ShiftingTabs = () => {
  const tabsData = [
    "Technical Proficiency",
    "Cognitive Abilities",
    "Communication Skills",
    "Interpersonal and Teamwork Skills",
    "Interpersonal and Teamwork Skills",
    "Mock Interview",
    "Cognitive Skills",
  ];

  const [currentIndex,setCurrentIndex] = useState(0);

  const handleTabClick = (index) => {
    setCurrentIndex(index);
  };

  const handleShift = (direction) => {
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (direction === "right" && currentIndex < tabsData.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
        minWidth: "100vw",
        backgroundColor: " rgb(23, 23, 26)",
        overflowX: "auto",
        padding:"-10px"
      }}
    >
      <div
        style={{
          overflowX: "scroll",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {tabsData.map((label, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            style={{
              background: "transparent",
              color: index === currentIndex ? "white" : "gray",
              border: "none",
              cursor: "pointer",
              fontSize: ".9rem",
              padding: "6px",
              textTransform: "capitalize",
              
            }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => handleShift("left")}
          style={{
            background: "transparent",
            color: "gray",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            padding: "13px",
          }}
        >
          <KeyboardArrowLeftIcon />
        </button>
        <button
          onClick={() => handleShift("right")}
          style={{
            background: "transparent",
            color: "gray",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            padding: "14px",
          }}
        >
          <KeyboardArrowRightIcon />
        </button>
      </div>
      <TabContent currentIndex={currentIndex}/>
    </div>
  );
};

export default ShiftingTabs;
