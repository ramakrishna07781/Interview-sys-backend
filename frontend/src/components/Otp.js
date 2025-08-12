import React, { useState } from 'react';
import RequestButton from './RequestButton';
import './Otp.css';

function Otp() {
    const [otpValues, setOtpValues] = useState(Array(6).fill(''));
    const inputRefs = Array.from({ length: 6 });

    const handleChange = (index, value) => {
        const sanitizedValue = value.replace(/[^0-9]/g, '');

        setOtpValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = sanitizedValue;
            return newValues;
        });

        if (sanitizedValue && index < 5 && inputRefs[index + 1]) {
            inputRefs[index + 1].focus();
        }
    };

    return (
        <div className="otp-container">
            <h2>OTP Verification</h2>
            <p>OTP sent to your Email Address</p>
            <form>
                {otpValues.map((value, index) => (
                    <input
                        key={index}
                        type="text"
                        className="otpinput"
                        maxLength="1"
                        placeholder='0'
                        value={value}
                        onChange={(e) => handleChange(index, e.target.value)}
                        ref={(el) => (inputRefs[index] = el)}
                    />
                ))}
            </form>
            <p>Didn't Receive code</p>
            <a href="#" className="resend-link">
                Resend Code
            </a>
            <RequestButton text={'Confirm'} style={{ width: '12rem' }} />
        </div>
    );
}

export default Otp;
