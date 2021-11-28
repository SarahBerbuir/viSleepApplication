import React from 'react'
import { CloseButton, Badge, Col, Row } from 'react-bootstrap';
import * as d3 from 'd3'

export default function OneActivity({ badgeName, activityName, activityDate }) {

    
    return (
        <div>
            <div id="oneActivity">
                <Row id={badgeName + "Border"}>
                    <Col xs={8}>
                        <Row id="ActDescr">{activityName}</Row>
                        <Row id="ActDescr">{activityDate}</Row>
                    </Col>
                    <Col>
                        <Row id="closeButton" ><CloseButton onClick={(e) => d3.select("#oneActivity").remove()} /></Row>
                        <Row id="badgeRow"><Badge id={badgeName}>{badgeName}</Badge></Row>
                    </Col>
                </Row>


            </div>
        </div>
    )
}
