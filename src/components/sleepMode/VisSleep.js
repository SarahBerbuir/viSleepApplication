import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import ouraData from '../csv/oura_08-09_trends.csv'
import { Accordion, Card, Form, ListGroup, Badge, Dropdown, DropdownButton, Row, Col } from 'react-bootstrap';
import InformationMode from '../InformationMode';
import * as func from '../functions'


export default function VisSleep({ bigScreenVal }) {
    const [timeVal, setTimeVal] = useState("none")
    const [xAxisAttr, setXAxisAttr] = useState("Sleep Score")
    const [yAxisAttr, setYAxisAttr] = useState("Total Sleep Time")
    const [radiusAttr, setRadiusAttr] = useState("REM Sleep Time")
    const [colorAttr] = useState("Total Sleep Time")
    const [ouraDataNew, setOuraDataNew] = useState([])
    const [colorInfoHeader, setColorInfoHeader] = useState("Total Sleep Time")
    const [colorInfoText, setColorInfoText] = useState(func.getInfoText("Total Sleep Time"))
    const [isLoaded, setIsLoaded] = useState(false)
    const [bigScreen, setBigScreen] = useState(true)


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

                arrayData[kw][countArray] = [actualKW, element[newYAxisVal], element[newRadius], element[newColor], element.date, element.TotalBedtime, element.AwakeTime, element.LightSleepTime, element.REMSleepTime, element.DeepSleepTime]; //vllt new Date(element.date)?
                countArray += 1
                oldKW = actualKW
            })
            //console.log(arrayData)
            //calculate mean per week
            var meanArray = []
            for (i = firstKW; i <= lastKW; i++) {
                var sumOfOneWeekY = 0
                var sumOfOneWeekRad = 0
                var sumOfOneWeekCol = 0
                var awakeSleep = 0
                var lightSleep = 0
                var remSleep = 0
                var deepSleep = 0
                var countOfDays = 0
                var sumOfAllDates = []
                for (j = 0; j < 7; j++) {
                    if (arrayData[i][j][0] !== null && arrayData[i][j][1] !== null) {
                        sumOfOneWeekY += +(arrayData[i][j][1])
                        sumOfOneWeekRad += +((arrayData[i][j][2]))
                        sumOfOneWeekCol += +((arrayData[i][j][3]))
                        sumOfAllDates[j] = (arrayData[i][j][4])
                        countOfDays += 1

                        awakeSleep += (arrayData[i][j][6] / arrayData[i][j][5]) //awake per day in percent
                        lightSleep += (arrayData[i][j][7] / arrayData[i][j][5]) //lightSleep per day in percent
                        remSleep += (arrayData[i][j][8] / arrayData[i][j][5]) // rem per day in percent
                        deepSleep += (arrayData[i][j][9] / arrayData[i][j][5]) //deep per day in percent
                    }
                }
                //console.log(sumOfAllDates)
                var meanOfWeekY = sumOfOneWeekY / countOfDays
                var meanOfWeekRad = sumOfOneWeekRad / countOfDays
                var meanOfWeekCol = sumOfOneWeekCol / countOfDays
                var meanOfWeekAwake = awakeSleep / countOfDays
                var meanOfWeekLight = lightSleep / countOfDays
                var meanOfWeekREM = remSleep / countOfDays
                var meanOfWeekDeep = deepSleep / countOfDays

                //console.log("Mean of week  y  " + i + " " + meanOfWeekY)
                //console.log("Mean of week  rad  " + i + " " + meanOfWeekRad)
                //console.log("Mean of week  col  " + i + " " + meanOfWeekCol)
                //console.log("Mean of week  col  " + i + " " + formatTime(meanOfWeekCol))
                meanArray.push([i, meanOfWeekY, meanOfWeekRad, meanOfWeekCol, sumOfAllDates, meanOfWeekAwake, meanOfWeekLight, meanOfWeekREM, meanOfWeekDeep]) //3 as default for radius
                sumOfOneWeekY = 0
                sumOfOneWeekRad = 0
                sumOfOneWeekCol = 0
                sumOfAllDates = []
                countOfDays = 0
                awakeSleep = 0
                lightSleep = 0
                remSleep = 0
                deepSleep = 0
            }

            let csvHeader = ["kw", "MeanCat", "MeanRadius", "MeanColor", "Date0", "Date1", "Date2", "Date3", "Date4", "Date5", "Date6", "AwakeTime", "LightSleepTime", "REMSleepTime", "DeepSleepTime",];
            var weekDataString = ""
            //console.log(meanArray)
            meanArray.forEach(element => {
                var dates = "," + element[4] + "," + element[5] + "," + element[6] + "," + element[7] + "," + element[8] + "," + element[9] + "," + element[10]
                weekDataString = weekDataString + "\n" + element[0] + "," + element[1] + "," + element[2] + "," + element[3] + dates + "," + element[11] + "," + element[12] + "," + element[13] + "," + element[14]
            })
            weekDataString = csvHeader + weekDataString
            weekData = d3.csvParse(weekDataString);
            //console.log(weekData)
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

        var svg = d3.select("#svgSleep")

        function updateData(dataset) {



            var data = dataset
            if (xAxisAttr === "week") {
                data = weekParam(dataset)
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
                //avgC = (d3.mean(data, d => func.dropDownToValues(d, colorAttr, xAxisAttr, "color"))),
                minX = (d3.min(data, d => parseFloat(func.dropDownToValues(d, xAxisAttr, xAxisAttr, "xAxis")))), //-1
                maxX = (d3.max(data, d => parseFloat(func.dropDownToValues(d, xAxisAttr, xAxisAttr, "xAxis")))), //+1
                //minY = (d3.min(data, d => dropDownToValues(d, yAxisAttr, "yAxis")))-1,
                minY = (d3.min(data, d => parseFloat(func.dropDownToValues(d, yAxisAttr, xAxisAttr, "yAxis")))),
                maxY = (d3.max(data, d => parseFloat(func.dropDownToValues(d, yAxisAttr, xAxisAttr, "yAxis")))),
                minRadius = (d3.min(data, d => parseFloat(func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius")))),
                maxRadius = (d3.max(data, d => parseFloat(func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius")))),

                //minColor = (d3.min(data, d => parseInt(dropDownToValues(d, colorAttr, "color")))),
                //maxColor = (d3.max(data, d => parseInt(dropDownToValues(d, colorAttr, "color")))) + 1,
                colorSleepPhases = ['#90CBFF', '#40A6FF', '#006DCC', '#004692']


            if (xAxisAttr === "day") {
                var xScale = d3.scaleTime().domain(d3.extent(data, d => timeFormat(d.date))).range([0, width - 50])
            } else if (xAxisAttr === "Bedtime Start") {
                var xScale = d3.scaleTime().domain(d3.extent(data, d => timeFormat(d.BedtimeStart))).range([0, width - 50])
            } else {
                xScale = d3.scaleLinear().domain([minX - 0.5, maxX + 0.5]).range([0, width - 50]);
            }
            if (xAxisAttr === "week") {
                avgY = (d3.mean(data, d => d.MeanCat))
                avgR = (d3.mean(data, d => d.MeanRadius))
                //avgC = (d3.mean(data, d => d.MeanColor))
            }
            var radiusSub = 10
            if (radiusAttr === "Total Sleep Time") radiusSub = 3000
            if (xAxisAttr != "week") {
                var radius = d3.scaleLinear().domain([minRadius - radiusSub, maxRadius]).range([30, 150])
            } else {
                radius = d3.scaleLinear().domain([minRadius - radiusSub, maxRadius]).range([90, 300])

            }
            var yScale = d3.scaleLinear().domain([minY, maxY]).range([height, 0]),
                //radius = d3.scaleLinear().domain([minRadius - radiusSub, maxRadius]).range([30, 150]),
                translateGX = 80,
                translateGY = 100;
            var g = svg.append("g")
                .attr("transform", "translate(" + translateGX + "," + translateGY + ")");

            // Title
            d3.select("#headlineSleep").remove()
            func.appendText(svg, width / 2 + 100, 50, 20, '#666666', 'Sleep Mode', "headlineSleep")
                .attr('text-anchor', 'middle')
                .style('font-family', 'Arial')

            //////////////////* color legend*////////////////////////////////////////////////////////////////////////////////////////////////////////

            createColorLegend()
            function createColorLegend() {
                d3.select("#colorLabelDescriptionS").text("Sleep Stages")
                setColorInfoHeader(colorAttr) //TODO
                setColorInfoText(func.getInfoText(colorAttr))
                function addColorLegend(i, text, color) {
                    d3.select("#rectS" + i).remove()
                    d3.select("#colorDescriptionSVGS" + i)
                        .append("rect")
                        .attr("height", 20)
                        .attr("width", 20)
                        .attr("fill", color)
                        .attr("id", "rectS" + i)
                    d3.select("#colorDescriptionTextS" + i).text(text)
                }
                var i = 4
                var sleepPhases = ["Awake", "Light", "REM", "Deep"]
                while (i >= 0) {
                    //addColorLegend(colors[i], 685, heightColor, 670, heightColorRect, color(colors[i]));
                    addColorLegend(i, sleepPhases[i], colorSleepPhases[i]);
                    i--;
                }
            }

            //////////////////* radius and color average box*////////////////////////////////////////////////////////////////////////////////////////////////////////

            var radiusSVG = d3.select("#radiusSVGSleep")

            createRadiusAndColorAverage()

            function createRadiusAndColorAverage() {
                var x = 35
                var x2 = 90
                var y = 45

                //create minimum circle
                d3.select("#minCircleSleep").remove()
                func.createCircle(radiusSVG, x, y, "#666666", func.generateRadius(minRadius, radius(minRadius)), "minCircleSleep")
                    .style("stroke", "#666666")

                //create average circle
                d3.select("#averageCircleSleep").remove()
                //func.createCircle(radiusSVG, x + 100, y, func.generateColor(parseFloat(avgC), colorAttr), func.generateRadius(parseFloat(avgR), radius(parseFloat(avgR))), "averageCircleGen")
                func.createCircle(radiusSVG, x, y + 50, "#666666", func.generateRadius(parseFloat(avgR), radius(parseFloat(avgR))), "averageCircleSleep")
                    .style("stroke", "#666666")

                //create maximum circle
                d3.select("#maxCircleSleep").remove()
                func.createCircle(radiusSVG, x, y + 100, "#666666", func.generateRadius(maxRadius, radius(maxRadius)), "maxCircleSleep")
                    .style("stroke", "#666666")


                createShowText()
                function createShowText() {
                    var sizeFont = 15
                    func.addText("#svgCircleValSleepHead", radiusAttr)
                    var x2 = x + 35
                    // min circle and  label
                    d3.select("#minimumOfSleep").remove()
                    func.appendText(radiusSVG, x2, y + 5, sizeFont, '#666666', function (d) {
                        return func.getRadiusDescription(false, radiusAttr)
                    }, "minimumOfSleep")

                    //average radius
                    d3.select("#radiusAvgTextSleep").remove()
                    func.appendText(radiusSVG, x2, y + 55, sizeFont, '#666666', "Average ", "radiusAvgTextSleep")

                    // max circle and  label
                    d3.select("#maximumOfSleep").remove()
                    func.appendText(radiusSVG, x2, y + 105, sizeFont, '#666666', function (d) {
                        return func.getRadiusDescription(true, radiusAttr)
                    }, "maximumOfSleep")

                    // average color 
                    //d3.select("#colorAvgValueSleep").remove()
                    //func.appendText(radiusSVG, x - 20, 90, sizeFont, '#666666', "The color grey has no meaning. ", "colorAvgValueSleep")
                }

                //line that shows connection of maximum circle to maximum radius description
                //func.appendRect(radiusSVG, 40, 1, x, 19, '#666666')
                //line that shows connection of average circle to average radius description
                //func.appendRect(radiusSVG, 40, 1, x, y, '#666666')

            }
            //////////////////* axis average box*////////////////////////////////////////////////////////////////////////////////////////////////////////
            createAverage()
            function createAverage() {
                //average horizontal
                var textX = ""
                if (xAxisAttr === "week") {
                    func.addText("#xAxisValSleepVal", "week")

                } else if (xAxisAttr === "day") {
                    textX = "day"
                    func.addText("#xAxisValSleepVal", "date")
                } else {
                    textX = func.getRepresentableValue(avgX, xAxisAttr, true)
                    func.addText("#xAxisValSleepVal", xAxisAttr)
                    func.addText("#xAxisValSleepVal2", textX)

                }

                //average vertical
                func.addText("#yAxisValSleepVal", yAxisAttr)
                func.addText("#yAxisValSleepVal2", func.getRepresentableValue(avgY, yAxisAttr, true))

                //average radius
                func.addText("#radiusValSleepVal", radiusAttr)
                func.addText("#radiusValSleepVal2", func.getRepresentableValue(avgR, radiusAttr, true))

            }

            //////////////////* axis*////////////////////////////////////////////////////////////////////////////////////////////////////////

            createAxis()

            function createAxis() {
                //remove old label
                d3.select("#xAxisLabelSleep").remove()
                d3.select("#xAxisLabelSleep2").remove()

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
                        function () {
                            return "Horizontal  -  ";
                        }
                    ).attr("id", "xAxisLabelSleep");
                svg.append('text')
                    .attr('text-anchor', 'left')
                    .attr('x', width / 2)
                    .attr('y', height - 15 + 170)
                    .style('font-family', 'Helvetica')
                    .style('fill', '#666666')
                    .style('font-size', 16)
                    .text(
                        function () {
                            return func.createAxisLabel(xAxisAttr);
                        })
                    .attr("id", "xAxisLabelSleep2");

                //remove old label
                d3.select("#yAxisLabelSleep").remove()
                d3.select("#yAxisLabelSleep2").remove()

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
                    .attr("id", "yAxisLabelSleep");
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
                    .attr("id", "yAxisLabelSleep2");

                // append x-Axis
                d3.select("#xAxisAppendSleep").remove()
                var objX = g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .attr("id", "xAxisAppendSleep");
                var xax = d3.axisBottom(xScale)
                func.generateAxis(objX, xax, xAxisAttr)
                //create arrow for x axis
                func.generateArrow(svg, 'arrowhead-rightSleep', 0, 15, 'M 0 0 L 17 10 L 0 20 L 1 1 L 1 20')
                svg.select('#xAxisAppendSleep path.domain')
                    .attr('marker-end', 'url(#arrowhead-rightSleep)');


                // append y-Axis
                d3.select("#yAxisAppendSleep").remove()
                var objY = g.append("g")
                    .attr("id", "yAxisAppendSleep");
                var yax = d3.axisLeft(yScale)
                func.generateAxis(objY, yax, yAxisAttr)
                //create arrow for y axis
                func.generateArrow(svg, 'arrowhead-upSleep', 5, 17, 'M 0 17 L10 0 L20 17 L0 17')
                svg.select('#yAxisAppendSleep path.domain')
                    .attr('marker-end', 'url(#arrowhead-upSleep)');

            }

            //////////////////*bubbles*/////////////////////////////////////////////////////////////////////////////////

            d3.selectAll("#pieChartID").remove()
            data.forEach(element => {
                createPieChartBubble(element)
            })

            //////////////////* rectangles when mouse over */////////////////////////////////////////////////////////////////////////////////////////////
            function createRect(obj) {
                return obj.append("text")
                    .style("opacity", 0)
                    .text("Test")
                    .attr("class", "rectT");
            }
            function createSVG(svgObj) {
                return svgObj.append("svg")
                    .attr("width", 300)
                    .attr("height", 300)
                    .style("opacity", 0)
                    .attr("class", "rectT");
            }


            function handleRect(mouseOver, xV, yV, d) {
                console.log(d + "n")
                var t = 0
                var yVal = 0

                var rectSVG = svg
                    .append("svg")
                    .attr("class", "rectSVG")
                    .attr("id", "rectSVGSleep")


                var rect = rectSVG.append('rect')
                    .attr("height", 250)
                    .attr("width", 320)
                    .style("opacity", 0)
                    .attr("class", "rectValues")
                    .attr("rx", 6)
                    .attr("ry", 6);


                var rectArr = []
                var rectArr2 = []
                func.createRectArr(rectArr, rectArr2, rectSVG, rect, xV, yV, "Sleep")
                rectValue(d, rectArr, rectArr2)


            }
            function round(obj) {
                return Math.round((parseFloat(obj) + Number.EPSILON) * 100) / 100
            }
            /**
             * give rectangle values when mouse over
             **/
            function rectValue(d, rectArr, rectArr2) {
                console.log(d)
                func.editRectanglesPopUp(d, rectArr, rectArr2, xAxisAttr, yAxisAttr, radiusAttr, colorAttr)

                /*                if (xAxisAttr === "week") {
                                    rectT02.text("Week " + d.kw)
                                        .attr("id", "dateValue")
                                        .attr("font-weight", 700)
                                    rectT1.text(function () {
                                        return func.getWeekDuration(d)
                                    })
                                    rectT0.text(" ")
                                    rectT12.text(" ")
                                } else if (xAxisAttr === "date") {
                                    rectT0.text(d.date)
                                        .attr("id", "dateValue")
                                        .attr("font-weight", 700)
                                    rectT02.text(" ")
                                    rectT1.text(" ")
                                    rectT12.text(" ")
                                } else {
                                    rectT0.text(d.date)
                                        .attr("id", "dateValue")
                                        .attr("font-weight", 700)
                                    rectT02.text(" ")
                                    rectT1.text(xAxisAttr + ": " + func.getRepresentableValue(func.dropDownToValues(d, xAxisAttr, "xAxis"), xAxisAttr, false))
                                    rectT12.text("Horizontal ").style("font-weight", "bold")
                                }
                                console.log(timeFormat(d.date))
                
                                rectT2.text(yAxisAttr + ": " + func.getRepresentableValue(func.dropDownToValues(d, yAxisAttr, "yAxis"), yAxisAttr, false))
                                rectT22.text("Vertical   ").style("font-weight", "bold")
                                rectT3.text(radiusAttr + ": " + func.getRepresentableValue(func.dropDownToValues(d, radiusAttr, "radius"), radiusAttr, false))
                                rectT32.text("Radius   ").style("font-weight", "bold")
                                rectT4.text(colorAttr + ": " + func.getRepresentableValue(func.dropDownToValues(d, colorAttr, "color"), colorAttr, false))
                                rectT42.text("Color  ").style("font-weight", "bold")
                */
                console.log(d)
                createPieChartHover(d, 40, 50, rectArr, rectArr2)

                createColorLegendHover(rectArr, d)
                function createColorLegendHover(rectArr, d) {
                    d3.selectAll("#colorLegendHoverText").remove()
                    var colorLegendGroup = rectArr[6].append("g").attr("id", "colorLegendHoverGroup")
                    var data = getSleepPhasesData(d)
                    //console.log(data)
                    //old: REM, Dep, Light, Awake
                    //new: ["Awake", "Light", "REM", "Deep"]
                    colorLegendGroup.attr("transform", "translate(100,0)")

                    //Awake
                    func.appendRect(colorLegendGroup, 10, 10, 0, 0, colorSleepPhases[0])
                    colorLegendGroup.append("text")
                        .text("Awake - " + round(data[0].percent * 100) + "%")
                        .attr("x", 15)
                        .attr("y", 10)
                        .style("font-family", "arial")
                        .style("font-size", 14)
                        .style("fill", "#666666")
                        .attr("id", "colorLegendHoverText")

                    //Light
                    func.appendRect(colorLegendGroup, 10, 10, 0, 15, colorSleepPhases[1])
                    colorLegendGroup.append("text")
                        .text("Light   - " + round(data[1].percent * 100) + "%")
                        .attr("x", 15)
                        .attr("y", 25)
                        .style("font-family", "arial")
                        .style("font-size", 14)
                        .style("fill", "#666666")
                        .attr("id", "colorLegendHoverText")

                    //REM
                    func.appendRect(colorLegendGroup, 10, 10, 0, 30, colorSleepPhases[2])
                    colorLegendGroup.append("text")
                        .text("REM  - " + round(data[2].percent * 100) + "%")
                        .attr("x", 15)
                        .attr("y", 40)
                        .style("font-family", "arial")
                        .style("font-size", 14)
                        .style("fill", "#666666")
                        .attr("id", "colorLegendHoverText")

                    //Deep
                    func.appendRect(colorLegendGroup, 10, 10, 0, 45, colorSleepPhases[3])
                    colorLegendGroup.append("text")
                        .text("Deep  - " + round(data[3].percent * 100) + "%")
                        .attr("x", 15)
                        .attr("y", 55)
                        .style("font-family", "arial")
                        .style("font-size", 14)
                        .style("fill", "#666666")
                        .attr("id", "colorLegendHoverText")


                }

            }



            function getSleepPhasesData(d) {
                if (xAxisAttr === "week") {
                    var remSleep = d.REMSleepTime
                    var awakeSleep = d.AwakeTime
                    var lightSleep = d.LightSleepTime
                    var deepSleep = d.DeepSleepTime
                } else {
                    remSleep = (d.REMSleepTime / d.TotalBedtime)
                    awakeSleep = (d.AwakeTime / d.TotalBedtime)
                    lightSleep = (d.LightSleepTime / d.TotalBedtime)
                    deepSleep = (d.DeepSleepTime / d.TotalBedtime)
                }
                var data = [
                    { phase: "Awake", percent: awakeSleep },
                    { phase: "Light", percent: lightSleep },
                    { phase: "REM", percent: remSleep },
                    { phase: "Deep", percent: deepSleep },
                ]
                console.log(data)
                return data

            }

            function createPieChartBubble(dataSet) {

                var xPos = xScale(func.dropDownToValues(dataSet, xAxisAttr, xAxisAttr, "xAxis"))
                var yPos = yScale(func.dropDownToValues(dataSet, yAxisAttr, xAxisAttr, "yAxis"))
                var radiusVal = func.dropDownToValues(dataSet, radiusAttr, xAxisAttr, "radius")
                var radiusValFin = func.generateRadius(radiusVal, radius(radiusVal))

                var data = getSleepPhasesData(dataSet)

                var ordScale = d3.scaleOrdinal()
                    .domain(data)
                    .range(colorSleepPhases); //light: #BFBFFF //rem:7879FF//deep:5200FE
                var pie = d3.pie().value(function (d) {
                    return d.percent;
                });
                var group = svg.append("g")
                    .attr("id", "pieChartID")
                    .on("mouseover", function (event, f) {

                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', '.8');
                        d3.select(this).attr("translate", function (d) {
                            handleRect(true, (this.getBoundingClientRect().x), (this.getBoundingClientRect().y), dataSet) //TODO
                        })
                    })
                    .on('mouseout', function (d, i) {
                        d3.selectAll("#pieChartHover").remove()
                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', '1');
                        //handleRect(false, 0, 0, d)
                        //d3.selectAll("#rectSVGSleep").remove()
                        d3.selectAll("#rectSVGSleep")
                            .attr("x", 1000)
                            .attr("y", 1000)
                    })

                group.attr("transform", "translate(" + xPos + "," + yPos + ")")
                var arc = group.selectAll("arc")
                    .data(pie(data))
                    .enter()

                var path = d3.arc()
                    .outerRadius(radiusValFin)
                    .innerRadius(0);

                arc.append("path")
                    .attr("d", path)
                    .attr("fill", function (d) {
                        return ordScale(d.data.phase);
                    })
                    .attr("transform", "translate(" + translateGX + "," + translateGY + ")")
                    .attr("id", "pieChartID")
            }
            function createPieChartHover(dataSet, xPos, yPos, rectArr, rectArr2) {

                var data = getSleepPhasesData(dataSet)
                var radiusValFin = 30;
                var ordScale = d3.scaleOrdinal()
                    .domain(data)
                    .range(colorSleepPhases);


                var pie = d3.pie().value(function (d) {
                    return d.percent;
                });
                var group = rectArr[5].append("g").attr("id", "pieChart")

                var arc = group.selectAll("arc")
                    .data(pie(data))
                    .enter();
                var path = d3.arc()
                    .outerRadius(radiusValFin)
                    .innerRadius(0);

                arc.append("path")
                    .attr("d", path)
                    .attr("fill", function (d) { return ordScale(d.data.phase); })
                    .attr("transform", "translate(" + xPos + "," + yPos + ")")
                    .attr("id", "pieChartHover")
            }
        }

        if (!isLoaded) {
            getOuraDataFormatted()
            setIsLoaded(true)

        } else {
            if (xAxisAttr === "week") setTimeVal("week")
            else if (xAxisAttr === "date") setTimeVal("date")
            else { setTimeVal("none") }
            updateData(ouraDataNew)
        }

        //setIsLoaded(true)
    }, [bigScreen, bigScreenVal, ouraDataNew, xAxisAttr, yAxisAttr, radiusAttr, isLoaded, colorAttr])


    var xAxisIds = ["xAxisdayS", "xAxisweekS", "xAxisSleepScoreS", "xAxisSleepEfficiencyS", "xAxisSleepLatencyS"]
    var yAxisIds = ["yAxisTotalSleepTimeS", "yAxisREMSleepTimeS", "yAxisDeepSleepTimeS"]
    var radiusIds = ["radiusREMSleepTimeS", "radiusDeepSleepTimeS", "radiusTotalSleepTimeS", "radiusAwakeTimeS"]

    function xAxisOnSelect(k) {
        setXAxisAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, xAxisIds, "xAxis", "S")
    }

    function yAxisOnSelect(k) {
        setYAxisAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, yAxisIds, "yAxis", "S")
    }

    function radiusOnSelect(k) {
        setRadiusAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, radiusIds, "radius", "S")
    }
    var awakeSleepInfo = "Awake time is the time spent awake in bed before and after falling asleep."
    var lightSleepInfo = "Light sleep makes up about 50% of total sleep time for adults."
    var remSleepInfo = "REM (rapid eye movement) sleep is associated with dreaming, memory consolidation, learning and creativity."
    var deepSleepInfo = "Deep sleep is the most restorative and rejuvenating sleep stage, enabling muscle growth and repair."
    var colorStageText = awakeSleepInfo + "\n" + lightSleepInfo + "\n" + remSleepInfo + "\n" + deepSleepInfo + "\n \n \n -- These descriptions are partly taken from Oura --"

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
                        <svg width="3000px" height="900px" id="svgSleep"></svg>
                        <div id="actualValues"></div>
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
                                            <div id="xAxiss" className="dropdownDiv" >
                                                <h1>Horizontal</h1>
                                                <DropdownButton id="xAxisChoice" onSelect={(k) => xAxisOnSelect(k)} title={xAxisAttr} className="select-wrapper">
                                                    <Dropdown.Item href="#/day" id="xAxisdayS" className="xAxisItem" style={{ color: '#666666' }}>
                                                        day
                                                        <Badge id="badgeTime">Time</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/week" id="xAxisweekS" className="xAxisItem" style={{ color: '#666666' }}>
                                                        week
                                                        <Badge id="badgeTime">Time</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Sleep Score" id="xAxisSleepScoreS" className="xAxisItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                        Sleep Score
                                                        <Badge id="badge4">Sleep</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Sleep Efficiency" id="xAxisSleepEfficiencyS" className="xAxisItem" style={{ color: '#666666' }}>
                                                        Sleep Efficiency
                                                        <Badge id="badge4">Sleep</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Sleep Latency" id="xAxisSleepLatencyS" className="xAxisItem" style={{ color: '#666666' }}>
                                                        Sleep Latency
                                                        <Badge id="badge4">Sleep</Badge>
                                                    </Dropdown.Item>
                                                </DropdownButton>
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <div id="yAxis" className="dropdownDiv">
                                                <h1>Vertical</h1>
                                                <DropdownButton id="yAxisChoice" onSelect={(k) => yAxisOnSelect(k)} title={yAxisAttr} className="select-wrapper">
                                                    <Dropdown.Item href="#/Total Sleep Time" id="yAxisTotalSleepTimeS" className="yAxisItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                        Total Sleep Time
                                                        <Badge id="badge4">Sleep</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/REM Sleep Time" id="yAxisREMSleepTimeS" className="yAxisItem" style={{ color: '#666666' }}>
                                                        REM Sleep Time
                                                        <Badge id="badge4">Sleep</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Deep Sleep Time" id="yAxisDeepSleepTimeS" className="yAxisItem" style={{ color: '#666666' }}>
                                                        Deep Sleep Time
                                                        <Badge id="badge4">Sleep</Badge>
                                                    </Dropdown.Item>
                                                </DropdownButton>
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <div id="radius" className="dropdownDiv">
                                                <h1>Size</h1>
                                                <DropdownButton id="radiusChoice" onSelect={(k) => radiusOnSelect(k)} title={radiusAttr} className="select-wrapper">
                                                    <Dropdown.Item href="#/REM Sleep Time" id="radiusREMSleepTimeS" className="radiusItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                        REM Sleep Time
                                                        <Badge id="badge4">Sleep</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Deep Sleep Time" id="radiusDeepSleepTimeS" className="radiusItem" style={{ color: '#666666' }}>
                                                        Deep Sleep Time
                                                        <Badge id="badge4">Sleep</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Total Sleep Time" id="radiusTotalSleepTimeS" className="radiusItem" style={{ color: '#666666' }}>
                                                        Total Sleep Time
                                                        <Badge id="badge4">Sleep</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Awake Time" id="radiusAwakeTimeS" className="radiusItem" style={{ color: '#666666' }}>
                                                        Awake Time
                                                        <Badge id="badge4">Sleep</Badge>
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
            </div>
            <div className="column-1Sleep">
                <Card id="labelDescriptionColor" >
                    <Card.Header as="div">
                        <div id="colorLegendLabelDiv">
                            <h5 id="colorLabelDescriptionS">Color legend</h5>
                            <InformationMode key="132" id="infoMode" modeName={colorInfoHeader} modeText={colorStageText} placement="right" />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <br></br>
                        <div id="colorLegendDiv">
                            <div width="200" height="20" id="colorDescription0">
                                <svg width="20" height="20" id="colorDescriptionSVGS0"></svg>
                                <p id="colorDescriptionTextS0"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription1">
                                <svg width="20" height="20" id="colorDescriptionSVGS1"></svg>
                                <p id="colorDescriptionTextS1"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription2">
                                <svg width="20" height="20" id="colorDescriptionSVGS2"></svg>
                                <p id="colorDescriptionTextS2"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription3">
                                <svg width="20" height="20" id="colorDescriptionSVGS3"></svg>
                                <p id="colorDescriptionTextS3"></p>
                            </div>
                        </div>
                        <br></br>
                    </Card.Body>
                </Card>
                <br></br>
                <Card id="labelDescriptionAvgRadius">
                    <Card.Header as="div">
                        <h5 id="svgCircleValSleepHead">Average radius</h5>
                    </Card.Header>
                    <Card.Body>
                        <svg width="500" height="200" id="radiusSVGSleep"></svg>
                    </Card.Body>
                </Card>
                <Card id="labelDescriptionAxis" >
                    <Card.Header as="div">
                        <h5>Averages</h5>
                    </Card.Header>
                    <Card.Body>
                        <div id="radiusDescriptionDiv">
                            <ListGroup id="ListGroupAxis" variant="flush" className="listgroup">
                                <ListGroup.Item>
                                    <div id="topAverage">
                                        <p id="xAxisValSleepVal">Value</p>
                                        <p id="xAxisValSleepVal2">Value</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div>
                                        <p id="yAxisValSleepVal">Value</p>
                                        <p id="yAxisValSleepVal2">Value</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div >
                                        <p id="radiusValSleepVal">Value</p>
                                        <p id="radiusValSleepVal2">Value</p>
                                    </div>
                                </ListGroup.Item>

                            </ListGroup>
                        </div >
                    </Card.Body>
                </Card>
            </div>

        </div>
    )
}

