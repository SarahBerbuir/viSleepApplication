import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import * as func from '../functions'
import ouraData from '../csv/oura_08-09_trends.csv'
import { Accordion, Card, Form, ListGroup, Badge, Dropdown, DropdownButton, Modal, Button} from 'react-bootstrap';
import InformationMode from '../InformationMode';

export default function VisGeneral({ bigScreenVal }) {
    const [timeVal, setTimeVal] = useState("none")
    const [xAxisAttr, setXAxisAttr] = useState("Total Sleep Time")
    const [yAxisAttr, setYAxisAttr] = useState("Readiness Score")
    const [radiusAttr, setRadiusAttr] = useState("Sleep Latency")
    const [colorAttr, setColorAttr] = useState("Inactive Time")
    const [ouraDataNew, setOuraDataNew] = useState([])
    const [colorInfoHeader, setColorInfoHeader] = useState("Inactive Time")
    const [colorInfoText, setColorInfoText] = useState(func.getInfoText("Inactive Time"))
    const [isLoaded, setIsLoaded] = useState(false)
    const [bigScreen, setBigScreen] = useState(true)


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleCloseAttributes = () => {
        setShow(false)
        setYAxisAttr("Activity Score")
    };

    const handleShow = () => setShow(true);

    //refresh
    useEffect(() => {

        var timeFormat = d3.timeParse("%Y-%m-%d");

        //take oura data and return csv variable with kw, mean of y-axis and x of radius
        function weekParam() {
            var weekData = ""
            var weekNumbers = {}
            var actualKW = 0
            var data = ouraDataNew
            //find first kw that exists
            var firstDate = new Date(data[0].date);
            var firstKW = getWeekNumber(firstDate)
            var oldKW = firstKW

            //find last kw that exists
            var lastDate = new Date(data[data.length - 1].date);
            var lastKW = getWeekNumber(lastDate)
            var countArray = 0
            var arrayData = []
            //initialize array with data structure: [[null, null]]
            for (var i = 0; i < 52; i++) {
                var puffer = []
                for (var j = 0; j < 7; j++) {
                    puffer.push([null, null])
                }
                arrayData.push(puffer)
            }
            data.forEach(element => {
                //get the kw of element.date
                var newDate = new Date(element.date);
                var kw = getWeekNumber(newDate)
                weekNumbers[kw] = []
                actualKW = kw
                //iterate only through one week for one dimension of the array
                if (countArray > 6 || actualKW !== oldKW) {
                    countArray = 0
                }
                // arrayData has content in terms of [kw, yAxisValue]

                var newYAxisVal = yAxisAttr.split(' ').join('')
                var newRadius = radiusAttr.split(' ').join('')
                var newColor = colorAttr.split(' ').join('')

                arrayData[kw][countArray] = [actualKW, element[newYAxisVal], element[newRadius], element[newColor], element.date]; //vllt new Date(element.date)?
                countArray += 1
                oldKW = actualKW
            })
            //calculate mean per week
            var meanArray = []
            for (i = firstKW; i <= lastKW; i++) {
                var sumOfOneWeekY = 0
                var sumOfOneWeekRad = 0
                var sumOfOneWeekCol = 0
                var countOfDays = 0
                var sumOfAllDates = []
                for (j = 0; j < 7; j++) {
                    if (arrayData[i][j][0] !== null && arrayData[i][j][1] !== null) {
                        sumOfOneWeekY += +(arrayData[i][j][1])
                        sumOfOneWeekRad += +((arrayData[i][j][2]))
                        sumOfOneWeekCol += +((arrayData[i][j][3]))
                        sumOfAllDates[j] = (arrayData[i][j][4])
                        countOfDays += 1
                    }
                }
                var meanOfWeekY = sumOfOneWeekY / countOfDays
                var meanOfWeekRad = sumOfOneWeekRad / countOfDays
                var meanOfWeekCol = sumOfOneWeekCol / countOfDays
                meanArray.push([i, meanOfWeekY, meanOfWeekRad, meanOfWeekCol, sumOfAllDates]) //3 as default for radius
                sumOfOneWeekY = 0
                sumOfOneWeekRad = 0
                sumOfOneWeekCol = 0
                sumOfAllDates = []
                countOfDays = 0
            }

            let csvHeader = ["kw", "MeanCat", "MeanRadius", "MeanColor", "Date0", "Date1", "Date2", "Date3", "Date4", "Date5", "Date6"];
            var weekDataString = ""
            meanArray.forEach(element => {
                var dates = "," + element[4] + "," + element[5] + "," + element[6] + "," + element[7] + "," + element[8] + "," + element[9] + "," + element[10]
                weekDataString = weekDataString + "\n" + element[0] + "," + element[1] + "," + element[2] + "," + element[3] + dates
            })
            weekDataString = csvHeader + weekDataString
            weekData = d3.csvParse(weekDataString);
            return weekData
        }

        function getWeekNumber(date) {
            var dayNum = date.getUTCDay() || 7;
            date.setUTCDate(date.getUTCDate() + 4 - dayNum);
            var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
            return Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
        }

        function getOuraDataFormatted() {
            d3.csv(ouraData, function (d) {
                return func.formatDataSet(d)
            }).then(function (data) {
                setOuraDataNew(data)
            });
        }
        var svg = d3.select("#svgGeneral")

        function updateData(dataset) {
            if(xAxisAttr == yAxisAttr){
                setShow(true)
            }
            var data = dataset
            if (xAxisAttr === "week") {
                data = weekParam(dataset)
            }
            var margin = 200
            if (bigScreen || bigScreenVal) {
                var width = 2070 - margin //1650
                var height = 820 - margin //800
            } else {
                width = 1590 - margin //800
                height = 820 - margin //600
            }
            var avgX = (d3.mean(data, d => func.dropDownToValues(d, xAxisAttr, xAxisAttr, "xAxis"))),
                avgY = (d3.mean(data, d => func.dropDownToValues(d, yAxisAttr, xAxisAttr, "yAxis"))),
                avgR = (d3.mean(data, d => func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius"))),
                avgC = (d3.mean(data, d => func.dropDownToValues(d, colorAttr, xAxisAttr, "color"))),
                minX = (d3.min(data, d => parseFloat(func.dropDownToValues(d, xAxisAttr, xAxisAttr, "xAxis")))), //-1
                maxX = (d3.max(data, d => parseFloat(func.dropDownToValues(d, xAxisAttr, xAxisAttr, "xAxis")))), //+1
                //minY = (d3.min(data, d => dropDownToValues(d, yAxisAttr, "yAxis")))-1,
                minY = (d3.min(data, d => parseFloat(func.dropDownToValues(d, yAxisAttr, xAxisAttr, "yAxis")))),
                maxY = (d3.max(data, d => parseFloat(func.dropDownToValues(d, yAxisAttr, xAxisAttr, "yAxis")))),
                minRadius = (d3.min(data, d => parseFloat(func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius")))),
                maxRadius = (d3.max(data, d => parseFloat(func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius"))));

            if (xAxisAttr === "day") {
                var xScale = d3.scaleTime().domain(d3.extent(data, d => timeFormat(d.date))).range([0, width - 50])
            } else {
                xScale = d3.scaleLinear().domain([minX - 0.5, maxX + 0.5]).range([0, width - 50]);
            }
            if (xAxisAttr === "week") {
                avgY = (d3.mean(data, d => d.MeanCat))
                avgR = (d3.mean(data, d => d.MeanRadius))
                avgC = (d3.mean(data, d => d.MeanColor))
            }
            if (xAxisAttr != "week") {
                var radius = d3.scaleLinear().domain([minRadius, maxRadius]).range([30, 150])
            } else {
                radius = d3.scaleLinear().domain([minRadius, maxRadius]).range([90, 300])
            }
            var yScale = d3.scaleLinear().domain([minY - 0.5, maxY + 0.5]).range([height, 0]),//.range([height, 0]),
                translateGX = 80,
                translateGY = 120;
            var g = svg.append("g")
                .attr("transform", "translate(" + translateGX + "," + translateGY + ")");

            // Title
            d3.select("#headlineGen").remove()
            func.appendText(svg, width / 2 + 100, 50, 20, '#666666', 'General Mode', "headlineGen")
                .attr('text-anchor', 'middle')
                .style('font-family', 'Arial')

            //////////////////* color legend*////////////////////////////////////////////////////////////////////////////////////////////////////////

            createColorLegend()
            function createColorLegend() {
                d3.select("#colorLabelDescriptionG").text(colorAttr)
                setColorInfoHeader(colorAttr)
                setColorInfoText(func.getInfoText(colorAttr))
                function addColorLegend(i, text, color) {
                    d3.select("#rect" + i).remove()
                    d3.select("#colorDescriptionSVGG" + i)
                        .append("rect")
                        .attr("height", 20)
                        .attr("width", 20)
                        .attr("fill", color)
                        .attr("id", "rect" + i)
                    d3.select("#colorDescriptionTextG" + i).text(text)
                }
                var colorsG = func.getColors(colorAttr)
                var colorG = func.getColor(colorsG)
                var i = colorsG.length - 1
                while (i >= 0) {
                    addColorLegend(i, colorsG[i], colorG(colorsG[i]));
                    i--;
                }
            }

            //////////////////* radius and color average box*////////////////////////////////////////////////////////////////////////////////////////////////////////

            var radiusSVG = d3.select("#radiusSVGGen")

            createRadiusAndColorAverage()

            function createRadiusAndColorAverage() {
                var x = 35
                var y = 32

                //create minimum circle
                d3.select("#minCircleGen").remove()
                func.createCircle(radiusSVG, x, y, "#666666", func.generateRadius(minRadius, radius(minRadius)), "minCircleGen")
                    .style("stroke", "#666666")

                //create average circle
                d3.select("#averageCircleGen").remove()
                //func.createCircle(radiusSVG, x + 100, y, func.generateColor(parseFloat(avgC), colorAttr), func.generateRadius(parseFloat(avgR), radius(parseFloat(avgR))), "averageCircleGen")
                func.createCircle(radiusSVG, x, y + 50, "#666666", func.generateRadius(parseFloat(avgR), radius(parseFloat(avgR))), "averageCircleGen")
                    .style("stroke", "#666666")

                //create maximum circle
                d3.select("#maxCircleGen").remove()
                func.createCircle(radiusSVG, x, y + 100, "#666666", func.generateRadius(maxRadius, radius(maxRadius)), "maxCircleGen")
                    .style("stroke", "#666666")


                createShowText()
                function createShowText() {
                    var sizeFont = 15
                    func.addText("#svgCircleValGenHead", radiusAttr)
                    var x2 = x + 35
                    // min circle and  label
                    d3.select("#minimumOfGen").remove()
                    func.appendText(radiusSVG, x2, y + 5, sizeFont, '#666666', function (d) {
                        return func.getRadiusDescription(false, radiusAttr)
                    }, "minimumOfGen")

                    //average radius
                    d3.select("#radiusAvgTextGen").remove()
                    func.appendText(radiusSVG, x2, y + 55, sizeFont, '#666666', "Average ", "radiusAvgTextGen")

                    // max circle and  label
                    d3.select("#maximumOfGen").remove()
                    func.appendText(radiusSVG, x2, y + 105, sizeFont, '#666666', function (d) {
                        return func.getRadiusDescription(true, radiusAttr)
                    }, "maximumOfGen")

                    //radius attribute  to  display current radius
                    //d3.select("#radiusAttrGen").remove()
                    //func.appendText(radiusSVG, x2, 26, sizeFont, '#666666', radiusAttr, "radiusAttrGen")

                    // average color 
                    //d3.select("#colorAvgValueGen").remove()
                    //func.appendText(radiusSVG, x2, y + 37, sizeFont, '#666666', "Average color value", "colorAvgValueGen")

                    /*d3.select("#colorUnitTextGen").remove()
                    radiusSVG
                        .append("text")
                        .attr('x', x - 20)
                        .attr('y', 105)
                        .style('font-size', 14)
                        .attr('fill', '#666666')
                        .text(getRepresentableValue(avgC, colorAttr, true))
                        .attr("id", "colorUnitTextGen")*/
                }
                //show lines
                d3.select("#line1G").remove()
                d3.select("#line2G").remove()
                d3.select("#line3G").remove()
                d3.select("#line4G").remove()
                d3.select("#line5G").remove()

                //line that shows connection of maximum circle to maximum radius description
                /*if (xAxisAttr == "week") {
                    func.appendRect(radiusSVG, 40, 1, x, 1, '#666666').attr("id", "line1G")
                    func.appendRect(radiusSVG, 1, 8, x, 1, '#666666').attr("id", "line2G")

                    //line that shows connection of average circle to average radius description
                    func.appendRect(radiusSVG, 40, 1, x, y, '#666666').attr("id", "line3G")

                    //line that shows connection of average circle to average color description
                    func.appendRect(radiusSVG, 1, 40, x, y, '#666666').attr("id", "line4G")
                    func.appendRect(radiusSVG, 40, 1, x, y + 38, '#666666').attr("id", "line5G")

                } else {
                    func.appendRect(radiusSVG, 40, 1, x, 19, '#666666').attr("id", "line1G")
                    func.appendRect(radiusSVG, 1, 8, x, 19, '#666666').attr("id", "line2G")

                    //line that shows connection of average circle to average radius description
                    func.appendRect(radiusSVG, 40, 1, x, y, '#666666').attr("id", "line3G")

                    //line that shows connection of average circle to average color description
                    func.appendRect(radiusSVG, 1, 30, x, y, '#666666').attr("id", "line4G")
                    func.appendRect(radiusSVG, 40, 1, x, y + 30, '#666666').attr("id", "line5G")
                }*/
            }

            //////////////////* axis average box*////////////////////////////////////////////////////////////////////////////////////////////////////////
            createAverage()
            function createAverage() {
                //average horizontal
                //func.addText("#xAxisValGenHead", "Horizontal").attr("class", "bold")
                var textX = ""
                if (xAxisAttr === "week") {
                    func.addText("#xAxisValGenVal", "week")

                } else if (xAxisAttr === "day") {
                    textX = "day"
                    func.addText("#xAxisValGenVal", "date")
                } else {
                    textX = func.getRepresentableValue(avgX, xAxisAttr, true)
                    func.addText("#xAxisValGenVal", xAxisAttr)
                    func.addText("#xAxisValGenVal2", textX)

                }

                //average vertical
                //func.addText("#yAxisValGenHead", "Vertical").attr("class", "bold")
                func.addText("#yAxisValGenVal", yAxisAttr)
                func.addText("#yAxisValGenVal2", func.getRepresentableValue(avgY, yAxisAttr, true))

                //average radius
                //func.addText("#radiusValGenHead", "Radius").attr("class", "bold")
                func.addText("#radiusValGenVal", radiusAttr)
                func.addText("#radiusValGenVal2", func.getRepresentableValue(avgR, radiusAttr, true))

                //average color
                //func.addText("#colorValGenHead", "Color").attr("class", "bold")
                func.addText("#colorValGenVal", colorAttr)
                func.addText("#colorValGenVal2", func.getRepresentableValue(avgC, colorAttr, true))
            }

            //////////////////* axis*////////////////////////////////////////////////////////////////////////////////////////////////////////

            createAxis()

            function createAxis() {
                //remove old label
                d3.select("#xAxisLabel").remove()
                d3.select("#xAxisLabel2").remove()

                // X label/new X label
                func.appendText(svg, width / 2 - 100, height - 15 + 170, 16, '#666666', "Horizontal  -  ", "xAxisLabel")
                    .attr('text-anchor', 'left')
                    .style('font-family', 'Helvetica')
                    .style('font-weight', 'bold')
                func.appendText(svg, width / 2, height - 15 + 170, 16, '#666666', func.createAxisLabel(xAxisAttr), "xAxisLabel2")
                    .attr('text-anchor', 'left')
                    .style('font-family', 'Helvetica')

                //remove old label
                d3.select("#yAxisLabel").remove()
                d3.select("#yAxisLabel2").remove()

                // Y label/new Y label
                func.appendText(svg, 0, 0, 16, '#666666', "Vertical  -  ", "yAxisLabel")
                    .attr('text-anchor', 'left')
                    .style('font-family', 'Helvetica')
                    .style('font-weight', 'bold')
                    .attr('transform', 'translate(40,' + (height) + ')rotate(-90)')

                svg.append('text')
                    .attr('text-anchor', 'left')
                    .attr('transform', 'translate(40,' + (height - 80) + ')rotate(-90)')
                    .style('font-family', 'Helvetica')
                    .style('fill', '#666666')
                    .style('font-size', 16)
                    .text(
                        function () {
                            return func.createAxisLabel(yAxisAttr);
                        })
                    .attr("id", "yAxisLabel2");

                // append x-Axis
                d3.select("#xAxisAppendGen").remove()
                var objX = g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .attr("id", "xAxisAppendGen");
                var xax = d3.axisBottom(xScale)
                func.generateAxis(objX, xax, xAxisAttr)

                //create arrow for x axis
                func.generateArrow(svg, 'arrowhead-rightGen', 0, 15, 'M 0 0 L 17 10 L 0 20 L 1 1 L 1 20')
                svg.select('#xAxisAppendGen path.domain')
                    .attr('marker-end', 'url(#arrowhead-rightGen)');

                // append y-Axis
                d3.select("#yAxisAppendGen").remove()
                var objY = g.append("g")
                    .attr("id", "yAxisAppendGen");
                var yax = d3.axisLeft(yScale)
                func.generateAxis(objY, yax, yAxisAttr)

                //create arrow for y axis
                func.generateArrow(svg, 'arrowhead-upGen', 5, 17, 'M 0 17 L10 0 L20 17 L0 17')
                svg.select('#yAxisAppendGen path.domain')
                    .attr('marker-end', 'url(#arrowhead-upGen)');
            }

            //////////////////*bubbles*/////////////////////////////////////////////////////////////////////////////////
            var circles = svg.selectAll("circle");
            circles.remove()
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return xScale(func.dropDownToValues(d, xAxisAttr, xAxisAttr, "xAxis"))
                })
                .attr("cy", function (d) {
                    return yScale(func.dropDownToValues(d, yAxisAttr, xAxisAttr, "yAxis"))
                })
                .attr("r", function (d) {
                    var radiusR = func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius")
                    return func.generateRadius(radiusR, radius(radiusR))
                })
                .attr("transform", "translate(" + translateGX + "," + translateGY + ")")
                .style("fill", function (d) {
                    return func.generateColor(func.dropDownToValues(d, colorAttr, xAxisAttr, "color"), colorAttr)
                })
                .on("mouseover", function (event, f) {
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '.6');

                    d3.select(this).attr("translate", function (d) {
                        handleRect(true, (this.getBoundingClientRect().x), (this.getBoundingClientRect().y), d) //TODO
                    })
                })
                .on('mouseout', function (d, i) {
                    //setOpacityHoverBox(0)
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '1');
                    //handleRect(false, 0, 0)
                    d3.selectAll("#rectSVGs")
                        .attr("x", 1000)
                        .attr("y", 1000)
                });

            //////////////////* rectangles when mouse over */////////////////////////////////////////////////////////////////////////////////////////////

            function handleRect(mouseOver, xV, yV, d) {

                var t = 0.8
                var yVal = 0
                var rectSVG = svg
                    .append("svg")
                    .attr("class", "rectSVG")
                    .attr("id", "rectSVGs")


                var rect = rectSVG.append('rect')
                    //.attr('x', 150)
                    //.attr('y', height + 200)
                    .attr("height", 150)
                    .attr("width", 350)
                    .style("opacity", 0)
                    .attr("class", "rectValues")
                    .attr("rx", 6)
                    .attr("ry", 6)

                var rectArr = []
                var rectArr2 = []
                func.createRectArr(rectArr, rectArr2, rectSVG, rect, xV, yV, "Gen")
                rectValue(d, rectArr, rectArr2)
            }

            /**
             * give rectangle values when mouse over
             **/
            function rectValue(d, rectArr, rectArr2) {
                func.editRectanglesPopUp(d, rectArr, rectArr2, xAxisAttr, yAxisAttr, radiusAttr, colorAttr)
                /*var verticalText = 0
                var radiusText = 0
                var colorText = 0 
                if (xAxisAttr === "week") {
                    rectArr2[0].text("Week " + d.kw)
                        .attr("id", "dateValue")
                        .attr("font-weight", 700)
                    rectArr2[1].text(function () {
                        return func.getWeekDuration(d)
                    })
                    rectArr[0].text(" ")
                    rectArr[1].text(" ")
                    verticalText = func.getRepresentableValue(d.MeanCat, xAxisAttr, false)
                    radiusText = func.getRepresentableValue(d.MeanRadius, radiusAttr, false)
                    colorText = func.getRepresentableValue(d.MeanColor, colorAttr, false)
                } else {
                    rectArr[0].text(d.date)
                        .attr("id", "dateValue")
                        .attr("font-weight", 700)
                    rectArr2[0].text(" ")
                    if (xAxisAttr === "date") {
                        rectArr[1].text(" ")
                        rectArr2[1].text(" ")
                    } else {
                        rectArr[1].text(xAxisAttr + ": " + func.getRepresentableValue(func.dropDownToValues(d, xAxisAttr, "xAxis"), xAxisAttr, false))
                        rectArr2[1].text("Horizontal ").style("font-weight", "bold")    
                    }
                    verticalText = func.getRepresentableValue(func.dropDownToValues(d, xAxisAttr, xAxisAttr, "xAxis"), xAxisAttr, false)
                    radiusText = func.getRepresentableValue(func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius"), radiusAttr, false)
                    colorText = func.getRepresentableValue(func.dropDownToValues(d, colorAttr, xAxisAttr, "color"), colorAttr, false)
                
                }

                rectArr[2].text(yAxisAttr + ": " + verticalText)
                rectArr2[2].text("Vertical   ").style("font-weight", "bold")
                rectArr[3].text(radiusAttr + ": " + radiusText)
                rectArr2[3].text("Radius   ").style("font-weight", "bold")
                rectArr[4].text(colorAttr + ": " + colorText)
                rectArr2[4].text("Color  ").style("font-weight", "bold")
                rectArr[5].text("")*/
            }


        }
        if (!isLoaded) {
            getOuraDataFormatted()
            setIsLoaded(true)
        } else {

            updateData(ouraDataNew)

        }

        //setIsLoaded(true)
    }, [bigScreenVal, bigScreen, ouraDataNew, xAxisAttr, yAxisAttr, radiusAttr, colorAttr, isLoaded])

    var xAxisIds = ["xAxisdayG", "xAxisweekG", "xAxisTotalSleepTimeG", "xAxisActivityBurnG", "xAxisSleepScoreG", "xAxisReadinessScoreG"]
    var yAxisIds = ["yAxisReadinessScoreG", "yAxisStepsG", "yAxisDeepSleepTimeG", "yAxisActivityScoreG"]
    var radiusIds = ["radiusSleepLatencyG", "radiusInactiveTimeG", "radiusAverageRestingHeartRateG"]
    var colorIds = ["colorInactiveTimeG", "colorSleepScoreG", "colorReadinessScoreG"]

    function xAxisOnSelect(k) {
        setXAxisAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, xAxisIds, "xAxis", "G")
    }

    function yAxisOnSelect(k) {
        setYAxisAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, yAxisIds, "yAxis", "G")
    }

    function radiusOnSelect(k) {
        setRadiusAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, radiusIds, "radius", "G")
    }

    function colorOnSelect(k) {
        setColorAttr(k.replace("#/", ""))
        //var newK = getNewK("color", k, "G")
        //colorOnlyOne(newK, colorIds)
        func.changeColorsOfSelected(k, colorIds, "color", "G")
    }

    return (
        <div>
            <div id="bigScreenSwitch">
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    defaultChecked="true"
                    label="Big screen"
                    onChange={(k) => {
                        setBigScreen(k.target.checked)
                    }}
                />
            </div>
            <div className="row">
                <div id="test">
                    <div className="column-2Sleep" >
                        <svg width="3000px" height="900px" id="svgGeneral"></svg>
                    </div>
                    <div className="column-3Sleep" >
                        <Accordion id="ControlAccordion" defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Card id="card">
                                    <Accordion.Header>
                                        <div>
                                            <h5>Controls</h5>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <ListGroup variant="flush" className="listgroup">
                                            {/*<ListGroup.Item >
                                                <div id="yAxis" className="dropdownDiv">
                                                    <h1>Horizontal: time</h1>
                                                    <DropdownButton id="timeChoice" onSelect={(k) => setXAxisAttr(k.replace("#/", ""))} title={timeVal} className="select-wrapper">
                                                        <Dropdown.Item id="none" href="#/none" disabled>none</Dropdown.Item>
                                                        
                                                    </DropdownButton>
                                                </div>
                                            </ListGroup.Item>*/}
                                            <ListGroup.Item>
                                                <div id="xAxiss" className="dropdownDiv" >
                                                    <h1>Horizontal</h1>
                                                    <DropdownButton id="xAxisChoice" onSelect={(k) => xAxisOnSelect(k)} title={xAxisAttr} className="select-wrapper">
                                                        <Dropdown.Item href="#/day" id="xAxisdayG" className="xAxisItem" style={{ color: '#666666' }}>
                                                            day
                                                            <Badge id="badgeTime">Time</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/week" id="xAxisweekG" className="xAxisItem" style={{ color: '#666666' }}>
                                                            week
                                                            <Badge id="badgeTime">Time</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Total Sleep Time" id="xAxisTotalSleepTimeG" className="xAxisItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                            Total Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Activity Burn" id="xAxisActivityBurnG" className="xAxisItem" style={{ color: '#666666' }}>
                                                            Activity Burn
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Sleep Score" id="xAxisSleepScoreG" className="xAxisItem" style={{ color: '#666666' }}>
                                                            Sleep Score
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Readiness Score" id="xAxisReadinessScoreG" className="xAxisItem" style={{ color: '#666666' }}>
                                                            Readiness Score
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        {/* 
                                                        <Dropdown.Item href="#/Activity Score" id="xAxisItem">
                                                            Activity Score
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Inactive Time" id="xAxisItem">
                                                            Inactive Time
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Average MET" id="xAxisItem">
                                                            Average MET
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Medium Activity Time" id="xAxisItem">
                                                            Medium Activity Time
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Rest Time" id="xAxisItem">
                                                            Rest Time
                                                            <Badge id="badge4">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Steps" id="xAxisItem">
                                                            Steps
                                                            <Badge id="badge4">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Average Resting Heart Rate" id="xAxisItem">
                                                            Average Resting Heart Rate
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Average HRV" id="xAxisItem">
                                                            Average HRV
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        
                                                        <Dropdown.Item href="#/Sleep Efficiency" id="xAxisItem">
                                                            Sleep Efficiency
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Total Bedtime" id="xAxisItem">
                                                            Total Bedtime
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        
                                                        <Dropdown.Item href="#/Deep Sleep Time" id="xAxisItem">
                                                            Deep Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Bedtime Start" id="xAxisItem">
                                                            Bedtime Start
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Deep Sleep Score" id="xAxisItem">
                                                            Deep Sleep Score
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Awake Time" id="xAxisItem">
                                                            Awake Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Light Sleep Time" id="xAxisItem">
                                                            Light Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/REM Sleep Time" id="xAxisItem">
                                                            REM Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Deep Sleep Time" id="xAxisItem">
                                                            Deep Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Sleep Latency" id="xAxisItem">
                                                            Sleep Latency
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/HRV Balance Score" id="xAxisItem">
                                                            HRV Balance Score
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                    */}

                                                    </DropdownButton>
                                                </div>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <div id="yAxis" className="dropdownDiv">
                                                    <h1>Vertical</h1>
                                                    <DropdownButton id="yAxisChoice" onSelect={(k) => yAxisOnSelect(k)} title={yAxisAttr} className="select-wrapper">
                                                        <Dropdown.Item href="#/Readiness Score" id="yAxisReadinessScoreG" className="yAxisItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                            Readiness Score
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Steps" id="yAxisStepsG" className="yAxisItem" style={{ color: '#666666' }}>
                                                            Steps
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Deep Sleep Time" id="yAxisDeepSleepTimeG" className="yAxisItem" style={{ color: '#666666' }}>
                                                            Deep Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Activity Score" id="yAxisActivityScoreG" className="yAxisItem" style={{ color: '#666666' }}>
                                                            Activity Score
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        {/* 
                                                        <Dropdown.Item href="#/Activity Score" id="yAxisItem">
                                                            Activity Score
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Inactive Time" id="yAxisItem">
                                                            Inactive Time
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Average MET" id="yAxisItem">
                                                            Average MET
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Medium Activity Time" id="yAxisItem">
                                                            Medium Activity Time
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Rest Time" id="yAxisItem">
                                                            Rest Time
                                                            <Badge id="badge4">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Steps" id="yAxisItem">
                                                            Steps
                                                            <Badge id="badge4">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Activity Burn" id="yAxisItem">
                                                            Activity Burn
                                                            <Badge id="badge4">Activity</Badge>
                                                        </Dropdown.Item>
                                                        
                                                        <Dropdown.Item href="#/Average Resting Heart Rate" id="yAxisItem">
                                                            Average Resting Heart Rate
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Average HRV" id="yAxisItem">
                                                            Average HRV
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Sleep Score" id="yAxisItem">
                                                            Sleep Score
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Sleep Efficiency" id="yAxisItem">
                                                            Sleep Efficiency
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Total Bedtime" id="yAxisItem">
                                                            Total Bedtime
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Total Sleep Time" id="yAxisItem">
                                                            Total Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Deep Sleep Time" id="yAxisItem">
                                                            Deep Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Bedtime Start" id="yAxisItem">
                                                            Bedtime Start
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Deep Sleep Score" id="yAxisItem">
                                                            Deep Sleep Score
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Awake Time" id="yAxisItem">
                                                            Awake Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Light Sleep Time" id="yAxisItem">
                                                            Light Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/REM Sleep Time" id="yAxisItem">
                                                            REM Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Deep Sleep Time" id="yAxisItem">
                                                            Deep Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Sleep Latency" id="yAxisItem">
                                                            Sleep Latency
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/HRV Balance Score" id="yAxisItem">
                                                            HRV Balance Score
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>*/}

                                                    </DropdownButton>
                                                </div>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <div id="radius" className="dropdownDiv">
                                                    <h1>Size</h1>
                                                    <DropdownButton
                                                        id="radiusChoice"
                                                        onSelect={(k) => radiusOnSelect(k)}
                                                        title={radiusAttr}
                                                        className="select-wrapper">
                                                        <Dropdown.Item href="#/Sleep Latency" id="radiusSleepLatencyG" className="radiusItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                            Sleep Latency
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Inactive Time" id="radiusInactiveTimeG" className="radiusItem" style={{ color: '#666666' }}>
                                                            Inactive Time
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Average Resting Heart Rate" id="radiusAverageRestingHeartRateG" className="radiusItem" style={{ color: '#666666' }}>
                                                            Average Resting Heart Rate
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>

                                                        {/*
                                                        <Dropdown.Item href="#/Activity Score" id="yAxisItem">
                                                            Activity Score
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Inactive Time" id="yAxisItem">
                                                            Inactive Time
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Average MET" id="yAxisItem">
                                                            Average MET
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Medium Activity Time" id="yAxisItem">
                                                            Medium Activity Time
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Rest Time" id="yAxisItem">
                                                            Rest Time
                                                            <Badge id="badge4">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Steps" id="yAxisItem">
                                                            Steps
                                                            <Badge id="badge4">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Activity Burn" id="yAxisItem">
                                                            Activity Burn
                                                            <Badge id="badge4">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Readiness Score" id="yAxisItem">
                                                            Readiness Score
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Average Resting Heart Rate" id="yAxisItem">
                                                            Average Resting Heart Rate
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Average HRV" id="yAxisItem">
                                                            Average HRV
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Sleep Score" id="yAxisItem">
                                                            Sleep Score
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Sleep Efficiency" id="yAxisItem">
                                                            Sleep Efficiency
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Total Bedtime" id="yAxisItem">
                                                            Total Bedtime
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Total Sleep Time" id="yAxisItem">
                                                            Total Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Deep Sleep Time" id="yAxisItem">
                                                            Deep Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Bedtime Start" id="yAxisItem">
                                                            Bedtime Start
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Deep Sleep Score" id="yAxisItem">
                                                            Deep Sleep Score
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Awake Time" id="yAxisItem">
                                                            Awake Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Light Sleep Time" id="yAxisItem">
                                                            Light Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/REM Sleep Time" id="yAxisItem">
                                                            REM Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Deep Sleep Time" id="yAxisItem">
                                                            Deep Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Sleep Latency" id="yAxisItem">
                                                            Sleep Latency
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/HRV Balance Score" id="yAxisItem">
                                                            HRV Balance Score
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>*/}
                                                    </DropdownButton>
                                                </div>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <div id="color" className="dropdownDiv">
                                                    <h1>Color</h1>
                                                    <DropdownButton id="radiusChoice" onSelect={(k) => colorOnSelect(k)} title={colorAttr} className="select-wrapper">
                                                        <Dropdown.Item href="#/Inactive Time" id="colorInactiveTimeG" className="colorItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                            Inactive Time
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Sleep Score" id="colorSleepScoreG" className="colorItem" style={{ color: '#666666' }}>
                                                            Sleep Score
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Readiness Score" id="colorReadinessScoreG" className="colorItem" style={{ color: '#666666' }}>
                                                            Readiness Score
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        {/* 
                                                       
                                                        <Dropdown.Item href="#/Activity Score" id="colorItem">
                                                            Activity Score
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/HRV Balance Score" id="colorItem">
                                                            Readiness Score
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Recovery Index Score" id="colorItem">
                                                            Readiness Score
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Readiness Score" id="colorItem">
                                                            Readiness Score
                                                            <Badge id="badge6">Recovery</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Deep Sleep Score" id="colorItem">
                                                            Sleep Score
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>
                                                       
                                                        <Dropdown.Item href="#/Total Sleep Time" id="colorItem">
                                                            Total Sleep Time
                                                            <Badge id="badge4">Sleep</Badge>
                                                        </Dropdown.Item>*/}
                                                    </DropdownButton>
                                                </div>
                                            </ListGroup.Item>
                                        </ListGroup>

                                    </Accordion.Collapse>
                                </Card>
                            </Accordion.Item>

                        </Accordion>
                    </div>
                </div>
            </div>
            <div className="column-1Sleep">
                <Card id="labelDescriptionColor">
                    <Card.Header as="div">
                        <div id="colorLegendLabelDiv">
                            <h5 id="colorLabelDescriptionG">Color legend</h5>
                            <InformationMode key="127" id="infoMode" modeName={colorInfoHeader} modeText={colorInfoText} placement="right" />
                        </div></Card.Header>
                    <Card.Body>
                        <br></br>
                        <div id="colorLegendDiv">

                            <div width="200" height="20" id="colorDescription0">
                                <svg width="20" height="20" id="colorDescriptionSVGG0"></svg>
                                <p id="colorDescriptionTextG0"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription1">
                                <svg width="20" height="20" id="colorDescriptionSVGG1"></svg>
                                <p id="colorDescriptionTextG1"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription2">
                                <svg width="20" height="20" id="colorDescriptionSVGG2"></svg>
                                <p id="colorDescriptionTextG2"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription3">
                                <svg width="20" height="20" id="colorDescriptionSVGG3"></svg>
                                <p id="colorDescriptionTextG3"></p>
                            </div>
                        </div>
                        <br></br>

                    </Card.Body>
                </Card>
                <br></br>
                <Card id="labelDescriptionAvgRadius" >
                    <Card.Header as="div">
                        <h5 id="svgCircleValGenHead">Meaning of size</h5>
                    </Card.Header>
                    <Card.Body id="cardBody">

                        {/*<h1 id="svgCircleValGenHead">Headline</h1>*/}
                        <svg width="500" height="200" id="radiusSVGGen"></svg>
                        <br></br>

                        {/*<h1 id="radiusLabelDescription" >Radius and Color</h1>*/}

                    </Card.Body>
                </Card>
                <Card id="labelDescriptionAxis">
                    <Card.Header as="div"><h5>Averages</h5></Card.Header>
                    <Card.Body id="radiusBody">
                        <div id="axisDescriptionDiv">
                            {/*<h1 id="xAxisLabelDescription" >Axis</h1>*/}
                            <ListGroup id="ListGroupAxis" variant="flush" className="listgroup">
                                <ListGroup.Item>
                                    <div id="topAverage">
                                        <p id="xAxisValGenVal">Value</p>
                                        <p id="xAxisValGenVal2">Value</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div>
                                        <p id="yAxisValGenVal">Value</p>
                                        <p id="yAxisValGenVal2">Value</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div >
                                        <p id="radiusValGenVal">Value</p>
                                        <p id="radiusValGenVal2">Value</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div>
                                        <p id="colorValGenVal">Value</p>
                                        <p id="colorValGenVal2">Value</p>
                                    </div>
                                </ListGroup.Item>

                            </ListGroup>

                        </div >
                    </Card.Body>
                </Card>

            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Hint</Modal.Title>
                </Modal.Header>
                <Modal.Body>You selected the same attributes for horizontal and vertical. This indicates a positive correlation in all cases.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        I want to continue
                    </Button>
                    <Button variant="primary" onClick={handleCloseAttributes}>
                        Select another attribute for vertical
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

