import React from 'react'
import { Tabs, Tab, Form } from 'react-bootstrap';
import { useState } from 'react'
import GeneralMode from './generalMode/GeneralMode';

import InformationMode from './InformationMode';
import RecoveryMode from './recoveryMode/RecoveryMode';
import SleepMode from './sleepMode/SleepMode';
import ActivityMode from './activityMode/ActivityMode';


function Visualization() {
    var [key, setKey] = useState('general'); //TODO change in general 
    const [generalActive, setGeneralActive] = useState(true)
    const [activityActive, setActivityActive] = useState(false)
    const [recoveryActive, setRecoveryActive] = useState(false)
    const [sleepActive, setSleepActive] = useState(false)
    const [bigScreen, setBigScreen] = useState(true)

    function changeTab(key) {
        setKey(key)
        //console.log(key)

        var general = document.getElementById("generalModeM")
        var activity = document.getElementById("activityMode")
        var recovery = document.getElementById("recoveryMode")
        var sleep = document.getElementById("sleepMode")

        var activeColor = "#3EB6EE"
        var notActiveColor = "#666666"
        if (key === "general") {

            general.style.color = activeColor;
            activity.style.color = notActiveColor
            recovery.style.color = notActiveColor
            sleep.style.color = notActiveColor
            setGeneralActive(true)
            setActivityActive(false)
            setRecoveryActive(false)
            setSleepActive(false)
        } else if (key === "activity") {
            general.style.color = notActiveColor;
            activity.style.color = activeColor
            recovery.style.color = notActiveColor
            sleep.style.color = notActiveColor
            setGeneralActive(false)
            setActivityActive(true)
            setRecoveryActive(false)
            setSleepActive(false)
        } else if (key === "recovery") {
            general.style.color = notActiveColor;
            activity.style.color = notActiveColor
            recovery.style.color = activeColor
            sleep.style.color = notActiveColor
            setGeneralActive(false)
            setActivityActive(false)
            setRecoveryActive(true)
            setSleepActive(false)
        } else {
            general.style.color = notActiveColor;
            activity.style.color = notActiveColor
            recovery.style.color = notActiveColor
            sleep.style.color = activeColor
            setGeneralActive(false)
            setActivityActive(false)
            setRecoveryActive(false)
            setSleepActive(true)
        }
    }
    /*useEffect(() => {
       console.log(key)
       if (key == "general") {
    }, [key])*/


    const generalText = "The comparison of values from the three categories Activity, Sleep and Recovery. \n Personalise the attributes through the controls of horizontal, vertical, size and color."
    const activityText = "The comparison of values from the activity category. \nPersonalise the attributes through the controls of horizontal, vertical, size and colour. \nThe emoji of a bubble shows the respective emotion. Hovering over it lists completed sports activities."
    const recoveryText = "The comparison of values from the recovery category. \nPersonalise the attributes through the controls of vertical, arrow size and color.  \nAn arrow shows the average values of a week, its direction the trend within this week."
    const sleepText = "The comparison of values from the sleep category.\n Personalise the attributes through the controls of horizontal, vertical and size.  \nA bubble shows a pie chart with the four sleep stages."

    //<Study active={activityActive}/>
    return (
        <div>
            {/*<div><Form.Check
                type="switch"
                id="custom-switch"
                label="Big screen"
                onChange={(k) => {
                    setBigScreen(k.target.checked)
                }}
            />
            </div>*/}
            <Tabs
                defaultActiveKey={key}
                activeKey={key}
                onSelect={(k) => changeTab(k)}
                className="mb-3"
                fill justify
                key="abz"
            >
                <Tab eventKey="general" key="xy" className="Tab"
                    title={
                        <div className="TabMode">
                            <p id="generalModeM">General Mode</p>
                            <InformationMode key="ert" keyName="xz1" modeName="General Mode" active={generalActive} modeText={generalText} placement="bottom" />
                        </div>} >
                    <GeneralMode />
                </Tab>
                <Tab eventKey="activity" key="xz"
                    title={<div className="TabMode"> <p id="activityMode">Activity Mode</p><InformationMode key="eru" keyName="xz2" modeName="Activity Mode" active={activityActive} modeText={activityText} id="activityTab" placement="bottom" /></div>}>
                    <ActivityMode bigScreenVal={bigScreen} />
                </Tab>
                <Tab eventKey="recovery" key="xa"
                    title={<div className="TabMode"> <p id="recoveryMode">Recovery Mode</p><InformationMode key="erv" keyName="xz3" modeName="Recovery Mode" active={recoveryActive} modeText={recoveryText} placement="bottom" /></div>}>
                    <RecoveryMode />
                </Tab>
                <Tab eventKey="sleep" key="xb"
                    title={<div className="TabMode"> <p id="sleepMode">Sleep Mode</p><InformationMode key="erw" keyName="xz4" modeName="Sleep Mode" active={sleepActive} modeText={sleepText} placement="bottom" /></div>}>
                    <SleepMode />
                </Tab>
            </Tabs>
        </div>
    )
}

export default Visualization
