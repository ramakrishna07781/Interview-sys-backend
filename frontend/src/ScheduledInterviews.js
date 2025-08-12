import React, { useEffect, useState } from "react";
import axios from "axios";
import './ScheduledInterviews.css';

function ScheduledInterviews({ username, onStartInterview }) {
    const [scheduled, setScheduled] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (username) {
            setLoading(true);
            axios.get(`http://localhost:5000/get-scheduled-interviews?username=${encodeURIComponent(username)}`)
                .then(res => setScheduled(res.data))
                .finally(() => setLoading(false));
        }
    }, [username]);

    const handleCancel = (role) => {
        axios.post('http://localhost:5000/cancel-scheduled-interview', { username, role })
            .then(() => setScheduled(scheduled.filter(s => s.role !== role)));
    };

    return (
        <div className="scheduled-section">
            <h2>Scheduled Interviews</h2>
            {loading ? (
                <div>Loading...</div>
            ) : scheduled.length === 0 ? (
                <div>No interviews currently. Interviews can be scheduled by admin.</div>
            ) : (
                <ul>
                    {scheduled.map((item, i) => (
                        <li key={i} className="scheduled-item">
                            <span>{item.role}</span>
                            <button className="start-btn" onClick={() => onStartInterview(item.role)}>
                                Start AI Interview
                            </button>
                            <button className="cancel-btn" onClick={() => handleCancel(item.role)}>
                                Cancel
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ScheduledInterviews;
