import React from "react";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar";
import Hero from "./Hero";
import "./App.css";
import Ceo from "./ceo.js";
import Ceo2 from "./ceo2.js";
import ScrollableTabsButtonForce from "./parameter3";
import Elearning from "./Elearning";
import ResumeBuilder from "./ResumeBuilder";
import Certifications from "./Certifications";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Elearning />
      <Ceo />
      <ScrollableTabsButtonForce />
      <Certifications />
      <Ceo2/>
      <ResumeBuilder />
      <Footer />
    </>
  );
}

export default App;
