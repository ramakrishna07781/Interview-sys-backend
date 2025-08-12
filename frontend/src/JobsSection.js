import React, { useEffect, useState } from "react";
import axios from "axios";
import './JobsSection.css';

function JobsSection({ username, onApplied, limit }) {
    const [jobs, setJobs] = useState([]);
    const [applied, setApplied] = useState({});

    useEffect(() => {
        axios.get("http://localhost:5000/get-all-job-desc").then(res => setJobs(res.data));
        if (username) {
            axios.get(`http://localhost:5000/get-user-applications?username=${encodeURIComponent(username)}`)
                .then(res => {
                    const appliedRoles = {};
                    res.data.forEach(j => { appliedRoles[j.role] = true; });
                    setApplied(appliedRoles);
                });
        }
    }, [username]);

    const handleApply = (role) => {
        axios.post("http://localhost:5000/apply-job", { username, role })
            .then(() => {
                setApplied({ ...applied, [role]: true });
                if (onApplied) onApplied(role);
            })
            .catch(() => alert("Already applied or error!"));
    };

    const handleWithdraw = (role) => {
        axios.post("http://localhost:5000/withdraw-job", { username, role })
            .then(() => {
                const newApplied = { ...applied };
                delete newApplied[role];
                setApplied(newApplied);
                if (onApplied) onApplied(role);
            })
            .catch(() => alert("Error withdrawing application!"));
    };

    // Limit jobs if limit prop is provided
    const jobsToShow = limit ? jobs.slice(0, limit) : jobs;

    return (
        <div className="jobs-section">
            <h2>Available Jobs</h2>
            <ul>
                {jobsToShow.map(job => (
                    <li key={job.role} className="job-item">
                        <div>
                            <strong>{job.title}</strong> <span>({job.role})</span><br />
                            <span>Skills: {job.skills}</span><br />
                            <span>Location: {job.location}</span>
                        </div>
                        {username && (
                            applied[job.role] ? (
                                <button
                                    onClick={() => handleWithdraw(job.role)}
                                    className="withdraw-btn"
                                >
                                    Withdraw
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleApply(job.role)}
                                    className="apply-btn"
                                >
                                    Apply
                                </button>
                            )
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default JobsSection;
