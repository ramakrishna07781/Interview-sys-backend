import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './HomePage';
import JobsPage from './JobsPage';
// ...other imports...

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/jobs" element={<JobsPage />} />
        {/* ...other routes... */}
    </Routes>
);

export default AppRoutes;
