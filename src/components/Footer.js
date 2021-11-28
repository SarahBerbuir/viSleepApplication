import React from 'react'
import logo from './resources/Log4_new.svg'
import './css/Footer.css'

export default function Footer() {
    //<p id="company">ViSleep</p>
    return (
        <div>
            <div className="footer">
            <hr className="clearleft" id="footerhr"/>
            <div className="left">
                    <img alt="logo" src={logo} id="logofooter"></img>
            </div>
            <div className ="right">
                    <ul id="legalnav">
                        <li> Institute of Informatics </li>
                        <li>Sarah Berbuir &sdot;</li>
                        <li>Towards an intuitive visualization of activity, movement and sleep data   &sdot;</li>
                    </ul>
            </div>
        
        </div>
        </div>
    )
}
