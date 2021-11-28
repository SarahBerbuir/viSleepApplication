import React from 'react'
import './css/MainComp.css'
import TextInformation from './TextInformation'
import Visualization from './Visualization'


function MainComp() {
    return (
        <div className="mainComp">
            <TextInformation />
            <Visualization />
        </div>
    )
}

export default MainComp
