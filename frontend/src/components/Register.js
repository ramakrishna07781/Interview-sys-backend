import React from "react";
import TextField from "@mui/material/TextField";
import { Button, Checkbox } from "@mui/material";
import DeleteIcon from "@mui/material/IconButton";
import "./Register.css";
import logo from "../images/Group 33524.svg";
import RequestButton from "./RequestButton";

export default function Register() {
  return (
    <>
      <img src={logo} alt="logo" />
      <div className="signup-container">
        <div className="welcome">
          <h1>User Registration</h1>
        </div>
        <label for="email" className="label">
          First Name*
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          required
        />

        <label for="password" className="label">
          Last Name*
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          required
        />

        <label for="email" className="label">
          Email* (OTP Will Send To Email)
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          required
        />

        <label for="password" className="label">
          Password*
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          required
        />

        <label for="email" className="label">
          Confirm password*
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          required
        />

        <input type="checkbox" id="termsCheckbox" />
        <label for="termsCheckbox">I agree to the terms and conditions</label>

        <RequestButton text={"Register"} style={{ width: "12rem" }} />
      </div>
    </>
  );
}
