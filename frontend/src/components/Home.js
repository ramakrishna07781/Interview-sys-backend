import React from 'react'
import './Home.css'
import route from './images/Group-2195.png'
import beta from './images/Group 33528.png'
import code_editor from './images/Screenshot 10.png'
import man from './images/image 500.png'
import Terminal from './images/Image.png'
import Neural from "./images/Group 33545.png"
import dashboard from './images/Screenshot 9.png'
import elogo from './images/Group 33541.png'
import CheckList from './images/Group 33542.png'
import cpp from './images/C++.png'
import go from './images/Go.png'
import javascript from './images/JavaScript.png'
import css from './images/css.png'
import html from './images/html.png'
import java from './images/Java-1.png'
import python from './images/Python.png'
import ceo from './images/image 498.png'
import face from './images/Group 33540.png'
import mock from './images/Group 33547.png'
import future from './images/Group 33548.png'
import parameter3 from './images/Group 2002.png'
import screenshot from './images/Screenshot 7.png'
import mock_int from './images/Screenshot 8.png'
import check from './images/Group 33542.png'

import net from './images/Group 33545.png'
import rtemplate from './images/marketing-manager 10.png'
import ParameterHorizantal from './images/Auto Layout Horizontal.png';
import ELearningDescriptionBox from './ELearningDescriptionBox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import Footer from './Footer';


/* Ai interview section icons*/
import halfSetting from './images/Group 33545.png'
import faceIcon from './images/Group 33540.png'

/*mock interview icons*/
import mockInterviewIcon from './images/Group 33547.png'
//no layout were given

/** */
import futureIcon from './images/Group 33548.png'


