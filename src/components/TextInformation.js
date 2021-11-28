import React from 'react'
import question from './resources/question-icon.svg'
import { Popover, OverlayTrigger, Row, Col } from 'react-bootstrap';
import Study from './Study.js';
//import Study from './Study.js';

export default function TextInformation() {
  //            <hr></hr>
  const informationGeneral = (
    <Popover id="mytooltip" style={{ backgroundColor: "white", color: "#666666" }}>
      <Popover.Header as="h3">Help</Popover.Header>
      <Popover.Body>
        <h5>Visualization</h5>
        <p>
          The visualisation type is a bubble chart. It shows a total of four measured values in one bubble, which you can change using the controls. You can read values by looking at the horizontal position, the vertical position, the size of the bubble and in some modes also the color.
          At the bottom you can see, among other things, what each color means.
        </p>

        <p>
          There are four modes that show different representations of the health data. Hover over the information sign to get proper information.
        </p>

        <h5>Interaction</h5>
        <p>
          By pressing 'controls' you can fold them in or out to have a better view of the visualisation. Again, by expanding the dropdown there you can select attributes.
        </p>
        <h5>Recognize patterns</h5>
        <p>
          The stronger the correlation between two values, the closer the bubbles are falling on a perfect diagonal line.
          With a positive correlation there is an upward angle, and with a negative one a downward angle.
          With size, attention can be paid to whether the bubbles, for example, become larger and larger towards the right.
        </p>
        {/*/ 
        <Row>
          <Col xs={2}>
            Sleep Score
          </Col>
          <Col>
            Ranging from 0-100, the sleep score is an overall measure of how well you slept.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Respiratory Rate
          </Col>
          <Col>
            Because breathing is highly individual, it's best to compare your numbers to your own baseline.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Resting Heart Rate
          </Col>
          <Col>
            Measuring your resting heart rate during the day can give insight into how your body’s doing.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Sleep Efficiency
          </Col>
          <Col>
            Sleep efficiency is the percentage of time you actually spend asleep after going to bed.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Total Sleep Time
          </Col>
          <Col>
            Total sleep time refers to the total amount of time you spend in light, REM and deep sleep.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Readiness Score
          </Col>
          <Col>
            Ranging from 0-100, the readiness score helps identify the days that are ideal or not ideal for challenging yourself.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Average HRV
          </Col>
          <Col>
            When a person is relaxed, a healthy heart’s beating rate shows remarkable variation in the time interval between heartbeats.
            Defining a normal range is difficult, because it depends on several factors. This is why it’s best to compare your numbers to your own baseline.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Body Temperature
          </Col>
          <Col>
            Body temperature variations can reveal a lot about your recovery and overall health.
            If you track your menstrual cycle, you may spot monthly patterns in your body temperature Trend view.
            It’s common for body temperature to fall during the first half of the menstrual cycle, and rise slightly during the second half.
            It sets the baseline for your normal temperature during the first couple of weeks, and adjusts it if needed as more data is collected.
            Variations are shown in relation to your baseline, represented by 0.0 in the body temperature deviation graph.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Recovery Index Score
          </Col>
          <Col>
            Recovery Index measures how long it takes for your resting heart rate to stabilize during the night.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Activity Score
          </Col>
          <Col>
            Ranging from 0-100, the activity score is an overall measure of how active you've been today, and over the past 7 days.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Activity Burn
          </Col>
          <Col>
            Activity burn shows the kilocalories you've burned by daily movement and exercise.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Average MET
          </Col>
          <Col>
            MET or Metabolic Equivalent is a common measure used to express the energy expenditure and intensity of different physical activities.
            A MET value of 4 means burning 4 times as many calories.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Inactive Time
          </Col>
          <Col>
            Inactive time includes sitting, standing or otherwise being passive.
          </Col>
        </Row>
        <Row>
          <Col xs={2}>
            Steps
          </Col>
          <Col>
            Daily step count is one measure of your daily physical activity.
            The optimal number of daily steps depends on your age, body size, fitness level and readiness to perform.
          </Col>
        </Row>
        */}
      </Popover.Body>
    </Popover>
  );
  return (
    <div>
      <OverlayTrigger placement="left" width="800" overlay={informationGeneral} id="questionmark" className="informationHover">
        <img alt="questionMarkSign" src={question} id="questionvis"></img>
      </OverlayTrigger>
      <h1 id="headlineTrends">Trends</h1>
      {/*
      { <p id="trendDescription"><b>Complete the four tasks. The boxes in the shape of arrows will guide you through them. As soon as you think you have completed the task, press "Next".</b></p>
   <p id="trendDescription"><b> If you need help, hover over the question mark. For a small display, turn off the big screen switch.
        Hovering over the bubbles sometimes doesn't work, don't let it bother you.
      </b></p>
      
      <Study />*/}
      <br></br>
      <br></br>
    </div>
  )
}
