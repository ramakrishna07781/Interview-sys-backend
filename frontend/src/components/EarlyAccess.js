import React from 'react'
import './Login.css';
import logo from '../images/Group 33524.svg';
import { Link } from 'react-router-dom'
import Input from './Input';
import RequestButton from './RequestButton';

export default function Login() {
    return (
        <>
            <center><img src={logo} alt='logo' style={{ padding: '3rem' }} /></center>
            <div className="login-container">
                <center><h3 style={{ color: '#4245cb' }}>Or</h3></center>
                <label for="email" className='label'>Email address*</label><br></br>
                <Input placeholder={'Name'} type={'text'} /><br></br>

                <label for="password" className='label'>Password*</label><br></br>
                <Input placeholder={'Enter email address'} type={'email'} />

                <center><RequestButton text={'Login'} /></center>

                <center><p style={{ fontSize: '15px', color: 'dimgray' }}>You don't have an account?<Link to='/register'> <a href="#" class="register-link">Register account</a></Link></p></center>
            </div>

        </>
    )
}
