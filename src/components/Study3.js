import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'

export default function Study({ active }) {
    // question section 0 modal
    const [showQuestionSec0, setShowQuestionSec0] = useState(false);
    const [question0IsClosed, setQuestion0IsClosed] = useState(false)
    function handleCloseQuestionSec0() {
        setShowQuestionSec0(false);
        d3.select("#zeroQuestionDiv")
            .style("background-color", "#666666");
        changeCurrentTask("zero", "first", taskFirst)
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
        changeCurrentTask("first", "second", taskSecond)
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
        changeCurrentTask("second", "third", taskThird)
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
        changeCurrentTask("third", "fourth", taskFourth)
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
        changeCurrentTask("fourth", "fifth", taskFifth)
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
        setShowQuestionSec5(false);
        d3.select("#taskDivButtonfifth")
            .remove()
        changeCurrentTask("fifth", "sixth", taskSixth)
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

    //close/are you sure button modal 6
    const [showSureModal6, setShowSureModal6] = useState(false);
    function handleCloseSureModal6() {
        setQuestion6IsClosed(true)
        setShowSureModal6(false);
    }
    const handleShowSureModal6 = () => setShowSureModal6(true);

    //question section 7 modal
    const [showQuestionSec7, setShowQuestionSec7] = useState(false);
    const [question7IsClosed, setQuestion7IsClosed] = useState(false)
    function handleCloseQuestionSec7() {
        setShowQuestionSec7(false);
        d3.select("#taskDivButtonseventh")
            .remove()
        changeCurrentTask("sixth", "seventh", taskSeventh)
    }
    const handleShowQuestionSec7 = () => setShowQuestionSec7(true);

    //close/are you sure button modal 6
    const [showSureModal7, setShowSureModal7] = useState(false);
    function handleCloseSureModal7() {
        setQuestion7IsClosed(true)
        setShowSureModal7(false);
    }
    const handleShowSureModal7 = () => setShowSureModal7(true);


    function changeCurrentTask(currentNumber, nextNumber, task) {
        //handle current number
        d3.select("#" + currentNumber + "QuestionText")
            .text(" ")
        d3.select("#" + currentNumber + "IsClosed")
            .text("- Closed  -")
        d3.select("#" + currentNumber + "QuestionDiv")
            .style("background-color", "#757575")
            .style("width", '90px')
            .style("height", '100px')
            .style("opacity", "50%")
            .style("border-color", "#666666")
        d3.selectAll("#arrowStudyItemStroke" + getNumber(currentNumber)).style("opacity", "0")
        d3.selectAll("#arrowStudyItem" + getNumber(currentNumber))
            .style("opacity", "0.5")
            .style("filter", "invert(50%) sepia(7%) saturate(14%) hue-rotate(332deg) brightness(90%) contrast(87%)")
        d3.select("#svgArrowLong" + getNumber(currentNumber)).style("opacity", 0)
        d3.select("#svgArrow" + getNumber(currentNumber)).style("opacity", 1)

        //handle next number
        d3.select("#" + nextNumber + "QuestionDiv")
            .style("height", '220px')
            .style("width", '250px')
            .style("border-color", "#8A2BE2")
            .style("opacity", "100%")
        d3.select("#" + nextNumber + "QuestionText")
            .text(task)
        d3.select("#taskDivButton" + nextNumber)
            .style("opacity", "100%")
        d3.select("#svgArrowLong" + getNumber(nextNumber)).style("opacity", 1)
        d3.select("#svgArrow" + getNumber(nextNumber)).style("opacity", 0)


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
    var taskFirst = "Schaue dir die Visualisierung an, bleibe im 'General Mode'. Probiere gerne etwas herum. Nehme auch gerne eine kurze Erklärung in Anspruch, indem du über das Fragezeichen oben rechts hoverst."
    var taskSecond = "Finde ... im General Mode"
    var taskThird = "Gehe in den Activity Mode. Finde dich zurecht und ..."
    var taskFourth = "Gehe in den Recovery Mode. Finde dich zurecht und ..."
    var taskFifth = "Gehe in den Sleep Mode. Finde dich zurecht und ..."
    var taskSixth = "Nun hast du noch einmal die Möglichkeit dir alles im Gesamten anzusehen."
    var taskSeventh = "Letzter Nextsektor"


    useEffect(() => {
        //console.log(active)
        //if(active)
        setShowQuestionSec0(false)
    }, [])
    return (
        <>

            <div id="questionSections">


                <div id="zeroQuestionDiv">
                    <div id="taskDiv0">
                        <p>Welcome!</p>
                    </div>
                    <p></p>
                    <p id="zeroIsClosed">- Open -</p>
                </div>
                <svg width='30' height='200'>
                    <g id="svgArrow0">
                        <path id="arrowStudyItem0" d="M 30,50 -1,95 -2,5 z" />
                        <line x1="-2" y1="5" x2="30" y2="47" id="arrowStudyItemStroke0" />
                        <line x1="-2" y1="95" x2="30" y2="47" id="arrowStudyItemStroke0" />
                    </g>
                    <g id="svgArrowLong0">
                        <path id="arrowStudyItemLong0" d="M 30,110 -1,220 -2,5 z" />
                        <line x1="-2" y1="5" x2="29" y2="106" id="arrowStudyItemStrokeLong0" />
                        <line x1="-2" y1="220" x2="29" y2="106" id="arrowStudyItemStrokeLong0" />
                    </g>
                </svg>
                <svg width='30' height='220px' id="svgArrowLong0">

                </svg>
                <svg id="svgLine" width="20" height="100"><line x1="0" y1="50" x2="30" y2="50" stroke="none" /></svg>
                <div id="firstQuestionDiv">
                    <div id="taskDiv1">
                        <p>Task 1</p>
                        <Button id="taskDivButtonfirst" onClick={() => setShowQuestionSec1(true)}>Next</Button>
                    </div>

                    <p id="firstQuestionText"></p>
                    <p id="firstIsClosed">- Open -</p>

                </div>
                <svg width='30' height='250'>
                    <g id="svgArrow1">
                        <path id="arrowStudyItem1" d="M 30,50 -1,95 -2,5 z" />
                        <line x1="-2" y1="5" x2="30" y2="47" id="arrowStudyItemStroke1" />
                        <line x1="-2" y1="95" x2="30" y2="47" id="arrowStudyItemStroke1" />
                    </g>
                    <g id="svgArrowLong1">
                        <path id="arrowStudyItemLong1" d="M 30,110 -1,220 -2,5 z" />
                        <line x1="-2" y1="5" x2="29" y2="106" id="arrowStudyItemStrokeLong1" />
                        <line x1="-2" y1="220" x2="29" y2="106" id="arrowStudyItemStrokeLong1" />
                    </g>
                </svg>

                <svg id="svgLine" width="20" height="100"><line x1="0" y1="50" x2="50" y2="50" stroke="none" /></svg>
                <div id="secondQuestionDiv">
                    <div id="taskDiv2">
                        <p>Task 2</p>
                        <Button id="taskDivButtonsecond" onClick={() => setShowQuestionSec2(true)}>Next</Button>
                    </div>
                    <p id="secondQuestionText"></p>
                    <p id="secondIsClosed">- Open -</p>
                </div>
                <svg width='30' height='250'>
                    <g id="svgArrow2">
                        <path id="arrowStudyItem2" d="M 30,50 -1,95 -2,5 z" />
                        <line x1="-2" y1="5" x2="30" y2="47" id="arrowStudyItemStroke2" />
                        <line x1="-2" y1="95" x2="30" y2="47" id="arrowStudyItemStroke2" />
                    </g>
                    <g id="svgArrowLong2">
                        <path id="arrowStudyItemLong2" d="M 30,110 -1,220 -2,5 z" />
                        <line x1="-2" y1="5" x2="29" y2="106" id="arrowStudyItemStrokeLong2" />
                        <line x1="-2" y1="220" x2="29" y2="106" id="arrowStudyItemStrokeLong2" />
                    </g>
                </svg>
                <svg id="svgLine" width="20" height="100"><line x1="0" y1="50" x2="50" y2="50" stroke="none" /></svg>
                <div id="thirdQuestionDiv">
                    <div id="taskDiv3">
                        <p>Task 3</p>
                        <Button id="taskDivButtonthird" onClick={() => setShowQuestionSec3(true)}>Next</Button>
                    </div>
                    <p id="thirdQuestionText"></p>
                    <p id="thirdIsClosed">- Open -</p>

                </div>

                <svg width='30' height='250'>
                    <g id="svgArrow3">
                        <path id="arrowStudyItem3" d="M 30,50 -1,95 -2,5 z" />
                        <line x1="-2" y1="5" x2="30" y2="47" id="arrowStudyItemStroke3" />
                        <line x1="-2" y1="95" x2="30" y2="47" id="arrowStudyItemStroke3" />
                    </g>
                    <g id="svgArrowLong3">
                        <path id="arrowStudyItemLong3" d="M 30,110 -1,220 -2,5 z" />
                        <line x1="-2" y1="5" x2="29" y2="106" id="arrowStudyItemStrokeLong3" />
                        <line x1="-2" y1="220" x2="29" y2="106" id="arrowStudyItemStrokeLong3" />
                    </g>
                </svg>
                <svg id="svgLine" width="20" height="100"><line x1="0" y1="50" x2="50" y2="50" stroke="none" /></svg>
                <div id="fourthQuestionDiv">
                    <div id="taskDiv4">
                        <p>Task 4</p>
                        <Button id="taskDivButtonfourth" onClick={() => setShowQuestionSec4(true)}>Next</Button>
                    </div>
                    <p id="fourthQuestionText"></p>
                    <p id="fourthIsClosed">- Open -</p>
                </div>
                <svg width='30' height='250'>
                    <g id="svgArrow4">
                        <path id="arrowStudyItem4" d="M 30,50 -1,95 -2,5 z" />
                        <line x1="-2" y1="5" x2="30" y2="47" id="arrowStudyItemStroke4" />
                        <line x1="-2" y1="95" x2="30" y2="47" id="arrowStudyItemStroke4" />
                    </g>
                    <g id="svgArrowLong4">
                        <path id="arrowStudyItemLong4" d="M 30,110 -1,220 -2,5 z" />
                        <line x1="-2" y1="5" x2="29" y2="106" id="arrowStudyItemStrokeLong4" />
                        <line x1="-2" y1="220" x2="29" y2="106" id="arrowStudyItemStrokeLong4" />
                    </g>
                </svg>
                <svg id="svgLine" width="20" height="100"><line x1="0" y1="50" x2="50" y2="50" stroke="none" /></svg>
                <div id="fifthQuestionDiv">
                    <div id="taskDiv5">
                        <p>Task 5</p>
                        <Button id="taskDivButtonfifth" onClick={() => setShowQuestionSec5(true)}>Next</Button>
                    </div>
                    <p id="fifthQuestionText"></p>
                    <p id="fifthIsClosed">- Open -</p>
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
                    <Modal.Title>Welcome</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please fill in the form in the purple box first. </p>
                    <p>Answer the questions, watching out for the 'Next' buttons. Press the 'Next' button at the bottom left until it says 'Your answer has been sent'.</p>
                    <p>Then click the "I answered" button and confirm that you have answered the questions completely.</p>
                    <iframe id="question1" src="https://docs.google.com/forms/d/e/1FAIpQLSc2oqNxioBdxFPPxDGb3t4cjzILZ54LNP2sKTmz085K-nAurA/viewform?embedded=true" width="750" height="800" frameBorder="0" marginHeight="0" marginwidth="0">Wird geladen…</iframe>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="questionButton0" variant="primary" onClick={handleShowSureModal}>
                        I answered
                    </Button>

                </Modal.Footer>

                <Modal id="youSure" show={showSureModal} onHide={handleCloseSureModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure that you see this view?</Modal.Body>
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

            {/* question 1 */}
            <Modal
                size="lg"
                show={showQuestionSec1}
                onHide={handleCloseQuestionSec1}
                backdrop="static"
                keyboard={false}
                id="question1"
                centered
            >
                <Modal.Header>
                    <Modal.Title>Question section - Task 1</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please fill in the form in the purple box first. </p>
                    <p>Answer the questions, watching out for the 'Next' buttons. Press the 'Next' button at the bottom left until it says 'Your answer has been sent'.</p>
                    <p>Then click the "I answered" button and confirm that you have answered the questions completely.</p>
                    <p>iframe questions</p>
                    <iframe src="https://qfreeaccountssjc1.az1.qualtrics.com/jfe/form/SV_bBZDdXBkUbsK4Jw" height="800px" width="600px"></iframe>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShowSureModal1}>
                        I answered
                    </Button>

                </Modal.Footer>

                <Modal id="youSure" show={showSureModal1} onHide={handleCloseSureModal1}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure that you see this view?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseSureModal1}>
                           No, I am not finished yet.
                        </Button>
                        <Button variant="primary" onClick={handleCloseQuestionSec1}>
                            Yes I have answered everything.
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Modal>

            {/* question 2 */}
            <Modal
                size="lg"
                show={showQuestionSec2}
                onHide={handleCloseQuestionSec2}
                backdrop="static"
                keyboard={false}
                id="question2"
                centered
            >
                <Modal.Header>
                    <Modal.Title>Question section - Task 2</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please fill in the form in the purple box.</p>
                    <p>Answer the questions, watching out for the 'Next' buttons. Press the 'Next' button at the bottom left until it says 'Your answer has been sent'.</p>
                    <p>Then click the "I answered" button and confirm that you have answered the questions completely.</p>
                    <p>iframe questions</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShowSureModal2}>
                        I answered
                    </Button>

                </Modal.Footer>

                <Modal id="youSure" show={showSureModal2} onHide={handleCloseSureModal2}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure that you see this view?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseSureModal2}>
                           No, I am not finished yet.
                        </Button>
                        <Button variant="primary" onClick={handleCloseQuestionSec2}>
                            Yes I have answered everything.
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Modal>

            {/* question 3 */}
            <Modal
                size="lg"
                show={showQuestionSec3}
                onHide={handleCloseQuestionSec3}
                backdrop="static"
                keyboard={false}
                id="question3"
                centered
            >
                <Modal.Header>
                    <Modal.Title>Question section - Task 3</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please fill in the form in the purple box first. </p>
                    <p>Answer the questions, watching out for the 'Next' buttons. Press the 'Next' button at the bottom left until it says 'Your answer has been sent'.</p>
                    <p>Then click the "I answered" button and confirm that you have answered the questions completely.</p>
                    <p>iframe questions</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShowSureModal3}>
                        I answered
                    </Button>

                </Modal.Footer>

                <Modal id="youSure" show={showSureModal3} onHide={handleCloseSureModal3}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure that you see this view?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseSureModal3}>
                           No, I am not finished yet.
                        </Button>
                        <Button variant="primary" onClick={handleCloseQuestionSec3}>
                            Yes I have answered everything.
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Modal>

            {/* question 4 */}
            <Modal
                size="lg"
                show={showQuestionSec4}
                onHide={handleCloseQuestionSec4}
                backdrop="static"
                keyboard={false}
                id="question4"
                centered
            >
                <Modal.Header>
                    <Modal.Title>Question section - Task 4</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please fill in the form in the purple box first. </p>
                    <p>Answer the questions, watching out for the 'Next' buttons. Press the 'Next' button at the bottom left until it says 'Your answer has been sent'.</p>
                    <p>Then click the "I answered" button and confirm that you have answered the questions completely.</p>
                    <p>iframe questions</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShowSureModal4}>
                        I answered
                    </Button>

                </Modal.Footer>

                <Modal id="youSure" show={showSureModal4} onHide={handleCloseSureModal4}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure that you see this view?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseSureModal4}>
                           No, I am not finished yet.
                        </Button>
                        <Button variant="primary" onClick={handleCloseQuestionSec4}>
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
                    <Modal.Title>Question section - Task 5</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please fill in the form in the purple box first. </p>
                    <p>Answer the questions, watching out for the 'Next' buttons. Press the 'Next' button at the bottom left until it says 'Your answer has been sent'.</p>
                    <p>Then click the "I answered" button and confirm that you have answered the questions completely.</p>
                    <p>iframe questions</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShowSureModal5}>
                        I answered
                    </Button>

                </Modal.Footer>

                <Modal id="youSure" show={showSureModal5} onHide={handleCloseSureModal5}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure that you see this view?</Modal.Body>
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

            {/* question 6 */}
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
                    <Modal.Title>Question section - Task 6</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please fill in the form in the purple box first. </p>
                    <p>Answer the questions, watching out for the 'Next' buttons. Press the 'Next' button at the bottom left until it says 'Your answer has been sent'.</p>
                    <p>Then click the "I answered" button and confirm that you have answered the questions completely.</p>
                    <p>iframe questions</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShowSureModal6}>
                        I answered
                    </Button>

                </Modal.Footer>

                <Modal id="youSure" show={showSureModal6} onHide={handleCloseSureModal6}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure that you see this view?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseSureModal6}>
                           No, I am not finished yet.
                        </Button>
                        <Button variant="primary" onClick={handleCloseQuestionSec6}>
                            Yes I have answered everything.
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Modal>
            {/* question 7 */}
            <Modal
                size="lg"
                show={showQuestionSec7}
                onHide={handleCloseQuestionSec7}
                backdrop="static"
                keyboard={false}
                id="question7"
                centered
            >
                <Modal.Header>
                    <Modal.Title>Question section - Task 7</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please fill in the form in the purple box first. </p>
                    <p>Answer the questions, watching out for the 'Next' buttons. Press the 'Next' button at the bottom left until it says 'Your answer has been sent'.</p>
                    <p>Then click the "I answered" button and confirm that you have answered the questions completely.</p>
                    <p>iframe questions</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShowSureModal7}>
                        I answered
                    </Button>

                </Modal.Footer>

                <Modal id="youSure" show={showSureModal7} onHide={handleCloseSureModal7}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure that you see this view?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseSureModal7}>
                           No, I am not finished yet.
                        </Button>
                        <Button variant="primary" onClick={handleCloseQuestionSec7}>
                            Yes I have answered everything.
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Modal>


        </>
    )
}
