mport React from 'react'
import './ceo2.css'
import ceo from '../images/ceo.svg'
import { Avatar } from '@mui/material';

export default function ceo2() {
  return (
    <div className='ceo2'>
      <div className='vertical-line1'></div>
      <div className='container'>
            <Avatar
                alt="Remy Sharp"
                src={ceo}
                sx={{ width: 56, height: 56 }}
            />
            <p className='about'>
                Invest in your Talent. Gain the Skills Your Org Needs to Meet Business Goals and Innovate. Future-proof Your Corporate Workforce with Skill Development. Demo Udemy Business.
            </p>
            <h3 text-align='center'>CEO, RUSA</h3>
        </div>
      <div className='vertical-line2'></div>
    </div>
  )
}
