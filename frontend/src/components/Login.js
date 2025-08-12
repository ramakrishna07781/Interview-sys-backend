// import React from 'react'
// import './Login.css';
// import logo from '../images/Group 33524.svg';
// import RequestButton from './RequestButton';

// export default function Login() {

//     const handleGoogleLogin = () => {
//         const googleClientId = '';
//         const redirectUri = 'http://localhost:3000';
//         const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token`;
//         window.open(googleAuthUrl, '_blank');
//     };

//     const handleGithubLogin = () => {
//         const githubClientId = '';
//         const redirectUri = 'http://localhost:3000';
//         const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user`;
//         window.open(githubAuthUrl, '_blank');
//     };

//     return (
//         <>
//             {/* <img src={logo} alt='logo' /> */}
//             <div className="login-container">

//                 {/* <div className='welcome'>
//                     <h3 style={{ color: 'gray' }}>Welcome</h3><br></br>
//                     <h1 style={{color:'white'}}>Login Account</h1>
//                 </div>
//                 <div className="social-buttons">
//                     <button className='login-button' onClick={handleGoogleLogin}>Google</button>
//                     <button className='login-button' onClick={handleGithubLogin}>Github</button>
//                 </div> */}
//                 {/* <h3 style={{ color: 'blue' }}>Or</h3> */}
//                 <label for="email" className='label'>Email Address*</label>
//                 <input type="email" id="email" placeholder="Enter email address" required />

//                 <label for="password" className='label'>Name*</label>
//                 <input type="text" id="password" placeholder="Enter your Name" required />

//                 <RequestButton text={'Login'} style={{ width: '12rem' }} />

//                 {/* <p style={{ fontSize: '12px', color: 'dimgray', fontWeight: 'bold' }}>You don't have an account? <a href="#" class="register-link">Register account</a></p> */}
//             </div>

//         </>
//     )
// }
