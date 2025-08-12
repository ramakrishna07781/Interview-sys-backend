import React from 'react'
import './Input.css'

export default function Input(props) {
    return (
        <>
            <label for="email" className="label">
                {props.label}
            </label>
            <input className='input' type={props.type} placeholder={props.placeholder} />
        </>
    )
}
