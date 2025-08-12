import React from "react"

function ImagesComponent(props) {
    return (

        <img src={props.src} alt={props.alt} className={props.className} />
    )

};
export default ImagesComponent;