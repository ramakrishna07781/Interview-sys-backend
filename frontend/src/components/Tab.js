import React from "react";
import "./Tab.css";
import FirstParameter from './FirstParameter'
import SecondParameter from './SecondParameter'
import ThirdParameter from './ThirdParameter'
import FourthParameter from './FourthParameter'
import FifthParameter from './FifthParameter'
import SixthParameter from './SixthParameter'
import SeventhParameter from './SeventhParameter'

const TabContent = ({ currentIndex }) => {
  const tab = [
    <FirstParameter/>,
    <SecondParameter/>,
    <ThirdParameter/>,
    <FourthParameter/>,
    <FifthParameter/>,
    <SixthParameter/>,
    <SeventhParameter/>,
  ];

  return <div className="display">
    {tab[currentIndex]}</div>;
};

export default TabContent;
