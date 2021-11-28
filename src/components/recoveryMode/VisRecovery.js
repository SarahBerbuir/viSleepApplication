import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import * as func from '../functions'

//import ouraData from '../csv/oura_08-09_trends.csv'
import ouraData from '../csv/oura_08-22_trends.csv'
import arrow from '../resources/arrow.svg'
import arrow_up from '../resources/arrow_up.svg'
import arrow_down from '../resources/arrow_down.svg'
import arrow_down_grey from '../resources/arrow_down_grey.svg'
import arrow_up_grey from '../resources/arrow_up_grey.svg'


import { Accordion, Card, ListGroup, Badge, Dropdown, DropdownButton, Form, Row, Col } from 'react-bootstrap';
import InformationMode from '../InformationMode';



export default function VisRecovery({bigScreenVal}) {
    const [timeVal, setTimeVal] = useState("week")
    const [xAxisAttr, setXAxisAttr] = useState("Sleep Score")
    const [yAxisAttr, setYAxisAttr] = useState("Lowest Resting Heart Rate")
    const [radiusAttr, setRadiusAttr] = useState("Respiratory Rate")
    const [colorAttr, setColorAttr] = useState("Readiness Score")
    const [ouraDataNew, setOuraDataNew] = useState([])
    const [colorInfoHeader, setColorInfoHeader] = useState("Readiness Score")
    const [orientationInfoHeader, setOrientationInfoHeader] = useState("Total Sleep Time")
    const [colorInfoText, setColorInfoText] = useState(func.getInfoText("Readiness Score"))
    const [arrowOrientationInfoText, setArrowOrientationInfoText] = useState(func.getInfoText("Lowest Resting Heart Rate"))
    const [isLoaded, setIsLoaded] = useState(false)
    const [bigScreen, setBigScreen] = useState(true)

    //timeVal
    useEffect(() => {

        var timeFormat = d3.timeParse("%Y-%m-%d");

        //take oura data and return csv variable with kw, mean of y-axis and x of radius
        function weekParam() {
            var weekData = ""
            var weekNumbers = {}
            var actualKW = 0
            var data = ouraDataNew
            var first = data[0]
            if (first !== undefined) {
                //find first kw that exists
                var firstDate = new Date(data[0].date);
                var firstKW = getWeekNumber(firstDate)
                var oldKW = firstKW
                function getWeekNumber(date) {
                    var dayNum = date.getUTCDay() || 7;
                    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
                    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
                    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
                }

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
                    var elementRadius = element[newRadius]
                    if (isNaN(elementRadius)) {
                        elementRadius = 84
                    }
                    arrayData[kw][countArray] = [actualKW, element[newYAxisVal], elementRadius, element[newColor], element.date]; //vllt new Date(element.date)?
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
                    var sumOfAllYValues = []
                    for (j = 0; j < 7; j++) {
                        if (arrayData[i][j][0] !== null && arrayData[i][j][1] !== null) {
                            sumOfOneWeekY += +(arrayData[i][j][1])
                            sumOfAllYValues[j] = (arrayData[i][j][1])
                            sumOfOneWeekRad += +((arrayData[i][j][2]))
                            sumOfOneWeekCol += +((arrayData[i][j][3]))
                            sumOfAllDates[j] = (arrayData[i][j][4])
                            countOfDays += 1

                        } else {
                            sumOfAllYValues[j] = undefined
                            sumOfAllDates[j] = undefined
                        }
                    }
                    var meanOfWeekY = sumOfOneWeekY / countOfDays

                    var meanOfWeekRad = sumOfOneWeekRad / countOfDays
                    var meanOfWeekCol = sumOfOneWeekCol / countOfDays
                    meanArray.push([i, meanOfWeekY, meanOfWeekRad, meanOfWeekCol, sumOfAllDates, sumOfAllYValues]) //3 as default for radius
                    sumOfOneWeekY = 0
                    sumOfOneWeekRad = 0
                    sumOfOneWeekCol = 0
                    sumOfAllDates = []
                    sumOfAllYValues = []
                    countOfDays = 0
                }

                let csvHeader = ["kw", "MeanCat", "MeanRadius", "MeanColor", "Date0", "Date1", "Date2", "Date3", "Date4", "Date5", "Date6", "YValue0", "YValue1", "YValue2", "YValue3", "YValue4", "YValue5", "YValue6"];
                var weekDataString = ""
                meanArray.forEach(element => {
                    var dates = "," + element[4] + "," + element[5] + "," + element[6] + "," + element[7] + "," + element[8] + "," + element[9] + "," + element[10]
                    var yValues = "," + element[11] + "," + element[12] + "," + element[13] + "," + element[14] + "," + element[15] + "," + element[16] + "," + element[17]
                    weekDataString = weekDataString + "\n" + element[0] + "," + element[1] + "," + element[2] + "," + element[3] + dates + yValues
                })
                weekDataString = csvHeader + weekDataString
                weekData = d3.csvParse(weekDataString);
                return weekData
            } else {
                return null
            }

        }


        function getOuraDataFormatted() {
            d3.csv(ouraData, function (d) {
                return func.formatDataSet(d)
            }).then(function (data) {
                setOuraDataNew(data)
            });
        }
        var svg = d3.select("#svgRecovery")

        function updateData(dataset) {
            console.log(dataset)
            var data = dataset

            if (xAxisAttr === "week") {
                data = weekParam()
            }
            if (data == undefined) {
                data = dataset
            }
            var margin = 200
            if (bigScreen || bigScreenVal) {
                var width = 2070 - margin //1650
                var height = 820 - margin //800
                /*var width = 2200 - margin //1650
                var height = 820 - margin *///800
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

            if (xAxisAttr === "date") {
                var xScale = d3.scaleTime().domain(d3.extent(data, d => timeFormat(d.date))).range([0, width - 50])
            } else {
                xScale = d3.scaleLinear().domain([minX - 0.5, maxX + 0.5]).range([0, width - 50]);
            }
            if (xAxisAttr === "week") {
                avgY = (d3.mean(data, d => d.MeanCat))
                avgR = (d3.mean(data, d => d.MeanRadius))
                avgC = (d3.mean(data, d => d.MeanColor))
            }

            var yScale = d3.scaleLinear().domain([minY - 0.5, maxY + 0.5]).range([height, 0]),
                radius = d3.scaleLinear().domain([minRadius, maxRadius]).range([175, 400]),
                translateGX = 80,
                translateGY = 100;
            var g = svg.append("g")
                .attr("transform", "translate(" + translateGX + "," + translateGY + ")");

            // Title
            d3.select("#headlineRec").remove()
            func.appendText(svg, width / 2 + 100, 50, 20, '#666666', 'Recovery Mode', "headlineRec")
                .attr('text-anchor', 'middle')
                .style('font-family', 'Arial')


            //////////////////* color legend*////////////////////////////////////////////////////////////////////////////////////////////////////////

            createColorLegend()
            function createColorLegend() {
                d3.select("#colorLabelDescriptionR").text(colorAttr)
                setColorInfoHeader(colorAttr)
                setColorInfoText(func.getInfoText(colorAttr))
                function addColorLegend(i, text, color) {
                    d3.select("#rectRec" + i).remove()
                    d3.select("#colorDescriptionSVGR" + i)
                        .append("rect")
                        .attr("height", 20)
                        .attr("width", 20)
                        .attr("fill", color)
                        .attr("id", "rectRec" + i)
                    d3.select("#colorDescriptionTextR" + i).text(text)
                }
                var colorsR = func.getColors(colorAttr)
                var colorR = func.getColor(colorsR)
                var i = colorsR.length - 1
                while (i >= 0) {
                    addColorLegend(i, colorsR[i], colorR(colorsR[i]));
                    i--;
                }
            }

            //////////////////// Form  description  /////////////////////////////////////////////////////////////////
            /*<p id="arrowValRec">p</p>
                                                <p id="arrowDescription"></p>*/
            setOrientationInfoHeader(yAxisAttr)
            setArrowOrientationInfoText(yAxisAttr)
            d3.select("#arrowValRec").text(yAxisAttr)
            d3.select("#arrowDescriptionUpRec").text(function () {
                if (yAxisAttr === "Average HRV") {
                    return "An upward HRV trend implies that you've recovered well."
                } else if (yAxisAttr === "Lowest Resting Heart Rate") {
                    return "An upward trend that something may be challenging your recovery."
                } else if (yAxisAttr === "Temperature Deviation") {
                    return "It’s common for body temperature to rise slightly during the second half.  (Oura)"
                } else {
                    return "defaultUp"
                }
                /*if (yAxisAttr === "Average HRV") {
                    //an upward HRV trend implies that you've recovered well, a downward trend that you should keep an eye on qour recovery status
                } else if (yAxisAttr === "Lowest Resting Heart Rate") {
                    //a downward resting hr trend  implies that you've recovered well, an upward trend that simething may be challenging your recovery
                }*/

            })
            d3.select("#arrowDescriptionDownRec").text(function () {
                if (yAxisAttr === "Average HRV") {
                    return "A downward trend that you should keep an eye on your recovery status."
                } else if (yAxisAttr === "Lowest Resting Heart Rate") {
                    return "A downward resting heart rate trend implies that you've recovered well."
                } else if (yAxisAttr === "Temperature Deviation") {
                    return "It’s common for body temperature to fall during the first half of the menstrual cycle.  (Oura)"
                } else {
                    return "defaultDown"
                }
            })


            //////////////////* radius and color average box*////////////////////////////////////////////////////////////////////////////////////////////////////////

            var radiusSVG = d3.select("#radiusSVGRec")

            radiusSVG.selectAll("image").data([0]).enter().append("svg:img")
                .attr("xlink:href", { arrow })
                .attr("x", "0")
                .attr("y", "0")
                .attr("fill", "black")
                .attr("width", "80")
                .attr("height", "80");

            createRadiusAndColorAverage()

            function createRadiusAndColorAverage() {
                var x = 50
                var x2 = 90
                var y = 40

                //average radius
                //func.addText("#radiusValRecHead", "Arrow size").attr("class", "bold")
                func.addText("#radiusValRecVal", radiusAttr)
                func.addText("#radiusValRecVal2", func.getRepresentableValue(avgR, radiusAttr, true))

                //average color
                //func.addText("#colorValRecHead", "Color").attr("class", "bold")
                func.addText("#colorValRecVal", colorAttr)
                func.addText("#colorValRecVal2", func.getRepresentableValue(avgC, colorAttr, true))


                //average vertical
                //func.addText("#yAxisValRecHead", "Vertical").attr("class", "bold")
                func.addText("#yAxisValRecVal", yAxisAttr)
                func.addText("#yAxisValRecVal2", func.getRepresentableValue(avgY, yAxisAttr, true))

                //createShowCircles()
                /*createShowArrow()

                function createShowArrow() {
                    d3.select("#averageArrowRec").remove()
                    radiusSVG
                        .append("svg:image")
                        .attr("xlink:href", function () {
                            return arrow_down
                        }
                        )
                        .attr("height", function () {
                            return func.generateRadius(avgR, radius(avgR)) * 2
                        })
                        .style("filter", function () {
                            var color = generateColor(avgC)
                            // https://codepen.io/sosuke/pen/Pjoqqp
                            func.generateColorOfArrow(avgC, colorAttr)
                        })
                        .attr("y", function () {
                            return y - 10
                        })
                        .attr("x", function () {
                            return x - 10
                        })
                        .attr("id", "averageArrowRec");

                    d3.select("#maxArrowRec").remove()
                    radiusSVG
                        .append("svg:image")
                        .attr("xlink:href", function () {
                            return arrow_down_con
                        }
                        )
                        .attr("height", function () {
                            return func.generateRadius(maxRadius, radius(maxRadius)) * 2
                        })
                        .style("stroke", "black")
                        .attr("y", function () {
                            return y - 20
                        })
                        .attr("x", function () {
                            return x - 20
                        })
                        .attr("id", "maxArrowRec");


                }

                createShowText()
                function createShowText() {
                    var sizeFont = 15
                    func.addText("#svgCircleValRecHead", "Comparison of maximum and average radius")

                    //average radius
                    d3.select("#radiusAvgTextRec").remove()
                    func.appendText(radiusSVG, x2, y + 5, sizeFont, '#666666', "Average radius value", "radiusAvgTextRec")

                    //average radius
                    d3.select("#radiusAvgTextRec").remove()
                    radiusSVG
                        .append("text")
                        .attr('x', x2)
                        .attr('y', y + 5)
                        .style('font-size', 14)
                        .attr('fill', '#666666')
                        .text(function () {
                            return "Average radius value: "
                        })
                        .attr("id", "radiusAvgTextRec")
                    d3.select("#radiusUnitTextRec").remove()
                    radiusSVG
                        .append("text")
                        .attr('x', x2)
                        .attr('y', y + 20)
                        .style('font-size', 14)
                        .attr('fill', '#666666')
                        .text(function () {
                            var avgAttr = getRepresentableValue(avgR, radiusAttr, false)
                            return avgAttr
                        })
                        .attr("id", "radiusUnitTextRec")

                    // max circle and  label
                    d3.select("#maximumOfRec").remove()
                    radiusSVG
                        .append("text")
                        .attr('x', x2)
                        .attr('y', 12)
                        .style('font-size', 14)
                        .attr('fill', '#666666')
                        .text("maximum radius of")
                        .attr("id", "maximumOfRec")

                    d3.select("#radiusAttrRec").remove()
                    radiusSVG
                        .append("text")
                        .attr('x', x2)
                        .attr('y', 26)
                        .style('font-size', 14)
                        .attr('fill', '#666666')
                        .text(radiusAttr)
                        .attr("id", "radiusAttrRec")
                    // average color 
                    d3.select("#colorAvgValueRec").remove()
                    radiusSVG
                        .append("text")
                        .attr('x', x - 20)
                        .attr('y', 90)
                        .style('font-size', 14)
                        .attr('fill', '#666666')
                        .text("Average color value: ")
                        .attr("id", "colorAvgValueRec")
                    d3.select("#colorUnitTextRec").remove()
                    radiusSVG
                        .append("text")
                        .attr('x', x - 20)
                        .attr('y', 105)
                        .style('font-size', 14)
                        .attr('fill', '#666666')
                        .text(getRepresentableValue(avgC, colorAttr, true))
                        .attr("id", "colorUnitTextRec")
                }

                createShowLines()
                function createShowLines() {
                    //line that shows connection of maximum circle to maximum radius description
                    radiusSVG
                        .append("rect")
                        .attr("width", 40)
                        .attr("height", 1)
                        .attr('x', x)
                        .attr('y', 19)
                        .attr("fill", "#666666")
                    //line that shows connection of average circle to average radius description
                    radiusSVG
                        .append("rect")
                        .attr("width", 40)
                        .attr("height", 1)
                        .attr('x', x)
                        .attr('y', y)
                        .attr("fill", "#666666")
                    //line that shows connection of average circle to average color description
                    radiusSVG
                        .append("rect")
                        .attr("width", 1)
                        .attr("height", 40)
                        .attr('x', x)
                        .attr('y', y)
                        .attr("fill", "#666666")

                }*/

            }


            //////////////////* axis average box*////////////////////////////////////////////////////////////////////////////////////////////////////////
            //createAxisAverage()
            /*function createAxisAverage() {

                d3.select("#yAxisValRec").text("Vertical – " + yAxisAttr)
                if (xAxisAttr === "week") {
                    d3.select("#xAxisAvgValRec")
                        .select("p")
                        .text(" ")
                } else if (xAxisAttr === "date") {
                    d3.select("#xAxisAvgValRec")
                        .select("p")
                        .text(" ")

                } else {
                    d3.select("#xAxisAvgValRec")
                        .select("p")
                        .text(function () {
                            return getRepresentableValue(avgX, xAxisAttr, true)
                        })
                }
                d3.select("#yAxisAvgValRec")
                    .select("p")
                    .text(function () {
                        return getRepresentableValue(avgY, yAxisAttr, true)
                    })

            }*/

            //////////////////* axis*////////////////////////////////////////////////////////////////////////////////////////////////////////

            createAxis()

            function createAxis() {
                //remove old label
                d3.select("#xAxisLabelRec").remove()
                d3.select("#xAxisLabelRec2").remove()

                // X label/new X label
                svg.append('text')
                    .attr('x', width / 2 - 100)
                    .attr('y', height - 15 + 170)
                    .attr('text-anchor', 'left')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 16)
                    .style('font-weight', 'bold')
                    .style('fill', '#666666')
                    .text(
                        function (d) {
                            return "Horizontal  -  ";
                        }
                    ).attr("id", "xAxisLabelRec");
                svg.append('text')
                    .attr('x', width / 2)
                    .attr('y', height - 15 + 170)
                    .attr('text-anchor', 'left')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 16)
                    .style('fill', '#666666')
                    .text(
                        function () {
                            return func.createAxisLabel(xAxisAttr);
                        }
                    ).attr("id", "xAxisLabelRec2");

                //remove old label
                d3.select("#yAxisLabelRec").remove()
                d3.select("#yAxisLabelRec2").remove()

                // Y label/new Y label
                svg.append('text')
                    .attr('text-anchor', 'left')
                    .attr('transform', 'translate(40,' + height + ')rotate(-90)')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 16)
                    .style('fill', '#666666')
                    .style('font-weight', 'bold')
                    .text(
                        function () {
                            return "Vertical  -  ";
                        })
                    .attr("id", "yAxisLabelRec");
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
                    .attr("id", "yAxisLabelRec2");


                // append x-Axis
                d3.select("#xAxisAppendRec").remove()
                var objX = g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .attr("id", "xAxisAppendRec");
                var xax = d3.axisBottom(xScale)
                func.generateAxis(objX, xax, xAxisAttr)
                //create arrow for x axis
                func.generateArrow(svg, 'arrowhead-rightRec', 0, 15, 'M 0 0 L 17 10 L 0 20 L 1 1 L 1 20')
                svg.select('#xAxisAppendRec path.domain')
                    .attr('marker-end', 'url(#arrowhead-rightRec)');

                // append y-Axis
                d3.select("#yAxisAppendRec").remove()
                var objY = g.append("g")
                    .attr("id", "yAxisAppendRec");
                var yax = d3.axisLeft(yScale)
                func.generateAxis(objY, yax, yAxisAttr)
                //create arrow for y axis
                func.generateArrow(svg, 'arrowhead-upRec', 5, 17, 'M 0 17 L10 0 L20 17 L0 17')
                svg.select('#yAxisAppendRec path.domain')
                    .attr('marker-end', 'url(#arrowhead-upRec)');

            }

            /////////////////form instead of bubbles////////////////////////////////////////////////////////////////////////////

            var arrows = svg.selectAll("image");
            arrows.remove()
            var gNew = svg.append("g");


            function getArrowOrientation(d) {
                var firstValue = []
                var lastValue = []
                var valuesY = [d.YValue0, d.YValue1, d.YValue2, d.YValue3, d.YValue4, d.YValue5, d.YValue6]
                for (var i = 0; i < valuesY.length; i++) {
                    if (valuesY[i] !== undefined) {
                        firstValue[0] = valuesY[i];
                        firstValue[1] = i
                        break;
                    }
                }
                for (var j = valuesY.length - 1; j >= 0; j--) {
                    if (valuesY[j] !== "") {
                        lastValue[0] = valuesY[j]
                        lastValue[1] = j
                        break;
                    }
                }
                // console.log(firstValue[0] + "  " + lastValue[0])

                if (lastValue[0] > firstValue[0]) { //TODO better concept for when trend is up/downwarding
                    return arrow_up
                } else if (lastValue[0] === firstValue[0]) {
                    if (valuesY[lastValue[1] - 1] > firstValue[0]) {
                        return arrow_up
                    } else {
                        return arrow_down
                    }
                } else {
                    return arrow_down
                }
                /*if (yAxisAttr === "Average HRV") {
                    //an upward HRV trend implies that you've recovered well, a downward trend that you should keep an eye on qour recovery status
                } else if (yAxisAttr === "Lowest Resting Heart Rate") {
                    //a downward resting hr trend  implies that you've recovered well, an upward trend that simething may be challenging your recovery
                }*/

            }
            gNew
                .selectAll("image")
                .data(data)
                .enter()
                .append("svg:image")
                .attr("xlink:href", function (d) {
                    //console.log(d)
                    if (xAxisAttr === "week") {
                        return getArrowOrientation(d)
                    } else {
                        return arrow_down
                    }
                }
                )
                .attr("height", function (d) {
                    var rRealS = func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius")
                    return func.generateRadius(rRealS, radius(rRealS))
                })
                .attr("transform", "translate(" + translateGX + "," + translateGY + ")")
                .style("filter", function (d) {
                    return func.generateColorOfArrow(func.dropDownToValues(d, colorAttr, xAxisAttr, "color"), colorAttr)
                    /*
                    var color = func.generateColor(dropDownToValues(d, colorAttr, "color"))
                    // https://codepen.io/sosuke/pen/Pjoqqp
                    if (color === "#265323") {
                        return "invert(30%) sepia(6%) saturate(3976%) hue-rotate(69deg) brightness(86%) contrast(94%)"
                    } else if (color === "#52BA31") {
                        return "invert(58%) sepia(40%) saturate(713%) hue-rotate(60deg) brightness(96%) contrast(102%)"
                    } else if (color === "#FF7F50") {
                        return "invert(63%) sepia(21%) saturate(3176%) hue-rotate(326deg) brightness(102%) contrast(101%)"
                    } else if (color === "#99154E") {
                        return "invert(13%) sepia(56%) saturate(5056%) hue-rotate(320deg) brightness(90%) contrast(93%)"
                    } else {
                        return "invert(55%) sepia(95%) saturate(645%) hue-rotate(168deg) brightness(90%) contrast(88%)"
                    }*/
                })
                .attr("x", function (d) {
                    var xS = xScale(func.dropDownToValues(d, xAxisAttr, xAxisAttr, "xAxis"))
                    var rRealS = func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius")
                    var rS = func.generateRadius(rRealS, radius(rRealS))
                    return xS - rS
                })
                .attr("y", function (d) {
                    var yS = yScale(func.dropDownToValues(d, yAxisAttr, xAxisAttr, "yAxis"))
                    var rRealS = func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius")
                    var rS = func.generateRadius(rRealS, radius(rRealS))
                    return yS - rS
                })
                .on("mouseover", function (event, f) {
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '.6');

                    //handleRect(true, event.x / (2), event.y / 2) //TODO
                    //handleRect(true, x, y)
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
                    //d3.selectAll("#linePlotRec").remove()
                    //d3.selectAll("#rectSVGRec").remove()
                    d3.selectAll("#rectSVGRec")
                        .attr("x",1000)
                        .attr("y", 1000)
                });


            //////////////////* rectangles when mouse over */////////////////////////////////////////////////////////////////////////////////////////////

            function handleRect(mouseOver, xV, yV, d) {
                var t = 0.8
                var yVal = 0

                var rectSVG = svg
                    .append("svg")
                    .attr("class", "rectSVG")
                    .attr("id", "rectSVGRec")

                var rect = rectSVG.append('rect')
                    .attr("height", 350)
                    .attr("width", 370)
                    .style("opacity", 0)
                    .attr("class", "rectValues")
                    .attr("rx", 6)
                    .attr("ry", 6);

                var rectSmallSVG = rectSVG
                    .append("svg")
                    .attr("width", 300)
                    .attr("height", 300)
                    .style("opacity", 0)
                    .attr("class", "rectT")

                var rectArr = []
                var rectArr2 = []
                for (var i = 0; i < 5; i++) {
                    rectArr.push(createRect(rectSVG))
                    rectArr2.push(createRect(rectSVG))

                }
                rectArr.push(rectSmallSVG)


                if (mouseOver) {
                    rectValue(d, xV, yV, rectArr, rectArr2, rectSVG, rect)


                    function translateRect(r, translX, translY) {
                        //r.attr("x", xV + translX - 200)
                        //r.attr("y", yV + translY - 300)
                        r.attr("x", xV + translX)
                        r.attr("y", yV + translY)
                    }
                    translateRect(rect, 0, 0)
                    var xVal = 75
                    yVal = 20
                    rectArr.forEach(element => {
                        translateRect(element, xVal, yVal)
                        yVal += 20
                    })
                    rectArr[5].attr("x", 10 + xV)
                    var xVal2 = 10
                    var yVal2 = 20
                    rectArr2.forEach(element => {
                        translateRect(element, xVal2, yVal2)
                        yVal2 += 20
                    })
                } else {
                    t = 0
                }
                func.opacityChange(rect, t)
                rectArr.forEach(element => func.opacityChange(element, t));
                rectArr2.forEach(element => func.opacityChange(element, t));
            }
            /*function round(obj) {
                return Math.round((parseFloat(obj) + Number.EPSILON) * 100) / 100
            }*/
            /**
             * give rectangle values when mouse over
             **/
            function rectValue(d, xV, yV, rectArr, rectArr2, rectSVG, rect) {
                if (xAxisAttr === "week") {
                    func.editRectanglesPopUp(d, rectArr, rectArr2, xAxisAttr, yAxisAttr, radiusAttr, colorAttr)

                    createLinePlot(d, 300, 300, rectArr)

                } else {
                    /*rectT0.text(d.date)
                        .attr("id", "dateValue")
                        .attr("font-weight", 700)
                    //rectT1.text(xAxisAttr + " " + dropDownToValues(d, xAxisAttr) )
                    rectT1.text("Horizontal - " + xAxisAttr + ": " + func.getRepresentableValue((dropDownToValues(d, xAxisAttr, "xAxis")), xAxisAttr, false))
                    rectT2.text("Vertical - " + yAxisAttr + ": " + func.getRepresentableValue((dropDownToValues(d, yAxisAttr, "yAxis")), yAxisAttr, false))
                    rectT3.text("Radius - " + radiusAttr + ": " + func.getRepresentableValue((dropDownToValues(d, radiusAttr, "radius")), radiusAttr, false))
                    rectT4.text("Color - " + colorAttr + ": " + func.getRepresentableValue((dropDownToValues(d, colorAttr, "color")), colorAttr, false))
                    //rectT5.text("\uf107 more").attr("class", " fas rectT")
                    */
                }

            }

            function createRect(obj) {
                return obj.append("text")
                    //.attr('x', 100)
                    //.attr('y', height + 180)
                    .style("opacity", 0)
                    .text("Test")
                    .attr("class", "rectT");
            }
            //createPieChart(data, 300, 300)
            function createLinePlot(dataSet, xPos, yPos, rectArr) {
                //let csvHeader = ["Value"];
                var values = [dataSet.YValue0, dataSet.YValue1, dataSet.YValue2, dataSet.YValue3, dataSet.YValue4, dataSet.YValue5, dataSet.YValue6]
                //var weekDataString = "\n" + dataSet.YValue0 + "\n" + dataSet.YValue1 + "\n" + dataSet.YValue2 + "\n" + dataSet.YValue3 + "\n" + dataSet.YValue4 + "\n" + dataSet.YValue5 + "\n" + dataSet.YValue6
                //var weekData = csvHeader + weekDataString;
                //var weekDataCSV = d3.csvParse(weekData)

                const margin = { top: 30, right: 30, bottom: 30, left: 60 },
                    width = 300 - margin.left - margin.right,
                    height = 200 - margin.top - margin.bottom; // Use the window's height

                // The number of datapoints
                var n = 7;

                var xScale = d3.scaleLinear()
                    .domain([0, n - 1]) // input
                    .range([0, width - 30]); // outpu
                var weekDays = ["Mon", "Tue", "Wen", "Th", "Fri", "Sat", "Sun"]
                var xScale2 = d3.scaleBand().range([0, width])
                xScale2.domain(weekDays.map(function (d) {
                    return d;
                }));
                var notFull = []
                values.forEach(element => {
                    if (element !== "") {
                        notFull.push(element)
                    }
                })
                var lengthNewArray = 7 - notFull.length
                var newNotFull = []
                for (let i = 0; i <= lengthNewArray - 1; i++) {
                    newNotFull[i] = undefined
                }
                for (let i = 0; i <= notFull.length - 1; i++) {
                    if (yAxisAttr === "Temperature Deviation") {
                        newNotFull.push(parseFloat(notFull[i]))
                    } else {
                        newNotFull.push(parseInt(notFull[i]))
                    }
                }
                var max = d3.max(newNotFull)

                if (yAxisAttr === "Temperature Deviation") {
                    var yScale = d3.scaleLinear()
                        .domain([parseFloat(d3.min(newNotFull)), parseFloat(max)]) // input 
                        .range([height, 0]); // output 
                } else {
                    yScale = d3.scaleLinear()
                        .domain([parseInt(d3.min(newNotFull)), parseInt(max)]) // input 
                        .range([height, 0]); // output 
                }

                var line = d3.line()
                    .x(function (d, i) { return xScale(i); }) // set the x values for the line generator
                    .y(function (d) {
                        if (d === undefined) {
                            return yScale(max + 5) //TODO
                        } else {
                            return yScale(d);
                        }
                    }) // set the y values for the line generator 
                    .curve(d3.curveMonotoneX) // apply smoothing to the line

                var linePlot = rectArr[5]
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")
                    .attr("id", "linePlotRec")

                linePlot.append("g")
                    .attr("class", "xAxis")
                    .attr("id", "xAxisAppendRecLine")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(xScale2)); // Create an axis component 
                func.generateArrowRec(svg, 'arrowhead-rightRecLine', 0, 13, 'M 0 0 L 12 7 L 0 14 L 1 1 L 1 14')
                svg.select('#xAxisAppendRecLine path.domain')
                    .attr('marker-end', 'url(#arrowhead-rightRecLine)');

                linePlot.append("g")
                    .attr("class", "YAxis")
                    .attr("id", "yAxisAppendRecLine")
                    .call(d3.axisLeft(yScale)); // Create an axis component 
                func.generateArrowRec(linePlot, 'arrowhead-upRecLine', 2, 12, 'M 0 12 L7 0 L14 12 L0 12')
                svg.select('#yAxisAppendRecLine path.domain')
                    .attr('marker-end', 'url(#arrowhead-upRecLine)');

                // Append the path, bind the data, and call the line generator 
                linePlot.append("path")
                    .datum(newNotFull) // Binds data to the line 
                    .attr("class", "line") // Assign a class for styling 
                    .attr("d", line) // Calls the line generator 
                    .style("fill", "none")
                    .style("stroke", "white")
                    .style("stroke-width", "1")
                    .attr("transform", "translate(" + 15 + "," + 0 + ")")

                // Appends a circle for each datapoint 
                linePlot.selectAll(".dot")
                    .data(newNotFull)
                    .enter()
                    .append("circle") // Uses the enter().append() method
                    .attr("class", "dot") // Assign a class for styling
                    .attr("fill", function (d) {
                        if (isNaN(yScale(d))) {
                            return "none"
                        } else {
                            return "white"
                        }
                    })
                    .attr("cx", function (d, i) { return xScale(i) })
                    .attr("cy", function (d) {
                        return yScale(d)
                    })
                    .attr("r", 5)
                    .attr("transform", "translate(" + 15 + "," + 0 + ")")

                //remove old label
                d3.select("#xAxisLinePlotRec").remove()
                //x axis description
                linePlot.append('text')
                    .attr('x', width / 2)
                    .attr('y', height + 40)
                    .attr('text-anchor', 'middle')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 12)
                    .text(
                        function (d) {
                            return "weekdays - monday to sunday";
                        }
                    ).attr("id", "xAxisLinePlotRec");

                //remove old label
                d3.select("#yAxisLinePlotRec").remove()
                // Y label/new Y label
                rectArr[5].append('text')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'translate(20,' + (height / 2 + 45) + ')rotate(-90)')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 12)
                    .text(
                        function (d) {
                            return "vertical - " + yAxisAttr;
                        })
                    .attr("id", "yAxisLinePlotRec");
                /*rectT5.append("rect")
                    .attr("width", 300)
                    .attr("height", 30)
                    .style("fill", "#34A5DA")
                    .style("opacity", 0.6)*/
                //remove old headline
                d3.select("#headlineLinePlotRec").remove()
                // headline lineplot
                rectArr[5].append('text')
                    .attr('text-anchor', 'left')
                    .attr('x', 0) //width/2 + margin.left
                    .attr('y', 11)
                    .style('font-family', 'Helvetica')
                    .style('font-size', 15)
                    .text(
                        function (d) {
                            return "Lineplot to display individual days";
                        })
                    .attr("id", "headlineLinePlotRec");


            }
        }


        if (!isLoaded) {
            getOuraDataFormatted()
            setIsLoaded(true)
            setXAxisAttr("week")

        } else {
            if (xAxisAttr === "week") setTimeVal("week")
            else if (xAxisAttr === "date") setTimeVal("date")
            else { setTimeVal("none") }
            updateData(ouraDataNew)
        }

    }, [bigScreen, bigScreenVal, ouraDataNew, xAxisAttr, yAxisAttr, radiusAttr, colorAttr, isLoaded])

    var yAxisIds = ["yAxisLowestRestingHeartRateR", "yAxisAverageHRVR"]
    var radiusIds = ["radiusRespiratoryRateR", "radiusReadinessScoreR", "yAxisLowestRestingHeartRateR"]
    var colorIds = ["colorReadinessScoreR", "colorRecoveryIndexScoreR"]

    function yAxisOnSelect(k) {
        d3.selectAll('#custom-switch').property('checked', false);
        setYAxisAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, yAxisIds, "yAxis", "R")
    }

    function colorOnSelect(k) {
        setColorAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, colorIds, "color", "R")
    }

    function radiusOnSelect(k) {
        setRadiusAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, radiusIds, "radius", "R")
    }

    function onChangeMenstruationView(event) {
        if (event.target.checked) {
            setYAxisAttr("Temperature Deviation")
            yAxisIds.forEach(element => {
                d3.select("#" + element).style("background-color", "white")
                d3.select("#" + element).style("color", "#666666")
            })
        } else {
            setYAxisAttr("Average HRV")
            d3.select("#yAxisAverageHRVR").style("background-color", "#34a5daa6")
            d3.select("#yAxisAverageHRVR").style("color", "white")
        }
    }

    var menstruationText = "If you track your menstrual cycle, you may spot monthly patterns in your body temperature trend view. \nVariations are shown in relation to your baseline, represented by 0.0 in the body temperature deviation graph.\n\n -- These descriptions are partly taken from Oura --"
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
                        <svg width="3000px" height="900px" id="svgRecovery"></svg>
                    </div>
                    <div className="column-3Sleep" >
                        <Accordion id="ControlAccordion" defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <div>
                                        <h5>Controls</h5>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup variant="flush" className="listgroup">
                                        <ListGroup.Item>
                                            <div id="yAxis" className="dropdownDiv">
                                                <h1>Vertical</h1>
                                                <div id="periodModeSwitchDiv">
                                                    <Form.Check
                                                        type="switch"
                                                        id="custom-switch"
                                                        label="Menstruation view"
                                                        onChange={(k) => onChangeMenstruationView(k)}
                                                    /><InformationMode id="infoMode" modeName="Menstruation view"
                                                        modeText={menstruationText}
                                                        placement="bottom" />
                                                </div>
                                                <br></br>
                                                <DropdownButton id="yAxisChoiceRec" onSelect={(k) => yAxisOnSelect(k)} title={yAxisAttr} className="select-wrapper">
                                                    <Dropdown.Item href="#/Lowest Resting Heart Rate" id="yAxisLowestRestingHeartRateR" className="yAxisItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                        Lowest Resting Heart Rate
                                                        <Badge id="badge6">Recovery</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Average HRV" id="yAxisAverageHRVR" className="yAxisItem" style={{ color: '#666666' }}>
                                                        Average HRV
                                                        <Badge id="badge6">Recovery</Badge>
                                                    </Dropdown.Item>
                                                </DropdownButton>
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <div id="radius" className="dropdownDiv">
                                                <h1>Arrow size</h1>
                                                <DropdownButton id="radiusChoice" onSelect={(k) => radiusOnSelect(k)} title={radiusAttr} className="select-wrapper">
                                                    <Dropdown.Item href="#/Respiratory Rate" className="radiusItem" id="radiusRespiratoryRateR" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                        Respiratory Rate
                                                        <Badge id="badge6">Recovery</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Readiness Score" className="radiusItem" id="radiusReadinessScoreR" style={{ color: '#666666' }}>
                                                        Readiness Score
                                                        <Badge id="badge6">Recovery</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Lowest Resting Heart Rate" id="yAxisLowestRestingHeartRateR" className="yAxisItem" style={{ color: '#666666' }}>
                                                        Lowest Resting Heart Rate
                                                        <Badge id="badge6">Recovery</Badge>
                                                    </Dropdown.Item>
                                                </DropdownButton>
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <div id="color" className="dropdownDiv">
                                                <h1>Color</h1>
                                                <DropdownButton id="radiusChoice" onSelect={(k) => colorOnSelect(k)} title={colorAttr} className="select-wrapper">
                                                    <Dropdown.Item href="#/Readiness Score" id="colorReadinessScoreR" className="colorItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                        Readiness Score
                                                        <Badge id="badge6">Recovery</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Recovery Index Score" id="colorRecoveryIndexScoreR" className="colorItem" style={{ color: '#666666' }}>
                                                        Recovery Index Score
                                                        <Badge id="badge6">Recovery</Badge>
                                                    </Dropdown.Item>

                                                </DropdownButton>
                                            </div>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </div>
            </div >
            <div className="column-1Sleep">
                <Card id="labelDescriptionColor">
                    <Card.Header as="div">
                        <div id="colorLegendLabelDiv">
                            <h5 id="colorLabelDescriptionR">Color legend</h5>
                            <InformationMode key="128" id="infoMode" modeName={colorInfoHeader} modeText={colorInfoText} placement="right" />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <br></br>
                        <div id="colorLegendDiv">

                            <div width="200" height="20" id="colorDescription0">
                                <svg width="20" height="20" id="colorDescriptionSVGR0"></svg>
                                <p id="colorDescriptionTextR0"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription1">
                                <svg width="20" height="20" id="colorDescriptionSVGR1"></svg>
                                <p id="colorDescriptionTextR1"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription2">
                                <svg width="20" height="20" id="colorDescriptionSVGR2"></svg>
                                <p id="colorDescriptionTextR2"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription3">
                                <svg width="20" height="20" id="colorDescriptionSVGR3"></svg>
                                <p id="colorDescriptionTextR3"></p>
                            </div>
                        </div>
                        <br></br><br></br>
                    </Card.Body>
                </Card>
                <Card id="labelDescriptionAvgRadiusRec">

                    <Card.Header as="div"><h5 id="arrowValRec">Arrow orientation</h5>
                    </Card.Header>
                    <Card.Body>
                        <div id="colorLegendDiv">
                            <br></br>

                            <div width="200" height="20" id="colorDescription3">
                                <div width="200" height="20" id="arrowExplanationDivUp">
                                    <img alt="arrowUp" src={arrow_up_grey} id="arrowDescriptionImg" />
                                    <p id="arrowDescriptionUpRec"></p>
                                </div>
                                <br></br>
                                <br></br>

                                <div width="200" height="20" id="arrowExplanationDivDown">
                                    <img alt="arrowDown" src={arrow_down_grey} id="arrowDescriptionImg" />
                                    <p id="arrowDescriptionDownRec"></p>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <br></br>
                <Card id="labelDescriptionAxis">
                    <Card.Header as="div"><h5>Average of values</h5>
                    </Card.Header>
                    <Card.Body>
                        <div id="radiusDescriptionDiv">
                            <div width="200" height="40" id="radiusDiv">
                                <ListGroup id="ListGroupAxis" variant="flush" className="listgroup">
                                    <ListGroup.Item>
                                        <div id="topAverage">
                                            <p id="radiusValRecVal">Value</p>
                                            <p id="radiusValRecVal2">Value</p>

                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div>
                                            <p id="colorValRecVal">Value</p>
                                            <p id="colorValRecVal2">Value</p>

                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div>
                                            <p id="yAxisValRecVal">Value</p>
                                            <p id="yAxisValRecVal2">Value</p>

                                        </div>
                                    </ListGroup.Item>
                                    {/*<h1 id="radiusLabelDescription" >Radius and Color</h1>*/}
                                </ListGroup>
                            </div>
                        </div >
                    </Card.Body>
                </Card>
            </div>
            
        </div>
    )
}

