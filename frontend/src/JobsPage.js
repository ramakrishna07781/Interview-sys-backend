import React from "react";
import Navbar from "./components/Navbar";
import JobsSection from "./JobsSection";
import Footer from "./components/Footer";

function JobsPage() {
    const username = localStorage.getItem('username');
    return (
        <>
            <Navbar />
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <JobsSection username={username} />
            </div>
            <Footer />
        </>
    );
}

export default JobsPage;
