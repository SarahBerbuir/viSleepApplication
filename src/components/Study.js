import * as d3 from 'd3'
import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import initial from './resources/Initial_questions_submit.png'
import initialG from './resources/Initial_questions_senden.jpeg'
import final from './resources/final_questions_submit.png'
import finalG from './resources/final_questions_senden.jpeg'
import check from './resources/check.svg'

export default function Study({ active }) {
    // question section 0 modal
    const [showQuestionSec0, setShowQuestionSec0] = useState(false);
    const [question0IsClosed, setQuestion0IsClosed] = useState(false)
    function handleCloseQuestionSec0() {
        setShowQuestionSec0(false);
        d3.select("#zeroQuestionDiv")
            .style("background-color", "#666666");
        changeCurrentTask("zero", "first", taskFirst, taskFirstDescr)
    }
    const handleShowQuestionSec0 = () => setShowQuestionSec0(true);

    //close/are you sure button modal 0
    const [showSureModal, setShowSureModal] = useState(false);
    function handleCloseSureModal() {
        setQuestion0IsClosed(true)
        setShowSureModal(false);
    }
    const handleShowSureModal = () => setShowSureModal(true);

    //question section 1 modal
    const [showQuestionSec1, setShowQuestionSec1] = useState(false);
    const [question1IsClosed, setQuestion1IsClosed] = useState(false)
    function handleCloseQuestionSec1() {
        setShowQuestionSec1(false);
        d3.select("#taskDivButtonfirst")
            .remove()
        changeCurrentTask("first", "second", taskSecond, taskSecondDescr)
    }
    const handleShowQuestionSec1 = () => setShowQuestionSec1(true);

    //close/are you sure button modal 1
    const [showSureModal1, setShowSureModal1] = useState(false);
    function handleCloseSureModal1() {
        setQuestion1IsClosed(true)
        setShowSureModal1(false);
    }
    const handleShowSureModal1 = () => setShowSureModal1(true);

    //question section 2 modal
    const [showQuestionSec2, setShowQuestionSec2] = useState(false);
    const [question2IsClosed, setQuestion2IsClosed] = useState(false)
    function handleCloseQuestionSec2() {
        setShowQuestionSec2(false);
        d3.select("#taskDivButtonsecond")
            .remove()
        changeCurrentTask("second", "third", taskThird, taskThirdDescr)
    }
    const handleShowQuestionSec2 = () => setShowQuestionSec2(true);

    //close/are you sure button modal 2
    const [showSureModal2, setShowSureModal2] = useState(false);
    function handleCloseSureModal2() {
        setQuestion2IsClosed(true)
        setShowSureModal2(false);
    }
    const handleShowSureModal2 = () => setShowSureModal2(true);

    //question section 3 modal
    const [showQuestionSec3, setShowQuestionSec3] = useState(false);
    const [question3IsClosed, setQuestion3IsClosed] = useState(false)
    function handleCloseQuestionSec3() {
        setShowQuestionSec3(false);
        d3.select("#taskDivButtonthird")
            .remove()
        changeCurrentTask("third", "fourth", taskFourth, taskFourthDescr)
    }
    const handleShowQuestionSec3 = () => setShowQuestionSec3(true);

    //close/are you sure button modal 3
    const [showSureModal3, setShowSureModal3] = useState(false);
    function handleCloseSureModal3() {
        setQuestion3IsClosed(true)
        setShowSureModal3(false);
    }
    const handleShowSureModal3 = () => { setShowSureModal3(true); }

    //question section 4 modal
    const [showQuestionSec4, setShowQuestionSec4] = useState(false);
    const [question4IsClosed, setQuestion4IsClosed] = useState(false)
    function handleCloseQuestionSec4() {
        setShowQuestionSec4(false);
        d3.select("#taskDivButtonfourth")
            .remove()
        changeCurrentTask("fourth", "fifth", taskFifth, null)
    }
    const handleShowQuestionSec4 = () => setShowQuestionSec4(true);

    //close/are you sure button modal 4
    const [showSureModal4, setShowSureModal4] = useState(false);
    function handleCloseSureModal4() {
        setQuestion4IsClosed(true)
        setShowSureModal4(false);
    }
    const handleShowSureModal4 = () => setShowSureModal4(true);

    //question section 5 modal
    const [showQuestionSec5, setShowQuestionSec5] = useState(false);
    const [question5IsClosed, setQuestion5IsClosed] = useState(false)
    function handleCloseQuestionSec5() {
        d3.select("#checkfifth")
            .style("opacity", 1)
            .style("margin-left", "10px")
        d3.select("#fifthQuestionDiv")
            .style("background-color", "#757575")
            .style("opacity", "50%")
            .style("border-color", "#666666")
        setShowQuestionSec5(false);
        d3.select("#taskDivButtonfifth")
            .remove()
        setShowQuestionSec6(true)
    }
    const handleShowQuestionSec5 = () => setShowQuestionSec5(true);

    //close/are you sure button modal 5
    const [showSureModal5, setShowSureModal5] = useState(false);
    function handleCloseSureModal5() {
        setQuestion5IsClosed(true)
        setShowSureModal5(false);
    }
    const handleShowSureModal5 = () => setShowSureModal5(true);

    //question section 6 modal
    const [showQuestionSec6, setShowQuestionSec6] = useState(false);
    const [question6IsClosed, setQuestion6IsClosed] = useState(false)
    function handleCloseQuestionSec6() {
        setShowQuestionSec6(false);
        d3.select("#taskDivButtonsixth")
            .remove()
        changeCurrentTask("sixth", "seventh", taskSeventh)
    }
    const handleShowQuestionSec6 = () => setShowQuestionSec6(true);

    function changeCurrentTask(currentNumber, nextNumber, task, taskDescr) {
        //handle current number
        d3.select("#" + currentNumber + "IsClosed")
            .text("- Closed  -")
        d3.select("#" + currentNumber + "QuestionDiv")
            .style("background-color", "#757575")
            //.style("width", '90px')
            //.style("height", '100px')
            .style("opacity", "50%")
            .style("border-color", "#666666")
        d3.selectAll("#arrowStudyItem" + getNumber(currentNumber))
            //.style("opacity", "0.5")
            .style("filter", "invert(50%) sepia(7%) saturate(14%) hue-rotate(332deg) brightness(90%) contrast(87%)")
        d3.select("#check" + currentNumber)
            .style("opacity", 1)
            .style("margin-left", "140px")
        d3.selectAll("#arrowStudyItemStroke" + getNumber(currentNumber))
            .style("filter", "invert(50%) sepia(7%) saturate(14%) hue-rotate(332deg) brightness(90%) contrast(87%)")
        //d3.select("#svgArrowLong" + getNumber(currentNumber)).style("opacity", 0)
        d3.select("#svgArrow" + getNumber(currentNumber)).style("opacity", 0.5)
        d3.select("#svgArrow" + getNumber(nextNumber)).style("opacity", 1)
        d3.select("#taskDivButton" + currentNumber).remove()
        d3.selectAll("#arrowStudyItem" + getNumber(nextNumber))
            .style("filter", "invert(72%) sepia(13%) saturate(1797%) hue-rotate(168deg) brightness(88%) contrast(95%)")
        //handle next number
        d3.select("#" + nextNumber + "QuestionDiv")
            .style("border-color", "#8A2BE2")
            .style("opacity", "100%")
            .style("background-color", "#5eb0db")
        d3.select("#" + nextNumber + "QuestionText")
            .text(task)
        if (nextNumber != "fifth") {
            d3.select("#" + nextNumber + "QuestionTextSVG")
                .append("text")
                .attr("width", "200px")
                .attr('x', 0)
                .attr('y', 17)
                .style('font-size', 13)
                .attr('fill', "white")
                .style('font-weight', 'bold')
                .text("Requested attributes:")
        }

        newlineText(nextNumber + "QuestionTextSVG", taskDescr, 15, 17)

        if (nextNumber != "fifth") {
            var y = 125
            if (nextNumber == "third" || nextNumber == "fourth") {
                y = 105
            }
            d3.select("#" + nextNumber + "QuestionTextSVG")
                .append("text")
                .attr("width", "200px")
                .attr('x', 0)
                .attr('y', y)
                .style('font-size', 13)
                .attr('fill', "white")
                .text(taskMainDescr1)
            d3.select("#" + nextNumber + "QuestionTextSVG")
                .append("text")
                .attr("width", "200px")
                .attr('x', 0)
                .attr('y', y + 20)
                .style('font-size', 13)
                .attr('fill', "white")
                .text(taskMainDescr2)
        }
        d3.select("#taskDivButton" + nextNumber)
            .style("opacity", "100%")
        d3.selectAll("#arrowStudyItemStroke" + getNumber(nextNumber))
            .style("filter", "invert(35%) sepia(86%) saturate(7280%) hue-rotate(267deg) brightness(91%) contrast(94%)")
        d3.select("#check" + currentNumber)
            .style("opacity", 1)

    }
    function newlineText(obj, text, x, y) {
        var splitText = text.split('\n')
        splitText.forEach(elem => {
            d3.select("#" + obj)
                .append("text")
                .attr('fill', "white")
                .attr('x', x)
                .attr('y', y)
                .text(elem);
            y += 20
        })
    }

    function getNumber(num) {
        var number = 0

        if (num == "first") number = 1
        else if (num == "second") number = 2
        else if (num == "third") number = 3
        else if (num == "fourth") number = 4
        else if (num == "fifth") number = 5
        else if (num == "sixth") number = 6
        else if (num == "seventh") number = 7
        return number
    }

    //tasks
    var taskFirst = "You are in General Mode. Look if you can see a connection between the size and the color of the bubbles and think about what this connection could mean. Also check in which month consistently high activity scores occur."
    var taskFirstDescr = "\n Horizontal: day \n Vertical: Activity Score \n Size: Sleep Latency \n Color: Inactive Time"
    var taskSecond = "Go into Activity Mode. Select the requested attributes and see, by hovering over the bubbles, which sports were performed on the day with the highest calorie consumption. Also try to understand the meaning of the emojis."
    var taskSecondDescr = "\n Horizontal: Activity Burn \n Vertical: Medium Activity Time \n Size: not important for the task \n Color: not important for the task"
    var taskThird = "Go into Recovery Mode. Try to understand the arrow orientation by reading the information and hovering over the arrows. Then go into the menstruation view and see if you notice a connection between the temperature deviation and the arrow directions. Also look at the temperature at which the Lowest Rating Heart Rate is highest."
    var taskThirdDescr = "\n Vertical: Menstruation view \n Arrow Size: Lowest Resting Heart Rate \n Color: not important for the task"
    var taskFourth = "Go into Sleep Mode. You can see a kind of diagonal line. Consider what this has to do with the given attributes for horizontal and vertical and whether the Sleep Score is better with more REM sleep time. Hover over the bubbles to see the exact percentage of REM sleep in the Total Sleep Time."
    var taskFourthDescr = "\n Horizontal: Sleep Score \n Vertical: Total Sleep Time \n Size: REM Sleep Time"
    var taskFifth = "Click on \"Next\" and answer the final questions."
    var taskFifthDescr = " \n "
    var taskSeventh = "Letzter Nextsektor"
    var taskMainDescr1 = "Once you have answered, click \"Next\"."
    var taskMainDescr2 = ""

    useEffect(() => {
        setShowQuestionSec0(true)
    }, [])
    return (
        <>
            <div id="questionSections">
                <div id="zeroQuestionDiv">
                    <div id="taskDiv0">
                        <h6 id="questionsH">Initial questions</h6>
                    </div>
                    <img id="checkzero" src={check}></img>
                    <p></p>
                    {/*  <p id="zeroIsClosed">- Open -</p>*/}
                </div>
                <svg width='30' height='350' id="svgLines">
                    <g id="svgArrow0">{/*M 30,50 -1,95 -2,5 z*/}
                        <path id="arrowStudyItem0" d="M 25,155 -1,340 -2,0 z" />
                        <line x1="-2" y1="0" x2="25" y2="155" id="arrowStudyItemStroke0" />
                        <line x1="-2" y1="332" x2="25" y2="155" id="arrowStudyItemStroke0" />
                    </g>
                    <g id="svgArrowLong0">
                        <path id="arrowStudyItemLong0" d="M 30,110 -1,220 -2,5 z" />
                        <line x1="-2" y1="5" x2="29" y2="106" id="arrowStudyItemStrokeLong0" />
                        <line x1="-2" y1="220" x2="29" y2="106" id="arrowStudyItemStrokeLong0" />
                    </g>
                </svg>
                <svg width='5' height='220px' id="svgArrowLong0">
                </svg>
                <svg id="svgLine" width="5" height="100"><line x1="0" y1="50" x2="30" y2="50" stroke="none" /></svg>
                <div id="firstQuestionDiv">
                    <div id="taskDiv1">
                        <p>Task 1</p>
                        <Button id="taskDivButtonfirst" onClick={() => changeCurrentTask("first", "second", taskSecond, taskSecondDescr)}>Next</Button>
                        <img id="checkfirst" src={check}></img>
                    </div>
                    <p id="firstQuestionText"></p>
                    <svg id="firstQuestionTextSVG"></svg>
                    {/*  <p id="firstIsClosed">- Open -</p>*/}
                </div>
                <svg width='30' height='350' id="svgLines">
                    <g id="svgArrow1">
                        <path id="arrowStudyItem1" d="M 25,145 -1,340 -2,0 z" />
                        <line x1="-2" y1="0" x2="25" y2="155" id="arrowStudyItemStroke1" />
                        <line x1="-2" y1="332" x2="25" y2="155" id="arrowStudyItemStroke1" />
                    </g>
                    <g id="svgArrowLong1">
                        <path id="arrowStudyItemLong1" d="M 30,110 -1,220 -2,5 z" />
                        <line x1="-2" y1="5" x2="29" y2="106" id="arrowStudyItemStrokeLong1" />
                        <line x1="-2" y1="220" x2="29" y2="106" id="arrowStudyItemStrokeLong1" />
                    </g>
                </svg>
                <svg id="svgLine" width="5" height="100"><line x1="0" y1="50" x2="50" y2="50" stroke="none" /></svg>
                <div id="secondQuestionDiv">
                    <div id="taskDiv2">
                        <p>Task 2</p>
                        <Button id="taskDivButtonsecond" onClick={() => changeCurrentTask("second", "third", taskThird, taskThirdDescr)}>Next</Button>
                        <img id="checksecond" src={check}></img>
                    </div>
                    <p id="secondQuestionText"></p>
                    <svg id="secondQuestionTextSVG"></svg>
                    {/*  <p id="secondIsClosed">- Open -</p>*/}
                </div>
                <svg width='30' height='350' id="svgLines">
                    <g id="svgArrow2">
                        <path id="arrowStudyItem2" d="M 25,145 -1,340 -2,0 z" />
                        <line x1="-2" y1="0" x2="25" y2="155" id="arrowStudyItemStroke2" />
                        <line x1="-2" y1="332" x2="25" y2="155" id="arrowStudyItemStroke2" />
                    </g>
                    <g id="svgArrowLong2">
                        <path id="arrowStudyItemLong2" d="M 30,110 -1,220 -2,5 z" />
                        <line x1="-2" y1="5" x2="29" y2="106" id="arrowStudyItemStrokeLong2" />
                        <line x1="-2" y1="220" x2="29" y2="106" id="arrowStudyItemStrokeLong2" />
                    </g>
                </svg>
                <svg id="svgLine" width="5" height="100"><line x1="0" y1="50" x2="50" y2="50" stroke="none" /></svg>
                <div id="thirdQuestionDiv">
                    <div id="taskDiv3">
                        <p>Task 3</p>
                        <Button id="taskDivButtonthird" onClick={() => changeCurrentTask("third", "fourth", taskFourth, taskFourthDescr)}>Next</Button>
                        <img id="checkthird" src={check}></img>
                    </div>
                    <p id="thirdQuestionText"></p>
                    <svg id="thirdQuestionTextSVG"></svg>
                    {/*  <p id="thirdIsClosed">- Open -</p>*/}
                </div>
                <svg width='30' height='350' id="svgLines">
                    <g id="svgArrow3">
                        <path id="arrowStudyItem3" d="M 25,145 -1,340 -2,0 z" />
                        <line x1="-2" y1="0" x2="25" y2="155" id="arrowStudyItemStroke3" />
                        <line x1="-2" y1="332" x2="25" y2="155" id="arrowStudyItemStroke3" />
                    </g>
                    <g id="svgArrowLong3">
                        <path id="arrowStudyItemLong3" d="M 30,110 -1,220 -2,5 z" />
                        <line x1="-2" y1="5" x2="29" y2="106" id="arrowStudyItemStrokeLong3" />
                        <line x1="-2" y1="220" x2="29" y2="106" id="arrowStudyItemStrokeLong3" />
                    </g>
                </svg>
                <svg id="svgLine" width="5" height="100"><line x1="0" y1="50" x2="50" y2="50" stroke="none" /></svg>
                <div id="fourthQuestionDiv">
                    <div id="taskDiv4">
                        <p>Task 4</p>
                        <Button id="taskDivButtonfourth" onClick={() => changeCurrentTask("fourth", "fifth", taskFifth, taskFifthDescr)}>Next</Button>
                        <img id="checkfourth" src={check}></img>
                    </div>
                    <p id="fourthQuestionText"></p>
                    <svg id="fourthQuestionTextSVG"></svg>
                    {/*  <p id="fourthIsClosed">- Open -</p>*/}
                </div>
                <svg width='30' height='350' id="svgLines">
                    <g id="svgArrow4">
                        <path id="arrowStudyItem4" d="M 25,145 -1,340 -2,0 z" />
                        <line x1="-2" y1="0" x2="25" y2="155" id="arrowStudyItemStroke4" />
                        <line x1="-2" y1="332" x2="25" y2="155" id="arrowStudyItemStroke4" />
                    </g>
                    <g id="svgArrowLong4">
                        <path id="arrowStudyItemLong4" d="M 30,110 -1,220 -2,5 z" />
                        <line x1="-2" y1="5" x2="29" y2="106" id="arrowStudyItemStrokeLong4" />
                        <line x1="-2" y1="220" x2="29" y2="106" id="arrowStudyItemStrokeLong4" />
                    </g>
                </svg>
                <svg id="svgLine" width="5" height="100"><line x1="0" y1="50" x2="50" y2="50" stroke="none" /></svg>
                <div id="fifthQuestionDiv">
                    <div id="taskDiv5">
                        <h6 id="questionsH">Final questions</h6>
                    </div>
                    <br></br>
                    <Button id="taskDivButtonfifth" onClick={() => setShowQuestionSec5(true)}>Next</Button>
                    <img id="checkfifth" src={check}></img>
                    <br></br>
                    <p id="fifthQuestionText"></p>
                    <svg id="fifthQuestionTextSVG"></svg>
                    {/*  <p id="fifthIsClosed">- Open -</p>*/}
                </div>
            </div>

            {/* question 0 */}
            <Modal
                size="lg"
                show={showQuestionSec0}
                onHide={handleCloseQuestionSec0}
                backdrop="static"
                keyboard={false}
                id="question0"
                centered
            >
                <Modal.Header>
                    <Modal.Title>Initial questions</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <iframe id="question1" src="https://docs.google.com/forms/d/e/1FAIpQLSfOUIN217UYwNcFLD5Zn6SwqWP6poHD3L1meEVs1nsk6WQiGw/viewform?embedded=true" width="100%" height="900" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>

                </Modal.Body>
                <Modal.Footer>
                    <div id="textInfoStudy">
                        <p>Please don't select 'I answered' before you answered the whole form and before you clicked 'Submit' ('Senden')! The intention is to check that the form has actually been submitted.</p>
                        <p>Please note that the form has several pages and you should keep clicking on 'Next' ('Weiter') until you reach the 'Submit' ('Senden') button.</p>
                    </div>
                    <Button id="questionButton0" variant="primary" onClick={handleShowSureModal}>
                        I answered
                    </Button>
                </Modal.Footer>
                <Modal id="youSure" show={showSureModal} onHide={handleCloseSureModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure that you see one of these views:
                        <img alt="view of submitted form in english" src={initial} id="initialQ" />
                        <br></br><br></br>
                        <img alt="view of submitted form in german" src={initialG} id="initialQ" />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseSureModal}>
                            No, I am not finished yet.
                        </Button>
                        <Button variant="primary" onClick={handleCloseQuestionSec0}>
                            Yes I have answered everything.
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Modal>

            {/* question 5 */}
            <Modal
                size="lg"
                show={showQuestionSec5}
                onHide={handleCloseQuestionSec5}
                backdrop="static"
                keyboard={false}
                id="question5"
                centered
            >
                <Modal.Header>
                    <Modal.Title>Final questions</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <iframe id="question1" src="https://docs.google.com/forms/d/e/1FAIpQLScNMlatBfozeuYh3mDJVGUCage3augOn1mjpuI7wRyJAXWmpA/viewform?embedded=true" width="100%" height="900" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>                </Modal.Body>
                <Modal.Footer>
                    <div id="textInfoStudy">
                        <p>Please don't select 'I answered' before you answered the whole form and before you clicked 'Submit' ('Senden')! The intention is to check that the form has actually been submitted.</p>
                        <p>Please note that the form has several pages and you should keep clicking on 'Next' ('Weiter') until you reach the 'Submit' ('Senden') button.</p>
                    </div>
                    <Button variant="primary" onClick={handleShowSureModal5}>
                        I answered
                    </Button>
                </Modal.Footer>
                <Modal id="youSure" show={showSureModal5} onHide={handleCloseSureModal5}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure that you see one of these views:
                        <img alt="view of submitted form in english" src={final} id="initialQ" />
                        <br></br><br></br>
                        <img alt="view of submitted form in german" src={finalG} id="initialQ" />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseSureModal5}>
                            No, I am not finished yet.
                        </Button>
                        <Button variant="primary" onClick={handleCloseQuestionSec5}>
                            Yes I have answered everything.
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Modal>

            <Modal
                size="lg"
                show={showQuestionSec6}
                onHide={handleCloseQuestionSec6}
                backdrop="static"
                keyboard={false}
                id="question6"
                centered
            >
                <Modal.Header>
                    <Modal.Title> </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="textInfoStudy">
                        <p><b>Thank you for your participation! You can now close the browser tab.</b></p>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

