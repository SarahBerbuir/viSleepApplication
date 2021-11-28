import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'

import ouraData from '../csv/oura_08-09_trends.csv'
import arrow from '../resources/arrow.svg'
import arrow_up from '../resources/arrow_up.svg'
import arrow_down from '../resources/arrow_down.svg'
import arrow_down_con from '../resources/arrow_down_con.svg'
import arrow_up_con from '../resources/arrow_up_con.svg'


import { Card, ListGroup, Badge, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import InformationMode from '../../InformationMode';



export default function VisRecoveryWithXAxis() {
    const [timeVal, setTimeVal] = useState("none")
    const [xAxisAttr, setXAxisAttr] = useState("Sleep Score")
    const [yAxisAttr, setYAxisAttr] = useState("Average HRV")
    const [radiusAttr, setRadiusAttr] = useState("HRV Balance Score")
    const [colorAttr, setColorAttr] = useState("Readiness Score")
    const [ouraDataNew, setOuraDataNew] = useState([])
    const [colorInfoHeader, setColorInfoHeader] = useState("Total Sleep Time")
    const [colorInfoText, setColorInfoText] = useState(getInfoText("Total Sleep Time"))
    const [periodMode, setPeriodMode] = useState(false)
    const [opacityHoverBox, setOpacityHoverBox] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)
    var ouraDataReallyNew = []

    function getInfoText(attr) {
        var totalSleepTimeColorInfo = "The amount of hours you were asleep \n - more than 8 hours: very much sleep \n - between 7 and 8 hours: good sleep time \n - between 6 and 7 hours: neutral sleep time  \n - less than 6 hours: not enough sleep"
        var sleepScoreColorInfo = "The score that reflects your sleep. \n - 85 or more score points: optimal sleep quality \n - between 70 and 85 score points: good sleep quality \n - between 50 and 70 score points: disturbed sleep quality \n - under 50 score points: no sleep quality"
        var activityScoreColorInfo = "The score that reflects your activity. \n - 85 or more score points: very well balance\n - between 70 and 85 score points: well balance \n - between 50 and 70 score points: not really in balance \n - under 50 score points: no balance "
        var readinessScoreColorInfo = "The score that reflects your activity. \n - 85 or more score points: very well recovery \n - between 70 and 85 score points: well recovery \n - between 50 and 70 score points: not fully recovered  \n - under 50 score points: no recovery"
        var inactiveTimeColorInfo = "The amount of hours you were inactive \n - less than 5 hours: not much inactive time \n - between 5 and 8 hours: not so much inactive time \n -between 8 and 12 hours: too much inactive time \n - more than 12 hours: way too much inactive time"
        if (attr == "Total Sleep Time") {
            return totalSleepTimeColorInfo
        } else if (attr == "Activity Score") {
            return activityScoreColorInfo
        } else if (attr == "Readiness Score") {
            return readinessScoreColorInfo
        } else if (attr == "Sleep Score") {
            return sleepScoreColorInfo
        } else if (attr == "Inactive Time") {
            return inactiveTimeColorInfo
        } else {
            return null
        }

    }
    function formatTime(num) {
        var h = Math.floor(num / 3600);
        var m = Math.floor((num - h * 3600) / 60);
        var s = num - (h * 3600 + m * 60);
        return (h < 10 ? "0" + h : h)
            + ":" +
            (m < 10 ? "0" + m : m)
        //+ ":" +             
        //( s < 10 ? "0" + s : s );  
    }

    function formatMinToSs(minutes) {
        var sign = minutes < 0 ? "-" : "";
        var min = Math.floor(Math.abs(minutes));
        var sec = Math.floor((Math.abs(minutes) * 60) % 60);
        return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
    }

    var timeFormat = d3.timeParse("%Y-%m-%d");

    //take oura data and return csv variable with kw, mean of y-axis and x of radius
    function weekParam() {
        var weekData = ""
        var xAxis = "week"
        var kw = 0
        var weekNumbers = {}
        var actualKW = 0
        var data = ouraDataNew
        //find first kw that exists
        var firstDate = new Date(data[0].date);
        var firstKW = new Date().getWeekNumber(firstDate)
        var oldKW = firstKW

        //find last kw that exists
        var lastDate = new Date(data[data.length - 1].date);
        var lastKW = new Date().getWeekNumber(lastDate)
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
            var kw = new Date().getWeekNumber(newDate)
            weekNumbers[kw] = []
            actualKW = kw
            //iterate only through one week for one dimension of the array
            if (countArray > 6 || actualKW != oldKW) {
                countArray = 0
            }
            // arrayData has content in terms of [kw, yAxisValue]

            var newYAxisVal = yAxisAttr.split(' ').join('')
            var newRadius = radiusAttr.split(' ').join('')
            var newColor = colorAttr.split(' ').join('')

            arrayData[kw][countArray] = [actualKW, element[newYAxisVal], element[newRadius], element[newColor], element.date]; //vllt new Date(element.date)?
            countArray += 1

            //console.log("mmmm " + newRadius)
            //console.log(kw + " y element " + element[newYAxisVal])
            //console.log(kw + " color element " + element[newColor])
            //console.log(kw + " " +element[newYAxisVal])
            oldKW = actualKW
        })
        //console.log(arrayData)
        //calculate mean per week
        var meanArray = []
        for (var i = firstKW; i <= lastKW; i++) {
            var sumOfOneWeekY = 0
            var sumOfOneWeekRad = 0
            var sumOfOneWeekCol = 0
            var countOfDays = 0
            var sumOfAllDates = []
            var sumOfAllYValues = []
            for (var j = 0; j < 7; j++) {
                if (arrayData[i][j][0] != null && arrayData[i][j][1] != null) {
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
            //console.log(sumOfAllYValues)
            var meanOfWeekY = sumOfOneWeekY / countOfDays
            var meanOfWeekRad = sumOfOneWeekRad / countOfDays
            var meanOfWeekCol = sumOfOneWeekCol / countOfDays

            //console.log("Mean of week  y  " + i + " " + meanOfWeekY)
            //console.log("Mean of week  rad  " + i + " " + meanOfWeekRad)
            console.log("Mean of week  col  " + i + " " + meanOfWeekCol)
            console.log("Mean of week  col  " + i + " " + formatTime(meanOfWeekCol))
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
        console.log(meanArray)
        meanArray.forEach(element => {

            var dates = "," + element[4] + "," + element[5] + "," + element[6] + "," + element[7] + "," + element[8] + "," + element[9] + "," + element[10]
            var yValues = "," + element[11] + "," + element[12] + "," + element[13] + "," + element[14] + "," + element[15] + "," + element[16] + "," + element[17]
            //console.log(yValues)
            weekDataString = weekDataString + "\n" + element[0] + "," + element[1] + "," + element[2] + "," + element[3] + dates + yValues
            //console.log(weekDataString)
        })
        weekDataString = csvHeader + weekDataString
        weekData = d3.csvParse(weekDataString);
        return weekData
    }

    Date.prototype.getWeekNumber = function (date) {
        var dayNum = date.getUTCDay() || 7;
        date.setUTCDate(date.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        return Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
    };

    function getOuraDataFormatted() {
        //console.log("getOuraDataFormatted")
        var ouraDataNew = []
        d3.csv(ouraData, function (d) {

            d.date = (d['date']); //parseDate
            d.SleepScore = +d['Sleep Score'] //score
            d.TotalSleepScore = +d['Total Sleep Score'] //score
            d.REMSleepScore = +d['REM Sleep Score'] //score
            d.DeepSleepScore = +d['Deep Sleep Score'] //score
            d.SleepEfficiencyScore = +d['Sleep Efficiency Score'] //score
            d.RestfulnesScore = +d['RestfulnessScore'] //score
            d.SleepLatencyScore = +d['Sleep Latency Score'] //score
            d.SleepTimingScore = +d['Sleep Timing Score'] //score
            d.TotalBedtime = +d['Total Bedtime']  //time formatTime(d['Total Bedtime'])
            d.TotalSleepTime = +(d['Total Sleep Time'])  //time
            // d.TotalSleepTimeInSek = +d['Total Sleep Time'] formatTime(d['Total Sleep Time'])
            d.AwakeTime = formatTime(d['Awake Time'])   //time
            d.REMSleepTime = formatTime(d['REM Sleep Time']) //time
            d.LightSleepTime = formatTime(d['Light Sleep Time'])  //time
            d.DeepSleepTime = +d['Deep Sleep Time'] //time formatTime(d['Deep Sleep Time'])
            d.RestlessSleep = d['Restless Sleep']
            d.SleepEfficiency = +d['Sleep Efficiency'] //percent
            d.SleepLatency = formatTime(d['Sleep Latency']) //time
            d.SleepTiming = d['Sleep Timing'] //TODO
            d.BedtimeStart = (d['Bedtime Start']) //TODO
            d.BedtimeEnd = d['Bedtime End'] //"2021-05-23T09:17:54+02:00" TODO
            d.AverageRestingHeartRate = +d['Average Resting Heart Rate'] //bpm number
            d.LowestRestingHeartRate = +d['Lowest Resting Heart Rate'] //bpm number
            d.AverageHRV = +d['Average HRV']  //ms number
            d.TemperatureDeviation = d['Temperature Deviation (°C)'] //TODO
            d.RespiratoryRate = d['Respiratory Rate'] //br/min float TODO
            d.ActivityScore = +d['Activity Score'] //score
            d.StayActiveScore = d['Stay Active Score'] //score
            d.MoveEveryHourScore = d['Move Every Hour Score'] //score
            d.MeetDailyTargetsScore = d['Meet Daily Targets Score'] //score
            d.TrainingFrequencyScore = d['Training Frequency Score'] //score
            d.TrainingVolumeScore = d['Training Volume Score'] //score
            d.RecoveryTimeScore = d['Recovery Time Score,'] //score
            d.ActivityBurn = +d['Activity Burn']  //calories number
            d.TotalBurn = d['Total Burn'] //calories number
            d.TargetCalories = d['Target Calories'] //calories number
            d.Steps = +d['Steps'] //number
            d.DailyMovement = d['Daily Movement']
            d.InactiveTime = +d['Inactive Time'] //time formatTime(d['Inactive Time']) /
            d.RestTime = formatTime(d['Rest Time'])//time
            d.LowActivityTime = formatTime(d['Low Activity Time'])//time
            d.MediumActivityTime = formatTime(d['Medium Activity Time'])//time
            d.HighActivityTime = formatTime(d['High Activity Time'])//time
            d.NonWearTime = formatTime(d['Non-wear Time']) //time
            d.AverageMET = d['Average MET'] //float MET TODO
            d.LongPeriodsofInactivity = d['Long Periods of Inactivity'] //alerts float TODO
            d.ReadinessScore = +d['Readiness Score'] //score
            d.PreviousNightScore = d['Previous Night Score'] //score
            d.SleepBalanceScore = d['Sleep Balance Score'] //score
            d.PreviousDayActivityScore = d['Previous Day Activity Score'] //score
            d.ActivityBalanceScore = d['Activity Balance Score'] //score
            d.TemperatureScore = d['Temperature Score'] //score
            d.RestingHeartRateScore = d['Resting Heart Rate Score'] //score
            d.HRVBalanceScore = +d['HRV Balance Score'] //score
            d.RecoveryIndexScore = d['Recovery Index Score'] //score
            return d
        }).then(function (data) {
            setOuraDataNew(data)
            ouraDataReallyNew = data
        });
    }

    //refresh
    useEffect(() => {
        console.log("refresh")
        getOuraDataFormatted()
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        updateData(ouraDataNew)
        
    }, [ouraDataNew])

    //timeVal
    useEffect(() => {
        console.log("xAxis/time changed")
        if (xAxisAttr == "week") setTimeVal("week")
        else if (xAxisAttr == "date") setTimeVal("date")
        else { setTimeVal("none") }
        //console.log(ouraDataReallyNew)

        if (xAxisAttr == "week") {
            //setRadiusAttr("defaultradius")
            var newData = weekParam()
            //console.log("****++")
            //console.log(newData)
            updateData(newData)
        } else {
            updateData(ouraDataNew)
        }
    }, [xAxisAttr])

    //yAxis
    useEffect(() => {
        console.log("yAxis changed")
        if (xAxisAttr == "week") {
            updateData(weekParam())
        } else {
            updateData(ouraDataNew)
        }
    }, [yAxisAttr])

    //period
    /* useEffect(() => {
         console.log("period changed")
         if (xAxisAttr == "week") {
             updateData(weekParam())
         } else {
             updateData(ouraDataNew)
         }
     }, [periodMode])*/

    //radius
    useEffect(() => {
        console.log("radius changed")
        //console.log(ouraDataNew)
        //if(radiusAttr != "defaultradius"){
        if (xAxisAttr == "week") {
            updateData(weekParam())
        } else {
            updateData(ouraDataNew)
        }
        //}
    }, [radiusAttr])

    //color
    useEffect(() => {
        console.log("color changed")
        //console.log(ouraDataNew)
        //if(radiusAttr != "defaultradius"){
        if (xAxisAttr == "week") {
            updateData(weekParam())
        } else {
            updateData(ouraDataNew)
        }
        //}
    }, [colorAttr])


    var svg = d3.select("#svgRecovery")

    function updateData(dataset) {
        //console.log("xAxis: " + xAxisAttr)
        //console.log("yAxis: " + yAxisAttr)
        //console.log("Radius: " + radiusAttr)
        var data = dataset
        //console.log("...")
        //console.log(data)
        console.log("_____-")
        console.log(data)


        var margin = 200,
            width = 900 - margin, //800
            height = 700 - margin, //600
            xLabel = width - 50,
            //domainDate = d3.extent(d => d.date);
            avgX = (d3.mean(data, d => dropDownToValues(d, xAxisAttr, "xAxis"))),
            avgY = (d3.mean(data, d => dropDownToValues(d, yAxisAttr, "yAxis"))),
            avgR = (d3.mean(data, d => dropDownToValues(d, radiusAttr, "radius"))),
            avgC = (d3.mean(data, d => dropDownToValues(d, colorAttr, "color"))),
            minX = (d3.min(data, d => dropDownToValues(d, xAxisAttr, "xAxis"))), //-1
            maxX = (d3.max(data, d => parseInt(dropDownToValues(d, xAxisAttr, "xAxis")))), //+1
            //minY = (d3.min(data, d => dropDownToValues(d, yAxisAttr, "yAxis")))-1,
            minY = (d3.min(data, d => dropDownToValues(d, yAxisAttr, "yAxis"))) - 1,
            maxY = (d3.max(data, d => parseInt(dropDownToValues(d, yAxisAttr, "yAxis")))) + 1,
            minRadius = (d3.min(data, d => parseInt(dropDownToValues(d, radiusAttr, "radius")))),
            maxRadius = (d3.max(data, d => parseInt(dropDownToValues(d, radiusAttr, "radius")))) + 1,
            minColor = (d3.min(data, d => parseInt(dropDownToValues(d, colorAttr, "color")))),
            maxColor = (d3.max(data, d => parseInt(dropDownToValues(d, colorAttr, "color")))) + 1;


        if (xAxisAttr == "date") {
            var xScale = d3.scaleTime().domain(d3.extent(data, d => timeFormat(d.date))).range([0, width - 50])
        } else {
            var xScale = d3.scaleLinear().domain([minX, maxX]).range([0, width - 50]);
        }
        if (xAxisAttr == "week") {
            avgY = (d3.mean(data, d => d.MeanCat))
            avgR = (d3.mean(data, d => d.MeanRadius))
            avgC = (d3.mean(data, d => d.MeanColor))
        }

        var yScale = d3.scaleLinear().domain([minY, maxY]).range([height, 0]),
            radius = d3.scaleLinear().domain([minRadius, maxRadius]).range([0, 200]),
            translateGX = 100,
            translateGY = 100;
        var g = svg.append("g")
            .attr("transform", "translate(" + translateGX + "," + translateGY + ")");

        // Title
        d3.select("#headlineRec").remove()
        svg.append('text')
            .attr('x', width / 2 + 100)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Arial')
            .style('font-size', 20)
            .text('Recovery Mode')
            .attr("id", "headlineRec")

        var colors = []
        var range = ["#39A96B", "#7FFFD4", "#FF7F50", "#99154E"]

        //////////////////* color */////////////////////////////////////////////////////////////////////////////////////////////
        if (colorAttr == "Total Sleep Time") {
            colors = ["very much sleep time", "good sleep time", "neutral sleep time", "not enough sleep"] //TODO too much sleep?
            //range = ["#99154E", "#FF616D", "#FFC93C", "#66DE93", "#558776"]
        } else if (colorAttr == "Activity Score") {
            colors = ["very well balance", "well balance", "not really in balance", "no balance"] //TODO schönere Namen
        }
        else if (colorAttr == "Sleep Score") {
            colors = ["optimal sleep quality", "good sleep quality", "disturbed sleep quality", "no sleep quality"]
        }
        else if (colorAttr == "Readiness Score") {
            colors = ["very well recovery", "well recovery", "not fully recovered", "no recovery"]
        } else if (colorAttr == "Inactive Time") {
            colors = ["not much inactive time", "not so much inactive time", "too much inactive time", "way too much inactive time"]
        }

        let color = d3
            .scaleOrdinal()
            .domain(colors)
            .range(range);

        //////////////////* color legend*////////////////////////////////////////////////////////////////////////////////////////////////////////

        createColorLegend()
        function createColorLegend() {
            d3.select("#colorLabelDescriptionR").text(colorAttr)
            setColorInfoHeader(colorAttr)
            setColorInfoText(getInfoText(colorAttr))
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
            var i = colors.length - 1
            while (i >= 0) {
                //addColorLegend(colors[i], 685, heightColor, 670, heightColorRect, color(colors[i]));
                addColorLegend(i, colors[i], color(colors[i]));
                i--;
            }
        }

        ////////////////////Form  description  /////////////////////////////////////////////////////////////////
        /*<p id="arrowValRec">p</p>
                                            <p id="arrowDescription"></p>*/
        d3.select("#arrowValRec").text("Y-Axis - " + yAxisAttr)
        d3.select("#arrowDescriptionUpRec").text(function () {
            if (yAxisAttr == "Average HRV") {
                return "An upward HRV trend implies that you've recovered well."
            } else if (yAxisAttr == "Lowest Resting Heart Rate") {
                return "A downward resting heart rate trend implies that you've recovered well."
            } else {
                return "defaultUp"
            }
            /*if (yAxisAttr == "Average HRV") {
                //an upward HRV trend implies that you've recovered well, a downward trend that you should keep an eye on qour recovery status
            } else if (yAxisAttr == "Lowest Resting Heart Rate") {
                //a downward resting hr trend  implies that you've recovered well, an upward trend that simething may be challenging your recovery
            }*/

        })
        d3.select("#arrowDescriptionDownRec").text(function () {
            if (yAxisAttr == "Average HRV") {
                return "A downward trend that you should keep an eye on your recovery status."
            } else if (yAxisAttr == "Lowest Resting Heart Rate") {
                return "An upward trend that something may be challenging your recovery."
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

        function getRepresentableValue(value, attr, withUnit) {
            var unit = ""
            var formattedValue = ""
            var justUnit = ""
            if (attr == "Inactive Time") {
                unit = "hours"
                justUnit = unit
                formattedValue = formatMinToSs(value / 60)
            } else if (attr.includes("Time") || attr.includes("time")) {
                unit = "hours"
                justUnit = unit
                formattedValue = formatTime(value)
            } else if (radiusAttr == "Activity Burn") {
                unit = "cal"
                justUnit = unit
            } else if (radiusAttr == "Steps") {
                unit = "steps"
                justUnit = unit
            } else if (radiusAttr == "Average HRV") {
                unit = "ms"
                justUnit = unit
            } else if (radiusAttr == "Sleep Efficiency") {
                unit = "% / 100%"
                justUnit = "%"
            } else {
                unit = "/ 100 score points"
                justUnit = "score points"
                formattedValue = (Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100)
            }
            if (withUnit) {
                return formattedValue + " " + unit
            } else {
                return formattedValue + " " + justUnit
            }

        }

        createRadiusAndColorAverage()

        function createRadiusAndColorAverage() {
            var x = 50
            var x2 = 90
            var y = 40

            d3.select("#radiusValRec").text("Radius – " + radiusAttr)
            d3.select("#colorValRec").text("Color – " + colorAttr)
            //createShowCircles()
            createShowArrow()
            function createShowCircles() {
                //remove old label
                d3.select("#maxCircleRec").remove()
                radiusSVG.append('circle')
                    .attr('cx', x) //labelX + 40
                    .attr('cy', y) //200
                    .attr("fill", "white")
                    .style("stroke", "#666666")
                    .attr("r", function (d) {

                        return generateRadius(maxRadius);
                    })
                    .attr("id", "maxCircleRec");

                d3.select("#averageCircleRec").remove()
                radiusSVG.append('circle')
                    .attr('cx', x) //labelX + 40
                    .attr('cy', y) //200
                    .attr("fill", generateColor(avgC))
                    .attr("r", function (d) {
                        return generateRadius(avgR);
                    })
                    .attr("id", "averageCircleRec");
            }

            function createShowArrow() {
                d3.select("#averageArrowRec").remove()
                radiusSVG
                    .append("svg:image")
                    .attr("xlink:href", function (d) {
                        //console.log(d)
                        //if (xAxisAttr == "week") {
                        //  return getArrowOrientation(d)
                        //} else {
                        return arrow_down
                    }
                    )
                    .attr("height", function (d) {
                        return generateRadius(avgR) * 2
                    })
                    .style("filter", function (d) {
                        var color = generateColor(avgC)
                        // https://codepen.io/sosuke/pen/Pjoqqp
                        if (color == "#39A96B") {
                            return "invert(48%) sepia(54%) saturate(445%) hue-rotate(94deg) brightness(103%) contrast(96%)"
                        } else if (color == "#7FFFD4") {
                            return "invert(92%) sepia(14%) saturate(1357%) hue-rotate(85deg) brightness(104%) contrast(105%)"
                        } else if (color == "#FF7F50") {
                            return "invert(63%) sepia(21%) saturate(3176%) hue-rotate(326deg) brightness(102%) contrast(101%)"
                        } else if (color == "#99154E") {
                            return "invert(13%) sepia(56%) saturate(5056%) hue-rotate(320deg) brightness(90%) contrast(93%)"
                        } else {
                            return "invert(55%) sepia(95%) saturate(645%) hue-rotate(168deg) brightness(90%) contrast(88%)"
                        }
                    })
                    .attr("y", function () {
                        console.log(y)
                        console.log(y)
                        return y - 10
                    })
                    .attr("x", function () {
                        console.log(x)
                        console.log(x)
                        return x - 10
                    })
                    .attr("id", "averageArrowRec");

                d3.select("#maxArrowRec").remove()
                radiusSVG
                    .append("svg:image")
                    .attr("xlink:href", function (d) {
                        //console.log(d)
                        //if (xAxisAttr == "week") {
                        //  return getArrowOrientation(d)
                        //} else {
                        return arrow_down_con
                    }
                    )
                    .attr("height", function (d) {
                        return generateRadius(maxRadius) * 2
                    })
                    .style("stroke", "black")
                    .attr("y", function () {
                        console.log(y)
                        console.log(y)
                        return y - 20
                    })
                    .attr("x", function () {
                        console.log(x)
                        console.log(x)
                        return x - 20
                    })
                    .attr("id", "maxArrowRec");


            }

            createShowText()
            function createShowText() {
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
                        var avgAttr = getRepresentableValue(avgR, radiusAttr, true)
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

            }

        }
        //!!!
        //update everything after clicking button
        var actualVal = d3.select("#actualValues")
        actualVal.selectAll("p").remove()
        actualVal.append("p").text("X-Axis: " + xAxisAttr)
        actualVal.append("p").text("Y-Axis: " + yAxisAttr)
        actualVal.append("p").text("Radius: " + radiusAttr)

        //////////////////* axis average box*////////////////////////////////////////////////////////////////////////////////////////////////////////
        createAxisAverage()
        function createAxisAverage() {
            d3.select("#xAxisValRec").text("X-axis – " + xAxisAttr)
            d3.select("#yAxisValRec").text("Y-axis – " + yAxisAttr)
            if (xAxisAttr == "week") {
                d3.select("#xAxisAvgValRec")
                    .select("p")
                    .text(" ")
            } else if (xAxisAttr == "date") {
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

        }

        //////////////////* axis*////////////////////////////////////////////////////////////////////////////////////////////////////////

        createAxis()

        function createAxis() {
            //remove old label
            d3.select("#xAxisLabelRec").remove()
            // X label/new X label
            svg.append('text')
                .attr('x', width / 2 + 100)
                .attr('y', height - 15 + 150)
                .attr('text-anchor', 'middle')
                .style('font-family', 'Helvetica')
                .style('font-size', 12)
                .text(
                    function (d) {
                        return createAxisLabel(xAxisAttr);
                    }
                ).attr("id", "xAxisLabelRec");

            //remove old label
            d3.select("#yAxisLabelRec").remove()
            // Y label/new Y label
            svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('transform', 'translate(60,' + height + ')rotate(-90)')
                .style('font-family', 'Helvetica')
                .style('font-size', 12)
                .text(
                    function (d) {
                        return createAxisLabel(yAxisAttr);
                    })
                .attr("id", "yAxisLabelRec");
            createAxisLabel(xAxisAttr)
            function createAxisLabel(attr) {
                if (attr.includes("Score")) {
                    return attr + " - values  from [1,100]"
                } else if (attr == "Sleep Efficiency") {
                    return attr + " - in %"
                } else if (attr == "week") {
                    return attr + " - Monday to Sunday"
                } else if (attr == "Average HRV") {
                    return attr + " - in ms"
                } else if (attr == "Average Resting Heart Rate") {
                    return attr + " - in bpm (beats per min)"
                } else if (attr.includes("Time") || attr.includes("time")) {
                    return attr + " - in hours"
                } else {
                    return attr
                }
            }
            // append x-Axis
            d3.select("#xAxisAppendRec").remove()
            var objX = g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("id", "xAxisAppendRec");
            var xax = d3.axisBottom(xScale)
            generateAxis(objX, xax, xAxisAttr)

            // append y-Axis
            d3.select("#yAxisAppendRec").remove()
            var objY = g.append("g")
                .attr("id", "yAxisAppendRec");
            var yax = d3.axisLeft(yScale)
            generateAxis(objY, yax, yAxisAttr)



            function generateAxis(obj, axis, attr) {
                // console.log("." + xAxisAttr + ".")
                if (attr == "Sleep Efficiency") {
                    obj.call(axis
                        .tickFormat(
                            function (d) {
                                return d + ('%')
                            }))
                        ;
                } else if (attr == "Total Bedtime" || attr == "Total Sleep Time" || attr == "Deep Sleep Time") {
                    obj.call(axis
                        .tickFormat(
                            function (d) {
                                return formatTime(d)
                            })
                        .ticks(9))
                } else if (attr == "Inactive Time") {
                    obj.call(axis
                        .tickFormat(
                            function (d) {
                                return formatMinToSs(d / 60)
                            })
                        .ticks(9))
                } else {
                    obj.call(axis)
                }
            }

        }

        //////////////////*bubbles*/////////////////////////////////////////////////////////////////////////////////

        if (false) {


            var circles = svg.selectAll("circle");
            circles.remove()

            var g2 = svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return xScale(dropDownToValues(d, xAxisAttr, "xAxis"))
                })
                .attr("cy", function (d) {
                    return yScale(dropDownToValues(d, yAxisAttr, "yAxis"))
                })
                .attr("r", function (d) {
                    return generateRadius(dropDownToValues(d, radiusAttr, "radius"))
                })
                .attr("transform", "translate(" + translateGX + "," + translateGY + ")")
                .style("fill", function (d) {
                    return generateColor(dropDownToValues(d, colorAttr, "color"))
                })
                .on("mouseover", function (event, f) {
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '.6');
                    console.log(d3.select(this))
                    //var x = d3.select(this).attr("cx")
                    //var y = d3.select(this).attr("cy")
                    //console.log("x " + x)
                    //console.log("y " + y)
                    //setOpacityHoverBox(1)
                    //x = d.x
                    //console.log(x)
                    //y = d.y
                    //console.log(y)
                    /*console.log("d.x: " + d.x)
                    console.log("d.y: " + d.y)
                    console.log("d.x: " + xScale(d.x))
                    console.log("d.y: " + d.y)*/

                    //const [x, y] = d3.pointer(event);
                    //console.log(x)
                    //console.log(event.x)
                    //console.log(event.x/(2))
                    handleRect(true, event.x / (2), event.y / 2) //TODO
                    //handleRect(true, x, y)
                    d3.select(this).attr("translate", function (d) {
                        rectValue(d)
                    })
                })
                .on('mouseout', function (d, i) {
                    //setOpacityHoverBox(0)
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '1');
                    handleRect(false, 0, 0)
                });


        }



        /////////////////form instead of bubbles////////////////////////////////////////////////////////////////////////////
        /*var x = 0
        var y = 0
        svg.append('rect')
            .attr("x", 300)
            .attr("y", 300)
            .attr("fill", "black")
            .attr("width", 15)
            .attr("height", 30)
            .attr("transform", "rotate(45,300,300)")
        */
        var arrows = svg.selectAll("image");
        arrows.remove()
        var gNew = svg.append("g");


        function getArrowOrientation(d) {
            var firstValue = []
            var lastValue = []
            var valuesY = [d.YValue0, d.YValue1, d.YValue2, d.YValue3, d.YValue4, d.YValue5, d.YValue6]
            for (var i = 0; i < valuesY.length; i++) {
                if (valuesY[i] != undefined) {
                    firstValue[0] = valuesY[i];
                    firstValue[1] = i
                    break;
                }
            }
            for (var i = valuesY.length - 1; i >= 0; i--) {
                if (valuesY[i] != "") {
                    lastValue[0] = valuesY[i]
                    lastValue[1] = i
                    break;
                }
            }
            // console.log(firstValue[0] + "  " + lastValue[0])

            if (lastValue[0] > firstValue[0]) { //TODO better concept for when trend is up/downwarding

                return arrow_up
            } else if (lastValue[0] == firstValue[0]) {
                if (valuesY[lastValue[1] - 1] > firstValue[0]) {
                    return arrow_up
                } else {
                    return arrow_down
                }
            } else {
                return arrow_down
            }
            /*if (yAxisAttr == "Average HRV") {
                //an upward HRV trend implies that you've recovered well, a downward trend that you should keep an eye on qour recovery status
            } else if (yAxisAttr == "Lowest Resting Heart Rate") {
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
                if (xAxisAttr == "week") {
                    return getArrowOrientation(d)
                } else {
                    return arrow_down
                }
            }
            )
            .attr("height", function (d) {
                return generateRadius(dropDownToValues(d, radiusAttr, "radius")) * 2
            })
            .attr("transform", "translate(" + translateGX + "," + translateGY + ")")
            .style("filter", function (d) {
                var color = generateColor(dropDownToValues(d, colorAttr, "color"))
                // https://codepen.io/sosuke/pen/Pjoqqp
                if (color == "#39A96B") {
                    return "invert(48%) sepia(54%) saturate(445%) hue-rotate(94deg) brightness(103%) contrast(96%)"
                } else if (color == "#7FFFD4") {
                    return "invert(92%) sepia(14%) saturate(1357%) hue-rotate(85deg) brightness(104%) contrast(105%)"
                } else if (color == "#FF7F50") {
                    return "invert(63%) sepia(21%) saturate(3176%) hue-rotate(326deg) brightness(102%) contrast(101%)"
                } else if (color == "#99154E") {
                    return "invert(13%) sepia(56%) saturate(5056%) hue-rotate(320deg) brightness(90%) contrast(93%)"
                } else {
                    return "invert(55%) sepia(95%) saturate(645%) hue-rotate(168deg) brightness(90%) contrast(88%)"
                }
            })
            .attr("x", function (d) {
                return xScale(dropDownToValues(d, xAxisAttr, "xAxis")) - generateRadius(dropDownToValues(d, radiusAttr, "radius"))
            })
            .attr("y", function (d) {
                return yScale(dropDownToValues(d, yAxisAttr, "yAxis")) - generateRadius(dropDownToValues(d, radiusAttr, "radius"))
            })
            .on("mouseover", function (event, f) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.6');

                handleRect(true, event.x / (2), event.y / 2) //TODO
                //handleRect(true, x, y)
                d3.select(this).attr("translate", function (d) {
                    rectValue(d)
                })
            })
            .on('mouseout', function (d, i) {
                //setOpacityHoverBox(0)
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                handleRect(false, 0, 0)
                d3.select("#linePlot").remove()
            });

        //gNew.append("circle").attr("cx", 180).attr("cy", 200).attr("r", 20).attr("fill", "red")
        //gNew.append("svg:image")
        //    .attr("xlink:href", arrow_down).attr("x", 180 - 20).attr("y", 200 - 20).attr("height", 40)

        /*
        svg.append("path")
            .attr("d", triangle)
            .attr("stroke", "red")
            .attr("fill", "red")
            //.attr("transform", function (d) { return "translate(" + 300 + "," + verticalTransform + ")"; })
            //.attr('transform', 'rotate(2 ' + 200 + ' ' + 270 + ')')
            .attr("transform", function(d) { return "translate(" + 310 + "," + 301 + ") rotate(45)"; })      
*/


        //////////////////* functions for creating */////////////////////////////////////////////////////////////////////////////////////////////
        /*
        *
        */
        function generateRadius(d) {
            //console.log("llll")
            //console.log(dropDownToValues(d, radiusAttr, "radius"))
            //console.log(radius (dropDownToValues(d, radiusAttr, "radius")) )
            var div = 10
            //if(xAxisAttr=="week" && radiusAttr=="Total Sleep Time"){ //TODO mit hover Anzeige überprüfen
            //  div = 1/2
            //}
            var r = radius(d) / div; //10
            if (isNaN(r)) { return 6; } //TODO
            else { return r; }
        }

        /*
        *
        */
        function generateColor(length) { //TODO überprüfen bei week

            switch (colorAttr) {
                case "Total Sleep Time":
                    if (length <= 21600) { //<= 6 hours
                        return color("not enough sleep");
                    } else if (length <= 25200 && length > 21600) { // ]6-7]
                        return color("neutral sleep time");
                    } else if (length <= 28800 && length > 25200) { // ]7-8]
                        return color("good sleep time");
                    } else if (length >= 28800) {
                        return color("very much sleep time");
                    }
                    break;
                case "Activity Score":
                    if (length < 50) {
                        return color("no balance")
                    } else if (length >= 50 && length < 70) {
                        return color("not really in balance")
                    } else if (length >= 70 && length < 85) {
                        return color("well balance")
                    } else if (length >= 85) {
                        return color("very well balance")
                    }
                    break;
                case "Sleep Score":
                    if (length < 50) {
                        return color("no sleep quality")
                    } else if (length >= 50 && length < 70) {
                        return color("disturbed sleep quality")
                    } else if (length >= 70 && length < 85) {
                        return color("good sleep quality")
                    } else if (length >= 85) {
                        return color("optimal sleep quality")
                    }
                    break;
                case "Readiness Score":
                    if (length < 50) {
                        return color("no recovery")
                    } else if (length >= 50 && length < 70) {
                        return color("not fully recovered")
                    } else if (length >= 70 && length < 85) {
                        return color("well recovery")
                    } else if (length >= 85) {
                        return color("very well recovery")
                    }
                    break;
                case "Inactive Time":
                    console.log(length)
                    console.log(formatMinToSs(length / 60))

                    if (length < 300) { //<5 hours
                        return color("not much inactive time")
                    } else if (length >= 300 && length <= 480) { //5-8 hours
                        return color("not so much inactive time")
                    } else if (length > 480 && length <= 720) { //8-12 hours
                        return color("too much inactive time")
                    } else if (length > 720) { //>12 hours
                        return color("way too much inactive time")
                    }
                    break;
            }


        }

        //////////////////* functions for interacting */////////////////////////////////////////////////////////////////////////////////////////////

        function dropDownToValues(d, attr, purpose) {
            //console.log("dropdown" + d + attr + purpose)
            if (xAxisAttr == "week") {
                if (purpose == "xAxis") {
                    return d.kw
                } else if (purpose == "radius") {
                    return d.MeanRadius
                } else if (purpose == "yAxis") {
                    return d.MeanCat
                } else if (purpose == "color") {
                    return d.MeanColor
                }
            } else {
                switch (attr) {
                    case "Activity Score":
                        return d.ActivityScore;
                    case "date":
                        return timeFormat(d.date);
                    case "Readiness Score":
                        return d.ReadinessScore;
                    case "Deep Sleep Score":
                        return d.DeepSleepScore;
                    case "HRV Balance Score":
                        return d.HRVBalanceScore;
                    case "Temperature Deviation":
                        return d.TemperatureDeviation;
                    case "Inactive Time":
                        return d.InactiveTime;
                    case "week":
                        return timeFormat(d.date);
                    case "Sleep Score":
                        return d.SleepScore;
                    case "Average Resting Heart Rate":
                        return d.AverageRestingHeartRate;
                    case "Lowest Resting Heart Rate":
                        return d.LowestRestingHeartRate;
                    case "Average HRV":
                        return d.AverageHRV;
                    case "Sleep Efficiency":
                        return d.SleepEfficiency;
                    case "Total Bedtime":
                        return d.TotalBedtime;
                    case "Total Sleep Time":
                        return d.TotalSleepTime;
                    case "Deep Sleep Time":
                        return d.DeepSleepTime;
                    case "Inactive Time":
                        return d.InactiveTime
                    case "Steps":
                        return d.Steps //TODO mit hover Anzeige überprüfen
                    case "Activity Burn":
                        return d.ActivityBurn //TODO mit hover Anzeige überprüfen
                    default:
                        return null
                }
            }

        }

        //////////////////* rectangles when mouse over */////////////////////////////////////////////////////////////////////////////////////////////
        var rectSVG = svg
            .append("svg")
            .attr("class", "rectSVG");

        var rect = rectSVG.append('rect')
            //.attr('x', 150)
            //.attr('y', height + 200)
            .attr("height", 150)
            .attr("width", 310)
            .style("opacity", 0)
            .attr("class", "rectValues")
            .attr("rx", 6)
            .attr("ry", 6);
        var rectT0 = createRect(),
            rectT1 = createRect(),
            rectT2 = createRect(),
            rectT3 = createRect(),
            rectT4 = createRect(),
            rectT5 = createRect();
        var rectArr = [rectT0, rectT1, rectT2, rectT3, rectT4, rectT5]

        function handleRect(mouseOver, xV, yV) {
            var t = 0
            var yVal = 0
            var yValSum = 10
            if (mouseOver) {
                t = 0.8
                function translateRect(r, translX, translY) {
                    //r.attr("x", xV + translX - 200)
                    //r.attr("y", yV + translY - 300)
                    r.attr("x", xV + translX)
                    r.attr("y", yV + translY)
                }
                translateRect(rect, 0, 0)
                var xVal = 10
                var yVal = 20
                rectArr.forEach(element => {
                    translateRect(element, xVal, yVal)
                    yVal += 20
                })
                /*translateRect(rectT0, 10, 20)
                translateRect(rectT1, 10, 40)
                translateRect(rectT2, 10, 60)
                translateRect(rectT3, 10, 80)
                translateRect(rectT4, 10, 100)
                translateRect(rectT4, 10, 120)*/
            } else {
                t = 0
            }
            function opacityChange(r) {
                r.transition()
                    .duration(50)
                    .style("opacity", t)
            }
            opacityChange(rect)
            rectArr.forEach(element => opacityChange(element));
        }
        function round(obj) {
            return Math.round((parseFloat(obj) + Number.EPSILON) * 100) / 100
        }
        /**
         * give rectangle values when mouse over
         **/
        function rectValue(d) {
            if (xAxisAttr == "week") {
                rectT0.text("Week " + d.kw)
                    .attr("id", "dateValue")
                    .attr("font-weight", 700)
                rectT1.text(function () {
                    var date1 = ""
                    var date2 = ""
                    var dates = [d.Date0, d.Date1, d.Date2, d.Date3, d.Date4, d.Date5, d.Date6]
                    for (var i = 0; i < dates.length; i++) {
                        if (dates[i] != undefined) {
                            date1 = dates[i];
                            break;
                        }
                    }

                    for (var i = dates.length - 1; i >= 0; i--) {
                        if (dates[i] != "") {
                            date2 = dates[i];
                            break;
                        }
                    }
                    return ("From " + date1 + " to " + date2)
                })
                rectT2.text("Y-Axis - " + yAxisAttr + ": " + getRepresentableValue(d.MeanCat, yAxisAttr, false))
                rectT3.text("Radius - " + radiusAttr + ": " + getRepresentableValue(d.MeanRadius, radiusAttr, false))
                rectT4.text("Color - " + colorAttr + ": " + getRepresentableValue(d.MeanColor, colorAttr, false))
                rectT5.text(" ")
                var valuesY = [d.YValue0, d.YValue1, d.YValue2, d.YValue3, d.YValue4, d.YValue5, d.YValue6]
                /*valuesY.forEach(element => {
                    element = parseInt(element)
                })*/
                console.log(valuesY)
                console.log(d3.max(valuesY))
                console.log(d)
                createLinePlot(d, 300, 300)

            } else {
                rectT0.text(d.date)
                    .attr("id", "dateValue")
                    .attr("font-weight", 700)
                //rectT1.text(xAxisAttr + " " + dropDownToValues(d, xAxisAttr) )
                rectT1.text("X-Axis - " + xAxisAttr + ": " + getRepresentableValue((dropDownToValues(d, xAxisAttr, "xAxis")), xAxisAttr, false))
                rectT2.text("Y-Axis - " + yAxisAttr + ": " + getRepresentableValue((dropDownToValues(d, yAxisAttr, "yAxis")), yAxisAttr, false))
                rectT3.text("Radius - " + radiusAttr + ": " + getRepresentableValue((dropDownToValues(d, radiusAttr, "radius")), radiusAttr, false))
                rectT4.text("Color - " + colorAttr + ": " + getRepresentableValue((dropDownToValues(d, colorAttr, "color")), colorAttr, false))
                rectT5.text(" ")
                //rectT5.text("\uf107 more").attr("class", " fas rectT")
            }

        }

        function createRect() {
            return rectSVG.append("text")
                //.attr('x', 100)
                //.attr('y', height + 180)
                .style("opacity", 0)
                .text("Test")
                .attr("class", "rectT");
        }
        //createPieChart(data, 300, 300)

    }

    function createLinePlot(dataSet, xPos, yPos) {
        var linePlotData = []
        let csvHeader = ["Day", "Value"];
        var weekDataString = ""

        weekDataString = "\n" + dataSet.Date0 + "," + dataSet.YValue0 + "\n" + dataSet.Date1 + "," + dataSet.YValue1 + "\n" + dataSet.Date2 + "," + dataSet.YValue2 + "\n" + dataSet.Date3 + "," + dataSet.YValue3 + "\n" + dataSet.Date4 + "," + dataSet.YValue4 + "\n" + dataSet.Date5 + "," + dataSet.YValue5 + "\n" + dataSet.Date6 + "," + dataSet.YValue6
        var weekData = csvHeader + weekDataString;
        var weekDataCSV = d3.csvParse(weekData)
        console.log(weekDataCSV)


        //doPlot(weekDataCSV)
        d3.csv(weekDataCSV, function (d) {
            d.Day = (d.Day)
            d.Values = +d.Value

            return d
        }).then(function (data) {
            linePlotData = data
            console.log(data)
            doPlot(data)
        });


        function doPlot(data) {
            console.log(data)
            // Add X axis --> it is a date format
            /*
             var dates = [data.Date0, data.Date1, data.Date2, data.Date3, data.Date4, data.Date5, data.Date6]
             var datesFormatted = []
             dates.forEach(element => {
                 datesFormatted.push(timeFormat(element))
             })
 */
            const margin = { top: 10, right: 30, bottom: 30, left: 60 },
                width = 300 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;
            d3.selectAll("#linePlot").remove()
            var linePlot = svg.append("g").attr("id", "linePlot")

            linePlot.attr("transform", `translate(${xPos}, ${yPos})`)
            const x = d3.scaleTime()
                .domain(d3.extent(data, function (d) { return timeFormat(d.Day); }))
                .range([0, width]);
            var weekDays = ["Mon", "Tue", "Wen", "Th", "Fri", "Sat", "Sun"]
            var xScale = d3.scaleBand().range([0, width])
            xScale.domain(weekDays.map(function (d) {
                console.log(d)
                return d;
            }));
            linePlot.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(xScale));

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return d.Value; })])
                .range([height, 0]);
            linePlot.append("g")
                .call(d3.axisLeft(y));
            linePlot.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d) { return x(timeFormat(d.date)) })
                    .y(function (d) { return y(d.Value) })
                )

            /*
               const x = d3.scaleTime()
                   .domain(d3.extent(weekDataCSV, function (d) {
                       console.log()
                       console.log(d)
                       var value = dates[c]
                       c += 1
                       console.log(value)
   
                       return new Date(d);
                   }))
                   .range([0, width]);
   
               var weekDays = ["Mon", "Tue", "Wen", "Th", "Fri", "Sat", "Sun"]
               var xScale = d3.scaleBand().range([0, width])
               console.log(width)
               console.log(new Date(timeFormat(dates[0])))
               xScale.domain(weekDays.map(function (d) {
                   console.log(d)
                   return d;
               }));
   
               /*linePlot.append("g")
                   .attr("transform", `translate(0, ${height})`)
                   .call(d3.axisBottom(xScale));*/
            /*linePlot.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
            var valuesY = [data.YValue0, data.YValue1, data.YValue2, data.YValue3, data.YValue4, data.YValue5, data.YValue6]
            var valuesYFormatted = []
            valuesY.forEach(element => {
                console.log((element))
                valuesYFormatted.push(parseInt(element))
            })
            console.log(typeof(valuesYFormatted[0]))
            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(valuesYFormatted)])
                .range([height, 0]);
            linePlot.append("g")
                .call(d3.axisLeft(y));

            var countDate = 0
            var countValue = 0
            
            // Add the line
            linePlot.append("path")
                .datum(datesFormatted)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d) {
                        console.log(d)
                        var value = 5
                        if (countDate == 0) value = x(dates[0])
                        else if (countDate == 1) value = x(dates[1])
                        else if (countDate == 2) value = x(dates[2])
                        else if (countDate == 3) value = x(dates[3])
                        else if (countDate == 4) value = x(dates[4])
                        else if (countDate == 5) value = x(dates[5])
                        else if (countDate == 6) value = x(dates[6])
                        countDate += 1
                        return (x(timeFormat(d)))
                    })
                    .y(function (d) {
                        console.log(d)
                        console.log(valuesYFormatted)
                        var value = 5
                        if (countValue == 0) value = (valuesYFormatted[0])
                        else if (countValue == 1) value = (valuesYFormatted[1])
                        else if (countValue == 2) value = (valuesYFormatted[2])
                        else if (countValue == 3) value = (valuesYFormatted[3])
                        else if (countValue == 4) value = (valuesYFormatted[4])
                        else if (countValue == 5) value = (valuesYFormatted[5])
                        else if (countValue == 6) value = (valuesYFormatted[6])
                        console.log(value)
                        console.log(y(parseInt(value)))
                        console.log(y((value)))
                        countValue += 1
                        return y(value)
                    })
                )*/
        }
        function doPlotOld2(data) {
            // Add X axis --> it is a date format
            const margin = { top: 10, right: 30, bottom: 30, left: 60 },
                width = 300 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;
            var linePlot = svg.append("g").attr("id", "linePlot")
            linePlot.attr("transform", `translate(${xPos}, ${yPos})`)
            var dates = [data.Date0, data.Date1, data.Date2, data.Date3, data.Date4, data.Date5, data.Date6]
            var datesFormatted = []
            dates.forEach(element => {
                datesFormatted.push(timeFormat(element))
            })
            var numbers = [1, 2, 3, 4, 5, 6, 7]
            var c = 0
            console.log(datesFormatted)
            const x = d3.scaleTime()
                .domain(d3.extent(datesFormatted, function (d) {
                    console.log()
                    console.log(d)
                    var value = dates[c]
                    c += 1
                    console.log(value)

                    return new Date(d);
                }))
                .range([0, width]);

            var weekDays = ["Mon", "Tue", "Wen", "Th", "Fri", "Sat", "Sun"]
            var xScale = d3.scaleBand().range([0, width])
            console.log(width)
            console.log(new Date(timeFormat(dates[0])))
            xScale.domain(weekDays.map(function (d) {
                console.log(d)
                return d;
            }));

            /*linePlot.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(xScale));*/
            linePlot.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
            var valuesY = [data.YValue0, data.YValue1, data.YValue2, data.YValue3, data.YValue4, data.YValue5, data.YValue6]
            var valuesYFormatted = []
            valuesY.forEach(element => {
                console.log((element))
                valuesYFormatted.push(parseInt(element))
            })
            console.log(typeof (valuesYFormatted[0]))
            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(valuesYFormatted)])
                .range([height, 0]);
            linePlot.append("g")
                .call(d3.axisLeft(y));

            var countDate = 0
            var countValue = 0

            // Add the line
            linePlot.append("path")
                .datum(datesFormatted)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d) {
                        console.log(d)
                        var value = 5
                        if (countDate == 0) value = x(dates[0])
                        else if (countDate == 1) value = x(dates[1])
                        else if (countDate == 2) value = x(dates[2])
                        else if (countDate == 3) value = x(dates[3])
                        else if (countDate == 4) value = x(dates[4])
                        else if (countDate == 5) value = x(dates[5])
                        else if (countDate == 6) value = x(dates[6])
                        countDate += 1
                        return (x(timeFormat(d)))
                    })
                    .y(function (d) {
                        console.log(d)
                        console.log(valuesYFormatted)
                        var value = 5
                        if (countValue == 0) value = (valuesYFormatted[0])
                        else if (countValue == 1) value = (valuesYFormatted[1])
                        else if (countValue == 2) value = (valuesYFormatted[2])
                        else if (countValue == 3) value = (valuesYFormatted[3])
                        else if (countValue == 4) value = (valuesYFormatted[4])
                        else if (countValue == 5) value = (valuesYFormatted[5])
                        else if (countValue == 6) value = (valuesYFormatted[6])
                        console.log(value)
                        console.log(y(parseInt(value)))
                        console.log(y((value)))
                        countValue += 1
                        return y(value)
                    })
                )
        }
        function doPlotOld(data) {
            // Add X axis --> it is a date format
            const margin = { top: 10, right: 30, bottom: 30, left: 60 },
                width = 300 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;
            var linePlot = svg.append("g")
            linePlot.attr("transform", `translate(${xPos}, ${yPos})`)
            var weeks = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]
            var c = 0
            const x = d3.scaleTime()
                .domain(d3.extent(data, function (d) {
                    console.log(d.kw);
                    console.log(c)
                    var value = weeks[c]
                    c += 1
                    console.log(value)
                    return value;
                }))
                .range([0, width]);
            var weekDays = ["Mon", "Tue", "Wen", "Th", "Fri", "Sat", "Sun"]
            var xScale = d3.scaleBand().range([0, width])
            xScale.domain(weekDays.map(function (d) {
                console.log(d)
                return d;
            }));
            linePlot.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(xScale));

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return d.MeanCat; })])
                .range([height, 0]);
            linePlot.append("g")
                .call(d3.axisLeft(y));

            // Add the line
            linePlot.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d) { return x((d.kw)) })
                    .y(function (d) { return y(d.MeanCat) })
                )
        }

    }
    function createPieChart(dataSet, xPos, yPos) {
        var data = [
            { name: "REM", share: 30 },
            { name: "Deep", share: 20 },
            { name: "Light", share: 20 },
            { name: "Awake", share: 30 }];
        var radius = 50;
        var ordScale = d3.scaleOrdinal()
            .domain(data)
            .range(['#ffd384', '#94ebcd', '#fbaccc', '#d3e0ea', '#fa7f72']);
        var pie = d3.pie().value(function (d) {
            return d.share;
        });
        var group = svg.append("g")
        group.attr("transform", "translate(" + xPos + "," + yPos + ")")
        var arc = group.selectAll("arc")
            .data(pie(data))
            .enter();
        var path = d3.arc()
            .outerRadius(radius)
            .innerRadius(0);

        arc.append("path")
            .attr("d", path)
            .attr("fill", function (d) { return ordScale(d.data.name); });
        /*var label = d3.arc()
            .outerRadius(radius)
            .innerRadius(0);

        arc.append("text")
            .attr("transform", function (d) {
                return "translate(" + label.centroid(d) + ")";
            })
            .text(function (d) { return d.data.name; })
            .style("font-family", "arial")
            .style("font-size", 15);*/


    }

    function onChangeFavorite(event) {
        if (event.target.checked) {
            setPeriodMode(true)
            setYAxisAttr("Temperature Deviation")
        } else {
            setPeriodMode(false)
            setYAxisAttr("Average HRV")
        }
        console.log(event.target.checked);
    }
    return (
        <div className="row">
            <div id="test">

                <div className="column-1" >
                    <Card id="labelDescription" style={{ width: '18rem' }}>
                        <Card.Header as="h5">Label description</Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush" className="listgroup">
                                <ListGroup.Item >
                                    <br></br>
                                    <div id="colorLegendDiv">
                                        <div id="colorLegendLabelDiv">
                                            <h1 id="colorLabelDescriptionR" className="labelDescriptionP"></h1>
                                            <InformationMode id="infoMode" modeName={colorInfoHeader} modeText={colorInfoText} placement="right" />
                                        </div>
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
                                </ListGroup.Item>
                                <ListGroup.Item >
                                    <div id="colorLegendDiv">

                                        <div id="colorLegendLabelDiv">
                                            <h1 id="colorLabelDescriptionR" className="labelDescriptionP">Arrow Orientation</h1>
                                            <InformationMode id="infoMode" modeName={colorInfoHeader} modeText={colorInfoText} placement="right" />
                                        </div>
                                        <div width="200" height="20" id="colorDescription3">
                                            <p id="arrowValRec">p</p>
                                            <div width="200" height="20" id="arrowExplanationDivUp">
                                                <img src={arrow_up_con} id="arrowDescriptionImg" />
                                                <p id="arrowDescriptionUpRec"></p>
                                            </div>

                                            <div width="200" height="20" id="arrowExplanationDivDown">
                                                <img src={arrow_down_con} id="arrowDescriptionImg" />
                                                <p id="arrowDescriptionDownRec"></p>
                                            </div>
                                        </div>
                                    </div>


                                </ListGroup.Item>
                            </ListGroup>

                        </Card.Body>
                    </Card>
                    <br></br>
                    <Card id="labelDescription" style={{ width: '18rem' }}>
                        <Card.Header as="h5">Average Values</Card.Header>
                        <Card.Body>
                            <br></br>
                            <div id="radiusDescriptionDiv">
                                <ListGroup variant="flush" className="listgroup">
                                    <ListGroup.Item >
                                        <div width="200" height="40" id="radiusDiv">
                                            <h1 id="radiusLabelDescription" >Radius and Color</h1>
                                            <p id="radiusValRec">p</p>
                                            <p id="colorValRec">p</p>
                                            <svg width="250" height="130" id="radiusSVGRec"></svg>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item >
                                        <div width="200" height="40" id="axisDiv">
                                            <h1 id="xAxisLabelDescription" >Axis</h1>
                                            <div id="xAxisAvgDiv">
                                                <p id="xAxisValRec">Average</p>
                                                <div id="xAxisAvgValRec"><p>67/100</p></div>
                                            </div>
                                            <div id="yAxisAvgDiv">
                                                <p id="yAxisValRec">p</p>
                                                <div id="yAxisAvgValRec"><p>67/100</p></div>
                                            </div>

                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            </div >
                            <br></br><br></br>
                        </Card.Body>
                    </Card>
                </div>
                <div className="column-2" >
                    <svg width="900" height="700" id="svgRecovery"></svg>
                    <div id="actualValues"></div>
                </div>
                <div className="column-3" >
                    <Form.Check
                        type="checkbox"
                        label="I have my period"
                        onChange={(k) => onChangeFavorite(k)} value="" />
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="I have my period"
                        onChange={(k) => onChangeFavorite(k)}
                    />
                    <Card style={{ width: '18rem' }}>
                        <Card.Header as="h5">Controls</Card.Header>
                        <ListGroup variant="flush" className="listgroup">
                            <ListGroup.Item >
                                <div id="yAxis" className="dropdownDiv">
                                    <h1>X-axis: time-based</h1>
                                    <DropdownButton id="timeChoice" onSelect={(k) => setXAxisAttr(k.replace("#/", ""))} title={timeVal} className="select-wrapper">
                                        <Dropdown.Item id="none" href="#/none" disabled>none</Dropdown.Item>
                                        <Dropdown.Item href="#/date">date</Dropdown.Item>
                                        <Dropdown.Item href="#/week">week</Dropdown.Item>
                                    </DropdownButton>
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item >
                                <div id="xAxiss" className="dropdownDiv" >
                                    <h1>X-axis: value-based</h1>
                                    <DropdownButton id="xAxisChoice" onSelect={(k) => setXAxisAttr(k.replace("#/", ""))} title={xAxisAttr} className="select-wrapper">

                                        <Dropdown.Item href="#/Readiness Score" id="xAxisItem">
                                            Readiness Score
                                            <Badge bg="success" id="badge6">Recovery</Badge>
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/Average Resting Heart Rate" id="xAxisItem">
                                            Average Resting Heart Rate
                                            <Badge bg="success" id="badge6">Recovery</Badge>
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/Average HRV" id="xAxisItem">
                                            Average HRV
                                            <Badge bg="success" id="badge6">Recovery</Badge>
                                        </Dropdown.Item>

                                    </DropdownButton>
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div id="yAxis" className="dropdownDiv">
                                    <h1>Y-axis</h1>
                                    <DropdownButton id="yAxisChoice" onSelect={(k) => setYAxisAttr(k.replace("#/", ""))} title={yAxisAttr} className="select-wrapper">
                                        <Dropdown.Item href="#/Lowest Resting Heart Rate" id="yAxisItem">
                                            Lowest Resting Heart Rate
                                            <Badge bg="success" id="badge6">Recovery</Badge>
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/Average HRV" id="yAxisItem">
                                            Average HRV
                                            <Badge bg="success" id="badge6">Recovery</Badge>
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/Readiness Score" id="yAxisItem">
                                            Readiness Score
                                            <Badge bg="success" id="badge6">Recovery</Badge>
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div id="radius" className="dropdownDiv">
                                    <h1>Radius</h1>
                                    <DropdownButton id="radiusChoice" onSelect={(k) => setRadiusAttr(k.replace("#/", ""))} title={radiusAttr} className="select-wrapper">

                                        <Dropdown.Item href="#/HRV Balance Score" id="radiusItem">
                                            HRV Balance Score
                                            <Badge bg="success" id="badge6">Recovery</Badge>
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/Readiness Score" id="radiusItem">
                                            Readiness Score
                                            <Badge bg="success" id="badge6">Recovery</Badge>
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/Average HRV" id="radiusItem">
                                            Average HRV
                                            <Badge bg="success" id="badge6">Recovery</Badge>
                                        </Dropdown.Item>


                                    </DropdownButton>
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div id="color" className="dropdownDiv">
                                    <h1>Color</h1>
                                    <DropdownButton id="radiusChoice" onSelect={(k) => setColorAttr(k.replace("#/", ""))} title={colorAttr} className="select-wrapper">


                                        <Dropdown.Item href="#/Readiness Score" id="colorItem">
                                            Readiness Score
                                            <Badge bg="success" id="badge6">Recovery</Badge>
                                        </Dropdown.Item>

                                    </DropdownButton>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>




                </div>

            </div>
        </div >
    )
}

