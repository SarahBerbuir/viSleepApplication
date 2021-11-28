import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import * as func from '../functions'
import ouraData from '../csv/oura_08-09_trends.csv'
import { Card, ListGroup, Badge, Dropdown, DropdownButton, Accordion, Form, Col, Row, Modal, Button } from 'react-bootstrap';
import InformationMode from '../InformationMode';
import Activities from './Activities';
import moodDataSet from '../csv/mood.csv'
import sportsDataSet from '../csv/sports.csv'
import smile_veryGood from '../resources/smile_D.svg'
import smile_good from '../resources/smile_).svg'
import smile_neutral from '../resources/smile_|.svg'
import smiley_bad from '../resources/smile_(.svg'
import smile_veryBad from '../resources/smile_(|.svg'

import smile_veryGood_awake from '../resources/color/smile_veryGood_awake.svg'
import smile_veryGood_light from '../resources/color/smile_veryGood_light.svg'
import smile_veryGood_rem from '../resources/color/smile_veryGood_rem.svg'
import smile_veryGood_deep from '../resources/color/smile_veryGood_deep.svg'

import smile_good_awake from '../resources/color/smile_good_awake.svg'
import smile_good_light from '../resources/color/smile_good_light.svg'
import smile_good_rem from '../resources/color/smile_good_rem.svg'
import smile_good_deep from '../resources/color/smile_good_deep.svg'

import smile_neutral_awake from '../resources/color/smile_neutral_awake.svg'
import smile_neutral_light from '../resources/color/smile_neutral_light.svg'
import smile_neutral_rem from '../resources/color/smile_neutral_rem.svg'
import smile_neutral_deep from '../resources/color/smile_neutral_deep.svg'

import smile_bad_awake from '../resources/color/smile_bad_awake.svg'
import smile_bad_light from '../resources/color/smile_bad_light.svg'
import smile_bad_rem from '../resources/color/smile_bad_rem.svg'
import smile_bad_deep from '../resources/color/smile_bad_deep.svg'

import smile_veryBad_awake from '../resources/color/smile_veryBad_awake.svg'
import smile_veryBad_light from '../resources/color/smile_veryBad_light.svg'
import smile_veryBad_rem from '../resources/color/smile_veryBad_rem.svg'
import smile_veryBad_deep from '../resources/color/smile_veryBad_deep.svg'

