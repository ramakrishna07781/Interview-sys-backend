import React from 'react'


function ELearningDescriptionBox(props) {
    return (
        <div className='mini-second-box-description-box'>
            <div className='mini-second-box-description-title'>
                <img src={props.img} />
                <h3>{props.info}</h3>
            </div>
            <div className='mini-second-box-description-info'>
            </div>
        </div>
    )
}

export default ELearningDescriptionBox