export default function Home() {
    return (

        <>

            <div className='home'>

                <div className='home-container'>
                    <div className='left'>
                        <div className='beta'>
                            <img src={beta} alt='' />
                        </div>
                        <div className='heading'>
                            Your Success Journey <br></br> Begins with <span style={{ color: 'yellow' }}>E-Learning</span>
                        </div>

                        <div className='tagline'>
                            Learning, Certifications, AI Resume Builder, Mock Interviews <br></br> and Much More..
                        </div>

                        <div className='button'>
                            <button>Request Early Access</button>
                        </div>
                    </div>
                    <div className='right'>
                        <img src={route} alt='' />
                    </div>
                </div>

                <div className='e-learning'>
                    <div className='dashboard-img'>
                        <img src={dashboard} alt='dashboard' />
                    </div>

                    {/* <div className='first-box'></div> */}

                    {/* <div className='second-box'>

                        <div className='e-logo'>
                            <img src={elogo} alt='logo' />
                            <div className='heading'>E-Learning</div>
                            <div className='tagline'>The Most Complete E-learning Platform Available</div>
                        </div>
                    </div> */}

                    <div className='code-editor'>

                        <div className='box-container'>

                            <div className='box'>
                                <div className='heading'>
                                    <img src={Terminal} /> Coding Env</div>
                                <div className='content'>We offer online coding environments for interactive programming education.</div>
                            </div>

                            <div className='box'>

                                <div className='heading'>                                <img src={Terminal} /> RoadMaps</div>
                                <div className='content'>We offer online coding environments for interactive programming education.</div>
                            </div>

                            <div className='box'>

                                <div className='heading'>                                <img src={Terminal} /> Live Classes</div>
                                <div className='content'>We offer online coding environments for interactive programming education.</div>
                            </div>

                            <div className='box'>

                                <div className='heading'>
                                    <img src={Terminal} /> PBL</div>
                                <div className='content'>We offer online coding environments for interactive programming education.</div>
                            </div>



                        </div>

                        <div className='code-image'>
                            <img src={code_editor} />
                        </div>

                    </div>




                    <div className='parameter7-container'>
                        <div className='parameters-test'>
                            <img src={ceo} alt='' />
                            <div className='content'>
                                Invest in your Talent. Gain the Skills Your Org Needs to Meet Business Goals and Innovate. Future-proof Your Corporate Workforce<br></br> with Skill Development. Demo Udemy Business.
                            </div>
                            <h3 text-align='center'>CEO, RUSA</h3>



                        </div>

                        {/* <div className='lines-move'>
                            <div className='up-box'></div>
                            <div className='down-box'></div>
                            <div className='down-box2'></div>
                        </div> */}

                        <div className='checklist'>
                            <img src={check} alt='checklist' />
                        </div>
                        <div className='parameter7'>
                            <h2> 7 - Parameters Test</h2>
                            <p> A 7-parameter test offers comprehensive insights with precision,
                                leaving no stone unturned in evaluating complex variables.</p>
                        </div>
                        {/* <h2 style={{ backgroundColor: 'black', marginRight: '12rem' }}>The Most Complete</h2> */}
                    </div>


                    <div className='parameter-container'>
                        <div>
                            {/* <img src={ParameterHorizantal} alt="ParameterHorizantal" /> */}
                        </div>
                        <div className='parameter-table'>
                            <div className='parameter3'>
                                <div className="parameter3-flex">
                                    <img src={parameter3} alit="parameter3" />
                                    <h2>3rd Parameter</h2>
                                </div>

                                <p>Seamlessly integrate your engineering workflows</p>
                            </div>
                            <div className="parameter-menu-flex1">
                                <div>
                                    <p><span>Parent and sub-issues.</span> Break larger tasks into smaller issues.</p>
                                </div>
                                <div>
                                    <p><span>Automated backlog.</span> Linear will auto-close and auto-archive issues.</p>
                                </div>
                                <div>
                                    <p><span>Custom workflows.</span> Define unique issue states for each team.</p>
                                </div>

                            </div>
                            <div className="parameter-menu-flex2">
                                <div>
                                    <p><span>Filters and custom views.</span> See only what’s relevant for you.</p>
                                </div>
                                <div>
                                    <p><span>Discussion.</span> Collaborate on issues without losing context.</p>
                                </div>
                                <div>
                                    <p><span>Issue templates.</span> Guide your team to write effective issues.</p>
                                </div>

                            </div>


                        </div>

                    </div>



                    <div className='certifications'>
                        <div className='heading'>
                            Comprehensive Certifications Under One Roof
                        </div>

                        <div className='tagline'>
                            Achieve Recognition: Dive into a curated selection from our extensive <br></br>catalog of industry-leading certifications.
                        </div>

                        <div className='languages'>
                            <div className='grid-item'>
                                <img src={javascript} alt='js' />
                            </div>
                            <div className='grid-item'>
                                <img src={html} alt='html' />
                            </div>
                            <div className='grid-item'>
                                <img src={css} alt='css' />
                            </div>
                            <div className='grid-item'>
                                <img src={python} alt='python' />
                            </div>
                            <div className='grid-item'>
                                <img src={cpp} alt='c++' />
                            </div>
                            <div className='grid-item'>
                                <img src={go} alt='go' />
                            </div>
                            <div className='grid-item'>
                                <img src={java} alt='java' />
                            </div>
                        </div>

                    </div>


                </div>

                <div className='AI'>

                    <img src={ceo} alt='ceo' />
                    <div className='content'>
                        Invest in your Talent. Gain the Skills Your Org Needs to Meet Business Goals and Innovate. Future-proof Your Corporate Workforce<br></br> with Skill Development. Demo Udemy Business.
                    </div>
                    <div style={{ padding: '1rem' }}>
                        CEO,RUSA
                    </div>

                    <div style={{ width: '70vw', backgroundColor: 'gray', width: '60vw', height: '1px', opacity: '.3', margin: '6rem', transform: 'translateX(20%)' }}></div>

                    <div className='resume-builder'>


                        <div className='images'>
                            <img src={face} />
                            <img src={Neural} />
                        </div>

                        <div className='lines'>
                            <div></div>
                        </div>
                        <div className='line'></div>

                        <div className='heading'>AI resume builder</div>
                        <div className='tagline'>The Most Efficient AI Resume Creator Online</div>
                        <div className='image'>
                            <img src={screenshot} />
                        </div>
                    </div>

                    <div className='mock-interview'>
                        <div className='mock-image'>
                            <img src={mock} alt='mock' />
                            <div className='line'></div>
                        </div>

                        <div className='heading'>
                            Skill Assessment
                        </div>
                        <div className='tagline'>
                            The meaning of a skill assessment is self-explanatory
                        </div>
                        <div className='image'>
                            <img src={mock_int} />
                        </div>
                    </div>

                    <div className='future'>
                        <div className='future-image'>
                            <img src={future} alt='built for your future' />
                        </div>
                        <div className='heading'>
                            Built for your future.
                        </div>
                        <div className='tagline'>
                            Experience the most enjoyable, powerful way for you to learn <br></br> and transform your career.
                        </div>

                        <div className='button'>
                            <button>Request Early Access</button>
                        </div>
                    </div>
                </div>

            </div>


            <Footer />
        </>
    )
}
