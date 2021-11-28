import React from 'react'
import  VisSleep from './VisSleep'
import '../css/Modes.css'

export default function SleepMode() {
    return (
        <div>
             <div id="recoveryMode">
                <VisSleep id="visSleep"/>
            </div>
        </div>
    )
}