export default function VisActivity({ bigScreenVal }) {
    const [timeVal, setTimeVal] = useState("none")
    const [xAxisAttr, setXAxisAttr] = useState("Activity Burn")
    const [yAxisAttr, setYAxisAttr] = useState("Average MET")
    const [radiusAttr, setRadiusAttr] = useState("Steps")
    const [colorAttr, setColorAttr] = useState("Inactive Time")
    const [ouraDataNew, setOuraDataNew] = useState([])
    const [colorInfoHeader, setColorInfoHeader] = useState("Inactive Time")
    const [colorInfoText, setColorInfoText] = useState(func.getInfoText("Inactive Time"))
    const [isLoaded, setIsLoaded] = useState(false)
    const [moodData, setMoodData] = useState([])
    const [sportsData, setSportsData] = useState([])
    const [ouraDataIsLoaded, setOuraDataIsLoaded] = useState(false)
    const [moodDataIsLoaded, setMoodDataIsLoaded] = useState(false)
    const [sportsDataIsLoaded, setSportsDataIsLoaded] = useState(false)
    const [bigScreen, setBigScreen] = useState(true)
    const minActSc = 44
    const maxActSc = 100
    var quar = ((maxActSc - minActSc) / 5)
    var sector1 = (minActSc + quar)
    var sector2 = (minActSc + quar * 2)
    var sector3 = (minActSc + quar * 3)
    var sector4 = (minActSc + quar * 4)


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleCloseAttributes = () => {
        setShow(false)
        setYAxisAttr("Medium Activity Time")
    };

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

                arrayData[kw][countArray] = [actualKW, element[newYAxisVal], element[newRadius], element[newColor], element.date, element.ReadinessScore]; //vllt new Date(element.date)?
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
                var sumOfOneWeekSc = 0
                for (j = 0; j < 7; j++) {
                    if (arrayData[i][j][0] != null && arrayData[i][j][1] != null) {
                        sumOfOneWeekY += +(arrayData[i][j][1])
                        sumOfOneWeekRad += +((arrayData[i][j][2]))
                        sumOfOneWeekCol += +((arrayData[i][j][3]))
                        sumOfAllDates[j] = (arrayData[i][j][4])
                        sumOfOneWeekSc += +((arrayData[i][j][5]))
                        countOfDays += 1
                    }
                }
                var meanOfWeekY = sumOfOneWeekY / countOfDays
                var meanOfWeekRad = sumOfOneWeekRad / countOfDays
                var meanOfWeekCol = sumOfOneWeekCol / countOfDays
                var meanOfWeekSc = sumOfOneWeekSc / countOfDays
                meanArray.push([i, meanOfWeekY, meanOfWeekRad, meanOfWeekCol, sumOfAllDates, meanOfWeekSc]) //3 as default for radius
                sumOfOneWeekY = 0
                sumOfOneWeekRad = 0
                sumOfOneWeekCol = 0
                sumOfAllDates = []
                countOfDays = 0
            }
            let csvHeader = ["kw", "MeanCat", "MeanRadius", "MeanColor", "Date0", "Date1", "Date2", "Date3", "Date4", "Date5", "Date6", "MeanScore"];
            var weekDataString = ""
            //console.log(meanArray)
            meanArray.forEach(element => {
                var dates = "," + element[4] + "," + element[5] + "," + element[6] + "," + element[7] + "," + element[8] + "," + element[9] + "," + element[10]
                //console.log(dates)
                weekDataString = weekDataString + "\n" + element[0] + "," + element[1] + "," + element[2] + "," + element[3] + dates + "," + element[11]
                //console.log(weekDataString)
            })
            weekDataString = csvHeader + weekDataString
            weekData = d3.csvParse(weekDataString);
            return weekData
        }

        function activityParam(date, dataSet, isDiary) {
            var returnValue = null
            dataSet.forEach((item) => {
                if (date === item.date) {
                    if (isDiary) returnValue = item.diary
                    else returnValue = item.description
                }
            })
            return returnValue
        }

        function returnSportsValue(date, dataSet) {
            var returnValue = []
            dataSet.forEach((item) => {
                if (date === item.date) {
                    returnValue.push(item)
                }
            })
            return returnValue
        }

        function getOuraDataFormatted() {
            //console.log("getOuraDataFormatted")
            d3.csv(ouraData, function (d) {
                return func.formatDataSet(d)
            }).then(function (data) {
                setOuraDataNew(data)
            });
            d3.csv(moodDataSet, function (d) {
                return d
            }).then(function (data) {
                setMoodData(data)
            });
            d3.csv(sportsDataSet, function (d) {
                return d
            }).then(function (data) {
                setSportsData(data)
            });
        }

        var svg = d3.select("#svgActivity")

        function updateData(dataset) {
            if (xAxisAttr == yAxisAttr) {
                setShow(true)
            }
            console.log(bigScreenVal)
            ///console.log(dataset)
            //console.log(sportsData)
            var data = dataset

            if (xAxisAttr === "week") {
                data = weekParam(dataset)
            }
            var margin = 200
            if (bigScreen || bigScreenVal) {
                var width = 2070 - margin //1650
                var height = 820 - margin //800
                //var width = 2200 - margin //1650
                //var height = 820 - margin //800
            } else {
                width = 1590 - margin //800
                height = 820 - margin //600
            }

            //domainDate = d3.extent(d => d.date);
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

            console.log(minRadius + " " + maxRadius)
            if (xAxisAttr === "day") {
                var xScale = d3.scaleTime().domain(d3.extent(data, d => timeFormat(d.date))).range([0, width - 50])
            } else if (xAxisAttr == "Average MET") {
                xScale = d3.scaleLinear().domain([minX, maxX]).range([0, width - 50]);
            } else {
                xScale = d3.scaleLinear().domain([minX - 0.5, maxX + 0.5]).range([0, width - 50]);
            }
            if (xAxisAttr === "week") {
                avgY = (d3.mean(data, d => d.MeanCat))
                avgR = (d3.mean(data, d => d.MeanRadius))
                avgC = (d3.mean(data, d => d.MeanColor))
            }
            console.log("----" + minRadius + " " + avgR + " " + maxRadius)
            if (xAxisAttr != "week") {
                var radius = d3.scaleLinear().domain([minRadius, maxRadius]).range([100, 300])
            } else {
                radius = d3.scaleLinear().domain([minRadius, maxRadius]).range([220, 400])
            }
            if (yAxisAttr == "Average MET") {
                var yScale = d3.scaleLinear().domain([minY, maxY]).range([height, 0])
            } else {
                yScale = d3.scaleLinear().domain([minY - 0.5, maxY + 0.5]).range([height, 0])
            }
            var translateGX = 80,
                translateGY = 100,
                g = svg.append("g")
                    .attr("transform", "translate(" + translateGX + "," + translateGY + ")");
            // Title
            d3.select("#headlineAct").remove()
            func.appendText(svg, width / 2 + 100, 50, 20, '#666666', 'Activity Mode', "headlineAct")
                .attr('text-anchor', 'middle')
                .style('font-family', 'Arial')

            //////////////////* color legend*////////////////////////////////////////////////////////////////////////////////////////////////////////

            createColorLegend()
            function createColorLegend() {
                d3.select("#colorLabelDescriptionA").text(colorAttr)
                setColorInfoHeader(colorAttr)
                setColorInfoText(func.getInfoText(colorAttr))
                function addColorLegend(i, text, color) {
                    d3.select("#rectA" + i).remove()
                    d3.select("#colorDescriptionSVGA" + i)
                        .append("rect")
                        .attr("height", 20)
                        .attr("width", 20)
                        .attr("fill", color)
                        .attr("id", "rectA" + i)
                    d3.select("#colorDescriptionTextA" + i).text(text)
                }
                var colorsA = func.getColors(colorAttr)
                var colorA = func.getColor(colorsA)
                var i = colorsA.length - 1
                while (i >= 0) {
                    addColorLegend(i, colorsA[i], colorA(colorsA[i]));
                    i--;
                }
            }

            //////////////////* radius and color average box*////////////////////////////////////////////////////////////////////////////////////////////////////////


            createEmojiLegend()

            function createEmojiLegend() {
                var x = 10
                var y = 35
                var emojiSVG = d3.select("#emojiSVGAct")
                //create minimum circle
                d3.select("#veryGood").remove()
                var moods = ["very good", "good", "neutral", "bad", "very bad"]
                d3.selectAll("#emojiImg").remove()
                d3.selectAll("#emojiText").remove()
                moods.forEach(element => {
                    emojiSVG
                        .append("svg:image")
                        .attr("xlink:href", function (d) {
                            //console.log(activityParam(d.date))
                            var mood = element
                            if (mood === "very good") {
                                return smile_veryGood
                            } else if (mood === "good") {
                                return smile_good
                            } else if (mood === "bad") {
                                return smiley_bad
                            } else if (mood === "very bad") {
                                return smile_veryBad
                            } else if (mood === "neutral") {
                                return smile_neutral
                            } else {
                                return smile_neutral
                            }
                        }
                        ).attr("height", 25)
                        .attr("x", x)
                        .attr("y", y)
                        .style("filter", "invert(36%) sepia(8%) saturate(27%) hue-rotate(14deg) brightness(105%) contrast(88%)")
                        .attr("id", "emojiImg")
                    func.appendText(emojiSVG, x + 30, y + 17, 15, '#666666', function (d) {
                        return element
                    }, "emojiText")
                    y += 30
                })
            }

            var radiusSVG = d3.select("#radiusSVGAct")

            createRadiusAndColorAverage()
            function createRadiusAndColorAverage() {
                var x = 50
                var x2 = 90
                var y = 40

                //create minimum circle
                d3.select("#minCircleAct").remove()
                func.createCircle(radiusSVG, x, y, "#666666", func.generateRadius(minRadius, radius(minRadius)) / 2, "minCircleAct")
                    .style("stroke", "#666666")

                //create average circle
                d3.select("#averageCircleAct").remove()
                //func.createCircle(radiusSVG, x + 100, y, func.generateColor(parseFloat(avgC), colorAttr), func.generateRadius(parseFloat(avgR), radius(parseFloat(avgR))), "averageCircleGen")
                func.createCircle(radiusSVG, x, y + 50, "#666666", func.generateRadius(parseFloat(avgR), radius(parseFloat(avgR))) / 2, "averageCircleAct")
                    .style("stroke", "#666666")

                //create maximum circle
                d3.select("#maxCircleAct").remove()
                func.createCircle(radiusSVG, x, y + 100, "#666666", func.generateRadius(maxRadius, radius(maxRadius)) / 2, "maxCircleAct")
                    .style("stroke", "#666666")

                createShowText()
                function createShowText() {
                    var sizeFont = 15
                    func.addText("#svgCircleValActHead", radiusAttr)
                    var x2 = x + 35
                    // min circle and  label
                    d3.select("#minimumOfAct").remove()
                    func.appendText(radiusSVG, x2, y + 5, sizeFont, '#666666', function (d) {
                        return func.getRadiusDescription(false, radiusAttr)
                    }, "minimumOfAct")

                    //average radius
                    d3.select("#radiusAvgTextAct").remove()
                    func.appendText(radiusSVG, x2, y + 55, sizeFont, '#666666', "Average ", "radiusAvgTextAct")

                    // max circle and  label
                    d3.select("#maximumOfAct").remove()
                    func.appendText(radiusSVG, x2, y + 105, sizeFont, '#666666', function (d) {
                        return func.getRadiusDescription(true, radiusAttr)
                    }, "maximumOfAct")
                    /*
                d3.select("#colorUnitTextAct").remove()
                radiusSVG
                    .append("text")
                    .attr('x', x - 20)
                    .attr('y', 105)
                    .style('font-size', sizeFont)
                    .attr('fill', '#666666')
                    .text(getRepresentableValue(avgC, colorAttr, true))
                    .attr("id", "colorUnitTextAct")
                */
                }
                /*d3.select("#line1A").remove()
                d3.select("#line2A").remove()
                d3.select("#line3A").remove()
                d3.select("#line4A").remove()
                d3.select("#line5A").remove()
                //line that shows connection of maximum circle to maximum radius description
                if (xAxisAttr == "week") {
                    func.appendRect(radiusSVG, 40, 1, x, 1, '#666666').attr("id", "line1A")
                    func.appendRect(radiusSVG, 1, 8, x, 1, '#666666').attr("id", "line2A")

                    //line that shows connection of average circle to average radius description
                    func.appendRect(radiusSVG, 40, 1, x, y, '#666666').attr("id", "line3A")

                    //line that shows connection of average circle to average color description
                    func.appendRect(radiusSVG, 1, 40, x, y, '#666666').attr("id", "line4A")
                    func.appendRect(radiusSVG, 40, 1, x, y + 38, '#666666').attr("id", "line5A")

                } else {
                    func.appendRect(radiusSVG, 40, 1, x, 19, '#666666').attr("id", "line1A")
                    func.appendRect(radiusSVG, 1, 8, x, 19, '#666666').attr("id", "line2A")

                    //line that shows connection of average circle to average radius description
                    func.appendRect(radiusSVG, 40, 1, x, y, '#666666').attr("id", "line3A")

                    //line that shows connection of average circle to average color description
                    func.appendRect(radiusSVG, 1, 30, x, y, '#666666').attr("id", "line4A")
                    func.appendRect(radiusSVG, 40, 1, x, y + 30, '#666666').attr("id", "line5A")
                }*/


            }

            //////////////////* axis average box*////////////////////////////////////////////////////////////////////////////////////////////////////////
            createAxisAverage()
            function createAxisAverage() {
                //average horizontal

                //func.addText("#xAxisValActHead", "Horizontal").attr("class", "bold")
                var textX = ""
                if (xAxisAttr === "week") {
                    func.addText("#xAxisValActVal", "week")

                } else if (xAxisAttr === "day") {
                    textX = "day"
                    func.addText("#xAxisValActVal", "date")
                } else {
                    textX = func.getRepresentableValue(avgX, xAxisAttr, true)
                    func.addText("#xAxisValActVal", xAxisAttr)
                    func.addText("#xAxisValActVal2", textX)
                }

                //average vertical
                func.addText("#yAxisValActVal", yAxisAttr)
                func.addText("#yAxisValActVal2", func.getRepresentableValue(avgY, yAxisAttr, true))

                //average radius
                //func.addText("#radiusValGenHead", "Radius").attr("class", "bold")
                func.addText("#radiusValActVal", radiusAttr)
                func.addText("#radiusValActVal2", func.getRepresentableValue(avgR, radiusAttr, true))

                //average color
                //func.addText("#colorValGenHead", "Color").attr("class", "bold")
                func.addText("#colorValActVal", colorAttr)
                func.addText("#colorValActVal2", func.getRepresentableValue(avgC, colorAttr, true))
            }

            //////////////////* axis*////////////////////////////////////////////////////////////////////////////////////////////////////////

            createAxis()

            function createAxis() {
                //remove old label
                d3.select("#xAxisLabelAct").remove()
                d3.select("#xAxisLabelAct2").remove()
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
                    ).attr("id", "xAxisLabelAct");
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
                    .attr("id", "xAxisLabelAct2");

                //remove old label
                d3.select("#yAxisLabelAct").remove()
                d3.select("#yAxisLabelAct2").remove()
                // Y label/new Y label
                svg.append('text')
                    .attr('text-anchor', 'left')
                    .attr('transform', 'translate(40,' + (height) + ')rotate(-90)')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 16)
                    .style('fill', '#666666')
                    .style('font-weight', 'bold')
                    .text(
                        function () {
                            return "Vertical  -  ";
                        })
                    .attr("id", "yAxisLabelAct");
                svg.append('text')
                    .attr('text-anchor', 'left')
                    .attr('transform', 'translate(40,' + (height - 80) + ')rotate(-90)')
                    .style('font-family', 'Helvetica')
                    .style('fill', '#666666')
                    .style('font-size', 16)
                    .text(
                        function (d) {
                            return func.createAxisLabel(yAxisAttr);
                        })
                    .attr("id", "yAxisLabelAct2");

                // append x-Axis
                d3.select("#xAxisAppendAct").remove()
                var objX = g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .attr("id", "xAxisAppendAct");
                var xax = d3.axisBottom(xScale)
                func.generateAxis(objX, xax, xAxisAttr)
                //create arrow for x axis
                func.generateArrow(svg, 'arrowhead-rightAct', 0, 15, 'M 0 0 L 17 10 L 0 20 L 1 1 L 1 20')
                svg.select('#xAxisAppendAct path.domain')
                    .attr('marker-end', 'url(#arrowhead-rightAct)');

                // append y-Axis
                d3.select("#yAxisAppendAct").remove()
                var objY = g.append("g")
                    .attr("id", "yAxisAppendAct");
                var yax = d3.axisLeft(yScale)
                func.generateAxis(objY, yax, yAxisAttr)
                //create arrow for y axis
                func.generateArrow(svg, 'arrowhead-upAct', 5, 17, 'M 0 17 L10 0 L20 17 L0 17')
                svg.select('#yAxisAppendAct path.domain')
                    .attr('marker-end', 'url(#arrowhead-upAct)');
            }

            ///////////////smileys instead of bubbles////////////////////////////////////////////////////////

            var gNewAct = svg.append("g");

            var moodEmojis = svg.selectAll("image");
            moodEmojis.remove()

            gNewAct
                .selectAll("image")
                .data(data)
                .enter()
                .append("svg:image")
                .attr("xlink:href", function (d) {
                    console.log(d.ActivityScore)
                    if (xAxisAttr === "week") {
                        var mood = d.MeanScore
                    } else {
                        mood = d.ActivityScore
                    }
                    var color = func.generateColorOfEmoji(func.dropDownToValues(d, colorAttr, xAxisAttr, "color"), colorAttr)
                    //console.log(activityParam(d.date))
                    //var mood = activityParam(d.date, moodData, false)
                    //console.log(typeof (parseFloat(minY)))
                    if (mood <= sector1) {
                        if (color == "awake") {
                            return smile_veryBad_awake
                        } else if (color == "light") {
                            return smile_veryBad_light
                        } else if (color == "rem") {
                            return smile_veryBad_rem
                        } else if (color == "deep") {
                            return smile_veryBad_deep
                        } else {
                            return smile_veryBad
                        }
                    } else if (mood <= sector2) {
                        if (color == "awake") {
                            return smile_bad_awake
                        } else if (color == "light") {
                            return smile_bad_light
                        } else if (color == "rem") {
                            return smile_bad_rem
                        } else if (color == "deep") {
                            return smile_bad_deep
                        } else {
                            return smiley_bad
                        }
                    } else if (mood <= sector3) {
                        if (color == "awake") {
                            return smile_neutral_awake
                        } else if (color == "light") {
                            return smile_neutral_light
                        } else if (color == "rem") {
                            return smile_neutral_rem
                        } else if (color == "deep") {
                            return smile_neutral_deep
                        } else {
                            return smile_neutral
                        }
                    } else if (mood <= sector4) {
                        if (color == "awake") {
                            return smile_good_awake
                        } else if (color == "light") {
                            return smile_good_light
                        } else if (color == "rem") {
                            return smile_good_rem
                        } else if (color == "deep") {
                            return smile_good_deep
                        } else {
                            return smile_good
                        }
                    } else if (mood <= maxActSc) {
                        if (color == "awake") {
                            return smile_veryGood_awake
                        } else if (color == "light") {
                            return smile_veryGood_light
                        } else if (color == "rem") {
                            return smile_veryGood_rem
                        } else if (color == "deep") {
                            return smile_veryGood_deep
                        } else {
                            return smile_veryGood
                        }
                    } else {
                        return smile_neutral
                    }

                    //return smile_good
                }
                )
                .attr("height", function (d) {
                    var rVal = func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius")
                    return func.generateRadius(rVal, radius(rVal))
                })
                .attr("transform", "translate(" + translateGX + "," + translateGY + ")")
                /*.style("filter", function (d) {
                    var color = func.generateColor(func.dropDownToValues(d, colorAttr, xAxisAttr, "color"), colorAttr)
                    return func.generateColorOfArrow(func.dropDownToValues(d, colorAttr, xAxisAttr, "color"), colorAttr)
                })*/
                .attr("x", function (d) {
                    var xScaleVal = xScale(func.dropDownToValues(d, xAxisAttr, xAxisAttr, "xAxis"))
                    var genRad = func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius")
                    var rScaleVal = func.generateRadius(genRad, radius(genRad))
                    return xScaleVal - rScaleVal
                })
                .attr("y", function (d) {
                    return yScale(func.dropDownToValues(d, yAxisAttr, xAxisAttr, "yAxis")) - func.generateRadius(func.dropDownToValues(d, radiusAttr, xAxisAttr, "radius"))
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
                    //d3.selectAll("#linePlotRec").remove()
                    //d3.selectAll("#element").remove()
                    //d3.selectAll("#rectSVGAct").remove()
                    d3.selectAll("#rectSVGAct")
                        .attr("x", 1000)
                        .attr("y", 1000)
                });

            //////////////////* rectangles when mouse over */////////////////////////////////////////////////////////////////////////////////////////////

            function createSVG(targetSVG) {
                return targetSVG
                    .append("svg")
                    .attr("width", 200)
                    .attr("height", 200)
                    .style("opacity", 0)
                    .attr("class", "rectTAct");
            }

            /*function handleRect2(mouseOver, xV, yV, d) {
                var t = 0.8
                var yVal = 0

                var rectSVG = svg
                    .append("svg")
                    .attr("class", "rectSVG")
                    .attr("id", "rectSVGAct")

                var rect = rectSVG.append('rect')
                    .attr("height", 400)
                    .attr("width", 350)
                    .style("opacity", 0)
                    .attr("class", "rectValues")
                    .attr("rx", 6)
                    .attr("ry", 6);

                var rectArr = []
                var rectArr2 = []
                for (var i = 0; i < 5; i++) {
                    rectArr.push(createRect(rectSVG))
                    rectArr2.push(createRect(rectSVG))

                }
                rectArr.push(createRect(rectSVG))
                rectArr.push(createSVG(rectSVG))

                if (mouseOver) {
                    rectValue(d, xV, yV, rectArr, rectArr2, rectSVG, rect)
                    function translateRect(r, translX, translY) {
                        r.attr("x", xV + translX)
                        r.attr("y", yV + translY)
                    }
                    translateRect(rect, 0, 0)
                    var xVal = 85
                    yVal = 20
                    rectArr.forEach(element => {
                        translateRect(element, xVal, yVal)
                        yVal += 20
                    })
                    var xVal2 = 10
                    var yVal2 = 20
                    rectArr2.forEach(element => {
                        translateRect(element, xVal2, yVal2)
                        yVal2 += 20
                    })
                }

                func.opacityChange(rect, t)
                rectArr.forEach(element => func.opacityChange(element, t));
                rectArr2.forEach(element => func.opacityChange(element, t));
                //d3.selectAll("#element").style("opacity", t)
            }*/

            function handleRect(mouseOver, xV, yV, d) {

                var rectSVG = svg
                    .append("svg")
                    .attr("class", "rectSVG")
                    .attr("id", "rectSVGAct")

                var rect = rectSVG.append('rect')
                    .attr("height", 400)
                    .attr("width", 350)
                    .style("opacity", 0)
                    .attr("class", "rectValues")
                    .attr("rx", 6)
                    .attr("ry", 6);

                var rectArr = []
                var rectArr2 = []
                func.createRectArr(rectArr, rectArr2, rectSVG, rect, xV, yV, "Act")
                rectValue(d, xV, yV, rectArr, rectArr2, rectSVG, rect)
            }

            /**
             * give rectangle values when mouse over
             **/
            function rectValue(d, xV, yV, rectArr, rectArr2, rectSVG, rect) {
                func.editRectanglesPopUp(d, rectArr, rectArr2, xAxisAttr, yAxisAttr, radiusAttr, colorAttr)

                if (xAxisAttr === "week") {


                    rect.attr("height", 450)

                }
                createActivitiesAndDiary(d, xV, yV, rectSVG)
            }

            function createActivitiesAndDiary(d, xV, yV, rectSVG) {
                //rectT5.text("\uf107 more").attr("class", " fas rectT")
                var xValType = 15
                var xValDur = 170
                var xValCal = 270
                var yValAct = 210
                var sportsItem = []
                var fontSize = 15
                var rowDistance = 30
                if (xAxisAttr != "week") {
                    sportsItem = returnSportsValue(d.date, sportsData)
                } else {
                    rowDistance = 15
                    fontSize = 10
                    var dates = [d.Date0, d.Date1, d.Date2, d.Date3, d.Date4, d.Date5, d.Date6]
                    dates.forEach(element => {
                        var sportsElements = returnSportsValue(element, sportsData)
                        sportsElements.forEach(singleSportsItem => {
                            sportsItem.push(singleSportsItem)
                        })
                    })
                }
                createActivityRect("Sports and other activities", xV + xValType, yV + 150, 13)
                    .style("font-weight", "bold")
                createActivityRect("Activity description", xV + xValType, yV + 180, 13)
                    .style("font-weight", "bold")
                createActivityRect("Duration", xV + xValDur, yV + 180, 13)
                    .style("font-weight", "bold")
                createActivityRect("Calories", xV + xValCal, yV + 180, 13)
                    .style("font-weight", "bold")
                var sumDuration = 0
                var newY = 0
                sportsItem.forEach(element => {
                    sumDuration += parseInt(element.duration)
                    newY = yV + yValAct
                    createActivityRect(element.description, xV + xValType, newY, fontSize)
                    createActivityRect(func.formatTime(element.duration) + " hours", xV + xValDur, newY, fontSize)
                    createActivityRect(element.calories, xV + xValCal, newY, fontSize)
                    yValAct += rowDistance
                })
                newY = yV + yValAct + 10
                createActivityRect("Sum of all activities", xV + xValType, newY, fontSize).style("font-size", 15)
                createActivityRect(func.formatTime(sumDuration), xV + xValDur, newY, fontSize).style("font-size", 15)

                if (xAxisAttr != "week") {
                    //var moodItem = ["Today I was very nervous I had an exam.", ""]
                    //var moodEmojis = []

                    //var moodItem = activityParam(d.date, moodData, true)
                    var moodItemsRow1 = ["I got a bad grade today", "Today I was very nervous ", "Today was a very regular day, ", "Today was a nice day, the weather was good ", "Today was a really nice day, "]
                    var moodItemsRow2 = ["and had a fight with a friend.", "I had an exam.", "not much happened.", "and I was outside a lot.", " I had dinner with friends and went to the cinema."]

                    var mood = d.ReadinessScore
                    /*if (moodItem == "") {
                        var moodItemNew = "Today I was very nervous I had an exam."
                    } else {
                        moodItemNew = moodItem.diary
                    }*/
                    var moodItem = ""
                    var moodItem2 = ""
                    if (mood <= sector1) {
                        moodItem = moodItemsRow1[0]
                        moodItem2 = moodItemsRow2[0]
                    } else if (mood <= sector2) {
                        moodItem = moodItemsRow1[1]
                        moodItem2 = moodItemsRow2[1]
                    } else if (mood <= sector3) {
                        moodItem = moodItemsRow1[2]
                        moodItem2 = moodItemsRow2[2]
                    } else if (mood <= sector4) {
                        moodItem = moodItemsRow1[3]
                        moodItem2 = moodItemsRow2[3]
                    } else if (mood <= maxActSc) {
                        moodItem = moodItemsRow1[4]
                        moodItem2 = moodItemsRow2[4]
                    } else {
                        moodItem = moodItemsRow1[2]
                        moodItem2 = moodItemsRow2[2]
                    }
                    //console.log(moodItemNew)
                    createActivityRect("\"" + moodItem, xV + xValType, newY + 40, 15)
                        .style("font-style", "oblique")
                        .attr("id", "element")
                        .attr("width", "20px")
                    createActivityRect(moodItem2 + "\"", xV + xValType, newY + 60, 15)
                        .style("font-style", "oblique")
                        .attr("id", "element")
                        .attr("width", "20px")
                }

                function createActivityRect(text, x, y, fontSize) {
                    return createRect(rectSVG)
                        .style("opacity", 1)
                        .text(text)
                        .attr("x", x)
                        .attr("y", y)
                        .style("font-size", fontSize)
                        .attr("id", "element")
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
        }
        if (!isLoaded) {
            getOuraDataFormatted()
            setOuraDataIsLoaded(true)
            setMoodDataIsLoaded(true)
            setSportsDataIsLoaded(true)
            setIsLoaded(true)
        } else {
            //updateData(ouraDataNew)
            if (ouraDataIsLoaded && moodDataIsLoaded) {
                updateData(ouraDataNew)
            }
        }
    }, [bigScreenVal, ouraDataNew, moodData, sportsData, ouraDataIsLoaded, moodDataIsLoaded, sportsDataIsLoaded, isLoaded, xAxisAttr, yAxisAttr, radiusAttr, colorAttr, bigScreen])

    var xAxisIds = ["xAxisdayA", "xAxisweekA", "xAxisActivityBurnA", "xAxisActivityScoreA", "xAxisAverageMETA"]
    var yAxisIds = ["yAxisAverageMETA", "yAxisMediumActivityTimeA", "yAxisActivityBurnA"]
    var radiusIds = ["radiusStepsA", "radiusMediumActivityTimeA"]
    var colorIds = ["colorInactiveTimeA", "colorActivityScoreA"]

    function xAxisOnSelect(k) {
        setXAxisAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, xAxisIds, "xAxis", "A")
    }

    function yAxisOnSelect(k) {
        setYAxisAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, yAxisIds, "yAxis", "A")
    }

    function radiusOnSelect(k) {
        setRadiusAttr(k.replace("#/", ""))
        func.changeColorsOfSelected(k, radiusIds, "radius", "A")
    }

    function colorOnSelect(k) {
        setColorAttr(k.replace("#/", ""))
        //var newK = getNewK("color", k, "G")
        //colorOnlyOne(newK, colorIds)
        func.changeColorsOfSelected(k, colorIds, "color", "A")
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
                        <svg width="3000px" height="900px" id="svgActivity">
                            <Accordion defaultActiveKey="0" id="ControlAccordion">
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
                                                        <Dropdown.Item href="#/day" id="xAxisdayA" className="xAxisItem" style={{ color: '#666666' }}>
                                                            day
                                                            <Badge id="badgeTime">Time</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/week" id="xAxisweekA" className="xAxisItem" style={{ color: '#666666' }}>
                                                            week
                                                            <Badge id="badgeTime">Time</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Activity Burn" id="xAxisActivityBurnA" className="xAxisItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                            Activity Burn
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Activity Score" id="xAxisActivityScoreA" className="xAxisItem" style={{ color: '#666666' }}>
                                                            Activity Score
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Average MET" id="xAxisAverageMETA" className="xAxisItem" style={{ color: '#666666' }}>
                                                            Average MET
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                    </DropdownButton>
                                                </div>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <div id="yAxis" className="dropdownDiv">
                                                    <h1>Vertical</h1>
                                                    <DropdownButton id="yAxisChoice" onSelect={(k) => yAxisOnSelect(k)} title={yAxisAttr} className="select-wrapper">
                                                        <Dropdown.Item href="#/Average MET" id="yAxisAverageMETA" className="yAxisItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                            Average MET
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Medium Activity Time" id="yAxisMediumActivityTimeA" className="yAxisItem" style={{ color: '#666666' }}>
                                                            Medium Activity Time
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Activity Burn" id="yAxisActivityBurnA" className="yAxisItem" style={{ color: '#666666' }}>
                                                            Activity Burn
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item></DropdownButton>
                                                </div>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <div id="radius" className="dropdownDiv">
                                                    <h1>Size</h1>
                                                    <DropdownButton id="radiusChoice" onSelect={(k) => radiusOnSelect(k)} title={radiusAttr} className="select-wrapper">
                                                        <Dropdown.Item href="#/Steps" id="radiusStepsA" className="radiusItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                            Steps
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Medium Activity Time" id="radiusMediumActivityTimeA" className="radiusItem" style={{ color: '#666666' }}>
                                                            Medium Activity Time
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>

                                                    </DropdownButton>
                                                </div>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <div id="color" className="dropdownDiv">
                                                    <h1>Color</h1>
                                                    <DropdownButton id="radiusChoice" onSelect={(k) => colorOnSelect(k)} title={colorAttr} className="select-wrapper">
                                                        <Dropdown.Item href="#/Inactive Time" id="colorInactiveTimeA" className="colorItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                            Inactive Time
                                                            <Badge id="badge5">Activity</Badge>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/Activity Score" id="colorActivityScoreA" className="colorItem" style={{ color: '#666666' }}>
                                                            Activity Score
                                                            <Badge id="badge5">Activity</Badge>

                                                        </Dropdown.Item>
                                                    </DropdownButton>
                                                </div>
                                            </ListGroup.Item>
                                        </ListGroup>

                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                        </svg>
                    </div>
                    <div className="column-3Sleep" >
                        {/*<Accordion id="activityAccordion">
                            <Accordion.Item eventKey="0" >
                                <Accordion.Header id="activityAccordionHeader">Individual Activities</Accordion.Header>
                                <Accordion.Body >
                                    <Row className="g-2">
                                        <Activities />
                                        <Col xs={5}>
                                            <Form.Control type="text" placeholder="New activity" />
                                        </Col>

                                        <Col xs={4}>
                                            <Form.Control type="date" name='date' id="datePicker" placeholder="Due date" defaultValue="Hallo" onChange={(e) => console.log(e.target.value)} />
                                        </Col>

                                        <Col xs={2}>
                                            <DropdownButton id="badgeDropdown" title="cat" >

                                                <Dropdown.Item href="#/SleepBadge">
                                                    <Badge bg="primary" id="badge4">Sleep</Badge>
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <Badge bg="success" id="badge6">Recovery</Badge>
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <Badge id="badge5">Activity</Badge>
                                                </Dropdown.Item>
                                            </DropdownButton>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>*/}
                        <Accordion defaultActiveKey="0" id="ControlAccordion">
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
                                                    <Dropdown.Item href="#/day" id="xAxisdayA" className="xAxisItem" style={{ color: '#666666' }}>
                                                        day
                                                        <Badge id="badgeTime">Time</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/week" id="xAxisweekA" className="xAxisItem" style={{ color: '#666666' }}>
                                                        week
                                                        <Badge id="badgeTime">Time</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Activity Burn" id="xAxisActivityBurnA" className="xAxisItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                        Activity Burn
                                                        <Badge id="badge5">Activity</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Activity Score" id="xAxisActivityScoreA" className="xAxisItem" style={{ color: '#666666' }}>
                                                        Activity Score
                                                        <Badge id="badge5">Activity</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Average MET" id="xAxisAverageMETA" className="xAxisItem" style={{ color: '#666666' }}>
                                                        Average MET
                                                        <Badge id="badge5">Activity</Badge>
                                                    </Dropdown.Item>
                                                </DropdownButton>
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <div id="yAxis" className="dropdownDiv">
                                                <h1>Vertical</h1>
                                                <DropdownButton id="yAxisChoice" onSelect={(k) => yAxisOnSelect(k)} title={yAxisAttr} className="select-wrapper">
                                                    <Dropdown.Item href="#/Average MET" id="yAxisAverageMETA" className="yAxisItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                        Average MET
                                                        <Badge id="badge5">Activity</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Medium Activity Time" id="yAxisMediumActivityTimeA" className="yAxisItem" style={{ color: '#666666' }}>
                                                        Medium Activity Time
                                                        <Badge id="badge5">Activity</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Activity Burn" id="yAxisActivityBurnA" className="yAxisItem" style={{ color: '#666666' }}>
                                                        Activity Burn
                                                        <Badge id="badge5">Activity</Badge>
                                                    </Dropdown.Item></DropdownButton>
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <div id="radius" className="dropdownDiv">
                                                <h1>Size</h1>
                                                <DropdownButton id="radiusChoice" onSelect={(k) => radiusOnSelect(k)} title={radiusAttr} className="select-wrapper">
                                                    <Dropdown.Item href="#/Steps" id="radiusStepsA" className="radiusItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                        Steps
                                                        <Badge id="badge5">Activity</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Medium Activity Time" id="radiusMediumActivityTimeA" className="radiusItem" style={{ color: '#666666' }}>
                                                        Medium Activity Time
                                                        <Badge id="badge5">Activity</Badge>
                                                    </Dropdown.Item>

                                                </DropdownButton>
                                            </div>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <div id="color" className="dropdownDiv">
                                                <h1>Color</h1>
                                                <DropdownButton id="radiusChoice" onSelect={(k) => colorOnSelect(k)} title={colorAttr} className="select-wrapper">
                                                    <Dropdown.Item href="#/Inactive Time" id="colorInactiveTimeA" className="colorItem" style={{ color: 'white', backgroundColor: "#34a5daa6" }}>
                                                        Inactive Time
                                                        <Badge id="badge5">Activity</Badge>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/Activity Score" id="colorActivityScoreA" className="colorItem" style={{ color: '#666666' }}>
                                                        Activity Score
                                                        <Badge id="badge5">Activity</Badge>

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
            <div className="column-1Sleep" >
                <Card id="labelDescriptionColor" >
                    <Card.Header as="div">
                        <div id="colorLegendLabelDiv">
                            <h5 id="colorLabelDescriptionA">Color legend</h5>
                            <InformationMode key="130" id="infoMode" modeName={colorInfoHeader} modeText={colorInfoText} placement="right" />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <br></br>
                        <div id="colorLegendDiv">
                            <div width="200" height="20" id="colorDescription0">
                                <svg width="20" height="20" id="colorDescriptionSVGA0"></svg>
                                <p id="colorDescriptionTextA0"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription1">
                                <svg width="20" height="20" id="colorDescriptionSVGA1"></svg>
                                <p id="colorDescriptionTextA1"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription2">
                                <svg width="20" height="20" id="colorDescriptionSVGA2"></svg>
                                <p id="colorDescriptionTextA2"></p>
                            </div>
                            <div width="200" height="20" id="colorDescription3">
                                <svg width="20" height="20" id="colorDescriptionSVGA3"></svg>
                                <p id="colorDescriptionTextA3"></p>
                            </div>
                        </div>
                        <br></br>
                    </Card.Body>
                </Card>
                <br></br>
                <Card id="labelDescriptionAvgRadius" >
                    <Card.Header as="div">
                        <h5 id="svgCircleValActHead">Meaning of size</h5>
                    </Card.Header>
                    <Card.Body id="cardBody">
                        <svg width="500" height="200" id="radiusSVGAct"></svg>
                    </Card.Body>
                </Card>
                <Card id="labelDescriptionAvgRadius" >
                    <Card.Header as="div">
                        <h5>Mood</h5>
                    </Card.Header>
                    <Card.Body>
                        <svg width="500" height="200" id="emojiSVGAct"></svg>
                    </Card.Body>
                </Card>
                <Card id="labelDescriptionAvgRadius" >
                    <Card.Header as="div"><h5>Averages</h5></Card.Header>
                    <Card.Body>
                        <div id="radiusDescriptionDiv">
                            <ListGroup id="ListGroupAxis" variant="flush" className="listgroup">
                                <ListGroup.Item>
                                    <div id="topAverage">
                                        <p id="xAxisValActVal">Value</p>
                                        <p id="xAxisValActVal2">Value</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div>
                                        <p id="yAxisValActVal">Value</p>
                                        <p id="yAxisValActVal2">Value</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div >
                                        <p id="radiusValActVal">Value</p>
                                        <p id="radiusValActVal2">Value</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div>
                                        <p id="colorValActVal">Value</p>
                                        <p id="colorValActVal2">Value</p>
                                    </div>
                                </ListGroup.Item>

                            </ListGroup>
                        </div >
                        <br></br><br></br>
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

