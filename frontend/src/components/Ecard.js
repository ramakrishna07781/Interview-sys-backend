import React from 'react'
import AddRoadIcon from '@mui/icons-material/AddRoad';

export default function Ecard(props) {
    return (
        <div onClick={props.click}> 
            <div className='heading'>
                <img src={props.image}/> <h2 style={{color: props.focused ? '#CED765' : 'white'}}>{props.heading}</h2>
            </div>
            <p className='content'>{props.tagline}</p>
        </div>
    )
}


