import React,{useState} from 'react'
import coding from '../images/Group 33505.svg'
import head_img from '../images/Group 237768.svg'
import projects from '../images/project.svg';
import Roadmap from '../images/Dribbble-Light-Preview.svg';
import AI_assistant from '../images/Layer 2.svg';
import _Coding from '../images/Coding.svg';
import _Roadmap from '../images/Roadmap.svg';
import _AI_assistant from '../images/Ai-assistant.svg';
import _Projects from '../images/projects.svg';
import Ecard from './Ecard'
import './Ecard.css'

export default function Elearning() {

    const [showImage,setShowImage] = useState(_Coding);
    const [focusHeading,setFocusHeading] = useState(null);

    const handleClick =(image,heading)=>{
        setShowImage(image);
        setFocusHeading(heading);
    }

    return (
        <div className='elearn-container'>
            <div className='elearn-box'>
                <div className='elearn-left-box'>
                <div className='elearn-box1'></div>
                <div className='elearn-box2'></div>
                </div>
                <div className='elearn-right-box'></div>
            </div>
            <div className='e-learn'>
                <div className='elearn-head'>
                    <div className='animation-line2' >
                    <div className='animation-line1' >
                        <img className='elearn-head-img animation-line0' src={head_img}/>
                        </div>
                        </div>
                    <div className='elearn-head-content bg-gradient'>
                    <h1>E-Learning</h1>
                    <p>The Most Complete E-learning Platform Available</p>
                    </div>

                </div>
                <div className='elearn-body'>
                <div className='box-container'>

                    <div className='box'>
                        <Ecard heading={'Projects'} tagline={'Every Project is an Opportunity to Build and Learn'} image={projects} click={()=>handleClick(_Projects,'Projects')} focused={focusHeading === 'Projects'}/>
                    </div>

                    <div className='box'>
                        <Ecard heading={'Roadmaps'} tagline={'AI tailored course plans for your focused learning experience'} image={Roadmap} click={()=>handleClick(_Roadmap,'Roadmaps')} focused={focusHeading === 'Roadmaps'}/>
                    </div>

                    <div className='box box3'>
                        <Ecard heading={'Coding Env'} tagline={'Learn coding seamlessly in our Cloud-Based Environment.'} image={coding} click={()=>handleClick(_Coding,'Coding Env')} focused={focusHeading === 'Coding Env'}/>
                    </div>

                    <div className='box'>
                        <Ecard heading={'AI Assistant'} tagline={'Powerful AI that helps you overcome any coding challenge.'} image={AI_assistant} click={()=>handleClick(_AI_assistant,'AI Assistant')} focused={focusHeading === 'AI Assistant'}/>
                    </div>

                </div>

                <div className='elearn-image-container'>
                    <img className='code-image' src={showImage} />
                </div>
                </div>
            </div>
        </div>
    )
}
 