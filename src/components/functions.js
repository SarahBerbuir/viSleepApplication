import * as d3 from 'd3'


//////////////colors ////////////////////////////


export function getColors(colorAttr) {
    var colors = []
    if (colorAttr === "Total Sleep Time") {
        colors = ["more than 8 hours", "between 7 and 8 hours", "between 6 and 7 hours", "less than 6 hours"] //TODO too much sleep?
        //range = ["#99154E", "#FF616D", "#FFC93C", "#66DE93", "#558776"]
    } else if (colorAttr === "Activity Score") {
        colors = ["optimal balance", "well balance", "not really in balance", "no balance"] //TODO schönere Namen
    } else if (colorAttr === "Sleep Score") {
        colors = ["optimal sleep quality", "good sleep quality", "disturbed sleep quality", "bad sleep quality"]
    } else if (colorAttr === "Readiness Score") {
        colors = ["optimal recovery", "well recovery", "not fully recovered", "no recovery"]
    } else if (colorAttr === "Inactive Time") {
        colors = ["more than 12 hours", "between 8 and 12 hours","between 5 and 8 hours",  "less than 5 hours"]

        //colors = ["less than 5 hours", "between 5 and 8 hours", "between 8 and 12 hours", "more than 12 hours"]
        //colors = ["less than 5 hours of inactive time", "between 5 and 8 hours of inactive time", "between 8 and 12 hours of inactive time", "more than 12 hours of inactive time"]
    } else if (colorAttr === "Recovery Index Score") {
        colors = ["very long time of stabilization of resting heart rate", "long time of stabilization of resting heart rate", "short time of stabilization of resting heart rate", "very short time of stabilization of resting heart rate"]
    } else if (colorAttr === "HRV Balance Score") {
        colors = ["optimal balance", "well balance", "not really in balance", "no balance"]
    } else {
        colors = ["not defined", "not so much inactive time", "too much inactive time", "way too much inactive time"]
    }
    return colors
}
//var range = ["#265323", "#52BA31", "#FF7F50", "#99154E"]
//var range= ["#004692", "#006DCC", "#40A6FF",  "#90CBFF"]
//var range= ["#0d3471", "#0d4cb3", "#40A6FF",  "#afd7fa"]
export const range = ["#0d3471", "#0d4cb3", "#40A6FF", "#aed7fb"] //dunkelblau, 
//0: invert(17%) sepia(29%) saturate(3660%) hue-rotate(195deg) brightness(93%) contrast(97%)
//1: invert(19%) sepia(91%) saturate(1994%) hue-rotate(207deg) brightness(99%) contrast(96%);
//2: invert(56%) sepia(77%) saturate(1793%) hue-rotate(184deg) brightness(99%) contrast(105%)
//3: invert(94%) sepia(92%) saturate(6793%) hue-rotate(170deg) brightness(100%) contrast(97%)

export function getColor(colors) {
    return d3
        .scaleOrdinal()
        .domain(colors)
        .range(range);
}

export function generateColor(length, colorAttr) { //TODO überprüfen bei week
    var colors = getColors(colorAttr)
    var color = getColor(colors)
    if (colorAttr == "Total Sleep Time") {
        if (length <= 21600) { //<= 6 hours
            return color(colors[0]);
        } else if (length <= 25200 && length > 21600) { // ]6-7]
            return color(colors[1])
        } else if (length <= 28800 && length > 25200) { // ]7-8]
            return color(colors[2])
        } else if (length >= 28800) {
            return color(colors[3])
        }
    } else if (colorAttr == "Inactive Time") {
        if (length < 300) { //<5 hours
            return color(colors[0])
        } else if (length >= 300 && length <= 480) { //5-8 hours
            return color(colors[1])
        } else if (length > 480 && length <= 720) { //8-12 hours
            return color(colors[2])
        } else if (length > 720) { //>12 hours
            return color(colors[3])
        }
    } else if (colorAttr.includes("Score")) {
        if (length < 50) {
            return color(colors[0])
        } else if (length >= 50 && length < 70) {
            return color(colors[1])
        } else if (length >= 70 && length < 85) {
            return color(colors[2])
        } else if (length >= 85) {
            return color(colors[3])
        }
    } else {
        return "#FFFFFF"
    }
}

///////////////////representable value
export function formatTime(num) {
    var h = Math.floor(num / 3600);
    var m = Math.floor((num - h * 3600) / 60);
    //var s = num - (h * 3600 + m * 60);
    return (h < 10 ? "0" + h : h)
        + ":" +
        (m < 10 ? "0" + m : m)
    //+ ":" +             
    //( s < 10 ? "0" + s : s );  
}

export function formatMinToSs(minutes) {
    var sign = minutes < 0 ? "-" : "";
    var min = Math.floor(Math.abs(minutes));
    var sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}

var timeFormat = d3.timeParse("%Y-%m-%d");

export function getRepresentableValue(value, attr, withUnit) {
    var unit = ""
    var formattedValue = ""
    var justUnit = unit
    if (attr === "Inactive Time" || attr === "Medium Activity Time") {
        unit = "hours"
        formattedValue = formatMinToSs(value / 60)
    } else if (attr.includes("Time") || attr.includes("time")) {
        unit = "hours"
        formattedValue = formatTime(value)
    } else if (attr === "Activity Burn") {
        unit = "calories"
        formattedValue = (Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100)
    } else if (attr === "Steps") {
        unit = "steps"
        formattedValue = (Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100)
    } else if (attr === "Average HRV") {
        unit = "ms"
        formattedValue = (Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100)
    } else if (attr === "Lowest Resting Heart Rate") {
        unit = "bpm"
        formattedValue = (Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100)
    } else if (attr === "Temperature Deviation") {
        unit = ""
        formattedValue = (Math.round((parseFloat(value) + Number.EPSILON) * 100) / 1000)
    } else if (attr === "Average MET") {
        unit = ""
        formattedValue = (Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100)
    } else if (attr === "Sleep Latency") {
        unit = "hours"
        formattedValue = formatTime(Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100)
    } else if (attr === "Sleep Efficiency") {
        unit = "% / 100%"
        justUnit = "%"
    } else if (attr === "Respiratory Rate") {//TODO
        unit = "breaths per minute"
        justUnit = "breaths per minute"
        formattedValue = (Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100)
    } else {
        unit = "/ 100" // score points
        //justUnit = "score points"
        formattedValue = (Math.round((parseFloat(value) + Number.EPSILON) * 100) / 100)
    }
    if (withUnit) {
        return formattedValue + " " + unit
    } else {
        return formattedValue + " " + justUnit
    }
}

export function addText(objID, text) {
    return d3.select(objID)
        .text(text)
}

export function appendText(obj, x, y, sizeFont, fill, text, id) {
    return obj
        .append("text")
        .attr('x', x)
        .attr('y', y)
        .style('font-size', sizeFont)
        .attr('fill', fill)
        .text(text)
        .attr("id", id)
}

export function appendRect(obj, width, height, x, y, fill) {
    return obj
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr('x', x)
        .attr('y', y)
        .attr("fill", fill)
}

export function createCircle(obj, x, y, fill, r, id) {
    return obj.append('circle')
        .attr('cx', x) //labelX + 40
        .attr('cy', y) //200
        .attr("fill", fill)
        .attr("r", r)
        .attr("id", id);
}

export function createAxisLabel(attr) {
    if (attr.includes("Score")) {
        return attr + "s from [1,100]"
    } else if (attr === "Sleep Efficiency") {
        return attr + "  in %"
    } else if (attr === "week") {
        return attr + " from Monday to Sunday"
    } else if (attr === "Average HRV") {
        return attr + "  in ms"
    } else if (attr === "Average Resting Heart Rate") {
        return attr + "  in beats per min"
    } else if (attr.includes("Time") || attr.includes("time")) {
        return attr + "  in hours"
    } else {
        return attr
    }
}

export function generateAxis(obj, axis, attr) {
    if (attr === "Sleep Efficiency") {
        obj.call(axis
            .tickFormat(
                function (d) {
                    return d + ('%')
                }))
            ;
    } else if (attr === "Total Bedtime" || attr === "Total Sleep Time" || attr === "Deep Sleep Time" || attr === "Rest Time" || attr === "Sleep Latency") {
        obj.call(axis
            .tickFormat(
                function (d) {
                    return formatTime(d)
                })
            .ticks(9))
    } else if (attr === "Inactive Time" || attr === "Medium Activity Time") {
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

export function generateRadius(d, radius) {
    var div = 9
    //if(xAxisAttr==="week" && radiusAttr==="Total Sleep Time"){ //TODO mit hover Anzeige überprüfen
    //  div = 1/2
    //}
    var r = radius / div; //10
    if (isNaN(r)) { return 6; } //TODO
    else { return r; }
}

export function dropDownToValues(d, attr, xAxisAttr, purpose) {
    if (xAxisAttr === "week") {
        if (purpose === "xAxis") {
            return d.kw
        } else if (purpose === "radius") {
            return d.MeanRadius
        } else if (purpose === "yAxis") {
            return d.MeanCat
        } else if (purpose === "color") {
            return d.MeanColor
        }
    } else {
        switch (attr) {
            case "Activity Score":
                return d.ActivityScore;
            case "day":
                return timeFormat(d.date);
            case "Readiness Score":
                return d.ReadinessScore;
            case "Deep Sleep Score":
                return d.DeepSleepScore;
            case "HRV Balance Score":
                return +d.HRVBalanceScore;
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
            case "Average MET":
                return parseFloat(d.AverageMET);
            case "Medium Activity Time":
                return d.MediumActivityTime
            case "Bedtime Start":
                return d.BedtimeStart;
            case "Rest Time":
                return d.RestTime;
            case "Steps":
                return d.Steps //TODO mit hover Anzeige überprüfen
            case "Activity Burn":
                return d.ActivityBurn //TODO mit hover Anzeige überprüfen
            case "Awake Time":
                return d.AwakeTime
            case "Light Sleep Time":
                return d.LightSleepTime
            case "REM Sleep Time":
                return d.REMSleepTime
            case "Sleep Latency":
                return d.SleepLatency
            default:
                return null
        }
    }

}

export function getInfoText(attr) {
    var totalSleepTimeColorInfo = "The amount of hours you were asleep."
    var sleepScoreColorInfo = "- ≥ 85: optimal sleep quality \n - 70-85: good sleep quality \n - 50-70: disturbed sleep quality \n - < 50: no sleep quality\n \n \n -- These descriptions are partly taken from Oura --"
    var activityScoreColorInfo = "- ≥ 85: very well balance\n - 70-85: well balance \n - 50-70: not really in balance \n - < 50: no balance\n \n \n -- These descriptions are partly taken from Oura -- "
    var readinessScoreColorInfo = "- ≥ 85: very well recovered \n - 70-85: well recovered \n - 50-70: not fully recovered  \n - < 50: not recovered\n \n \n -- These descriptions are partly taken from Oura --"
    var inactiveTimeColorInfo = "The amount of hours you were inactive."
    var recoveryIndexScoreColorInfo = "- ≥ 85: very early stabilization of resting heart rate \n - 70-85: early stabilization of resting heart rate \n - 50-70: late stabilization of resting heart rate  \n - < 50: very late stabilization of resting heart rate\n \n \n -- These descriptions are partly taken from Oura --"
    var averageHRVOrientationInfo = "TODO"
    var rhrOrientationInfoText = "TODO"
    var temperatureDeviationInfo = "ll"

    if (attr === "Total Sleep Time") {
        return totalSleepTimeColorInfo
    } else if (attr === "Activity Score") {
        return activityScoreColorInfo
    } else if (attr === "Readiness Score") {
        return readinessScoreColorInfo
    } else if (attr === "Sleep Score") {
        return sleepScoreColorInfo
    } else if (attr === "Inactive Time") {
        return inactiveTimeColorInfo
    } else if (attr === "Recovery Index Score") {
        return recoveryIndexScoreColorInfo
    } else if (attr === "Average HRV") {
        return averageHRVOrientationInfo
    } else if (attr === "Lowest Resting Heart Rate") {
        return rhrOrientationInfoText
    } else if (attr === "Temperature Deviation") {
        return temperatureDeviationInfo
    } else if (attr === "HRV Balance Score") {
        return temperatureDeviationInfo
    } else {
        return null
    }
}

export function generateArrow(obj, id, refX, refY, d) {
    return obj
        .append('defs')
        .append('marker')
        .attr('id', id)
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', 20)
        .attr('markerHeight', 20)
        .append('path')
        .attr('d', d)
        .attr('stroke', '#666666')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
}

export function generateArrowRec(obj, id, refX, refY, d) {
    return obj
        .append('defs')
        .append('marker')
        .attr('id', id)
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', 20)
        .attr('markerHeight', 20)
        .append('path')
        .attr('d', d)
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
}

export function opacityChange(r, t) {
    r.transition()
        .duration(50)
        .style("opacity", t)
}

export function getWeekDuration(d) {
    var date1 = ""
    var date2 = ""
    var dates = [d.Date0, d.Date1, d.Date2, d.Date3, d.Date4, d.Date5, d.Date6]
    for (var i = 0; i < dates.length; i++) {
        if (dates[i] !== undefined) {
            date1 = dates[i];
            break;
        }
    }
    for (var j = dates.length - 1; j >= 0; j++) {
        if (dates[j] !== undefined) {
            date2 = dates[j];
            break;
        }
    }
    return ("From " + date1 + " to " + date2)
}


export function formatDataSet(d) {
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
    d.AwakeTime = +(d['Awake Time'])   //time
    d.REMSleepTime = +(d['REM Sleep Time']) //time
    d.LightSleepTime = +(d['Light Sleep Time'])  //time
    d.DeepSleepTime = +d['Deep Sleep Time'] //time formatTime(d['Deep Sleep Time'])
    d.RestlessSleep = d['Restless Sleep']
    d.SleepEfficiency = +d['Sleep Efficiency'] //percent
    d.SleepLatency = +(d['Sleep Latency']) //time
    d.SleepTiming = d['Sleep Timing'] //TODO
    d.BedtimeStart = (d['Bedtime Start']) //TODO
    d.BedtimeEnd = d['Bedtime End'] //"2021-05-23T09:17:54+02:00" TODO
    d.AverageRestingHeartRate = +d['Average Resting Heart Rate'] //bpm number
    d.LowestRestingHeartRate = d['Lowest Resting Heart Rate'] //bpm number
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
    d.RestTime = +(d['Rest Time'])//time
    d.LowActivityTime = formatTime(d['Low Activity Time'])//time
    d.MediumActivityTime = +(d['Medium Activity Time'])//time
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
    d.RecoveryIndexScore = +d['Recovery Index Score'] //score
    return d
}

export function generateColorOfEmoji(colorVal, colorAttr) {
    // https://codepen.io/sosuke/pen/Pjoqqp
    var color = generateColor(colorVal, colorAttr)
    if (color === range[0]) { //color === "#39A96B"
        //return "invert(30%) sepia(6%) saturate(3976%) hue-rotate(69deg) brightness(86%) contrast(94%)"
        return "deep"
    } else if (color === range[1]) { //(color === "#7FFFD4"
        return "rem"
    } else if (color === range[2]) {//color === "#FF7F50"
        return "light"
    } else if (color === range[3]) { //color === "#99154E"
        return "awake"
    } else {
        return "light"
    }
}

///////////////recovery mode
export function generateColorOfArrow(colorVal, colorAttr) {
    // https://codepen.io/sosuke/pen/Pjoqqp
    var color = generateColor(colorVal, colorAttr)
    if (color === range[0]) { //color === "#39A96B"
        //return "invert(30%) sepia(6%) saturate(3976%) hue-rotate(69deg) brightness(86%) contrast(94%)"
        return "invert(17%) sepia(29%) saturate(3660%) hue-rotate(195deg) brightness(93%) contrast(97%)"
    } else if (color === range[1]) { //(color === "#7FFFD4"
        return "invert(19%) sepia(91%) saturate(1994%) hue-rotate(207deg) brightness(99%) contrast(96%)"
    } else if (color === range[2]) {//color === "#FF7F50"
        return "invert(56%) sepia(77%) saturate(1793%) hue-rotate(184deg) brightness(99%) contrast(105%)"
    } else if (color === range[3]) { //color === "#99154E"
        return "invert(94%) sepia(92%) saturate(6793%) hue-rotate(170deg) brightness(100%) contrast(97%)"
    } else {
        return "iinvert(94%) sepia(90%) saturate(6793%) hue-rotate(170deg) brightness(100%) contrast(97%)"
    }
}

//0: invert(17%) sepia(29%) saturate(3660%) hue-rotate(195deg) brightness(93%) contrast(97%)
//1: invert(19%) sepia(91%) saturate(1994%) hue-rotate(207deg) brightness(99%) contrast(96%);
//2: invert(56%) sepia(77%) saturate(1793%) hue-rotate(184deg) brightness(99%) contrast(105%)
//3: invert(94%) sepia(92%) saturate(6793%) hue-rotate(170deg) brightness(100%) contrast(97%)

export function editRectanglesPopUp(d, rectArr, rectArr2, xAxisAttr, yAxisAttr, radiusAttr, colorAttr) {
    var verticalText = 0
    var radiusText = 0
    var colorText = 0
    if (xAxisAttr === "week") {
        rectArr2[0].text("Week " + d.kw)
            .attr("id", "dateValue")
            .attr("font-weight", 700)
        rectArr2[1].text(function () {
            return getWeekDuration(d)
        })
        rectArr[0].text(" ")
        rectArr[1].text(" ")
        verticalText = getRepresentableValue(d.MeanCat, yAxisAttr, false)
        radiusText = getRepresentableValue(d.MeanRadius, radiusAttr, false)
        colorText = getRepresentableValue(d.MeanColor, colorAttr, false)
    } else {
        rectArr[0].text(d.date)
            .attr("id", "dateValue")
            .attr("font-weight", 700)
        rectArr2[0].text(" ")
        if (xAxisAttr === "day") {
            rectArr[1].text(" ")
            rectArr2[1].text(" ")
        } else {
            rectArr[1].text(xAxisAttr + ": " + getRepresentableValue(dropDownToValues(d, xAxisAttr, "xAxis"), xAxisAttr, false))
            rectArr2[1].text("Horizontal ").style("font-weight", "bold")
        }
        verticalText = getRepresentableValue(dropDownToValues(d, yAxisAttr, xAxisAttr, "yAxis"), yAxisAttr, false)
        radiusText = getRepresentableValue(dropDownToValues(d, radiusAttr, xAxisAttr, "radius"), radiusAttr, false)
        colorText = getRepresentableValue(dropDownToValues(d, colorAttr, xAxisAttr, "color"), colorAttr, false)
    }
    rectArr[2].text(yAxisAttr + ": " + verticalText)
    rectArr2[2].text("Vertical   ").style("font-weight", "bold")
    rectArr[3].text(radiusAttr + ": " + radiusText)
    rectArr2[3].text("Radius   ").style("font-weight", "bold")
    rectArr[4].text(colorAttr + ": " + colorText)
    rectArr2[4].text("Color  ").style("font-weight", "bold")
    rectArr[5].text("")
}

export function createRectArr(rectArr, rectArr2, rectSVG, rect, xV, yV, type) {
    var t = 0.8
    for (var i = 0; i < 5; i++) {
        rectArr.push(createRect(rectSVG))
        rectArr2.push(createRect(rectSVG))
    }
    var rectSmallSVGSleep = createSVG(rectSVG)

    if (type == "Act") {
        rectArr.push(createRect(rectSVG))
        rectArr.push(createSVG(rectSVG))
    } else if (type == "Gen") {
        rectArr.push(createRect(rectSVG))
    } else if (type == "Sleep") {
        rectArr.push(createSVG(rectSVG))
        rectArr.push(createSVG(rectSVG))
        rectArr2.push(rectSmallSVGSleep)
    } else if (type == "Rec") {
        var rectSmallSVGRec = rectSVG
            .append("svg")
            .attr("width", 300)
            .attr("height", 300)
            .style("opacity", 0)
            .attr("class", "rectT")
        rectArr.push(rectSmallSVGRec)
    }
    rectSmallSVGSleep
        .append("rect")
        .attr("width", "100%")
        .attr("height", 120)
        .attr("fill", "white")
        .attr("class", "rectValues")
    function translateRect(r, translX, translY) {
        r.attr("x", xV + translX) //+20
        r.attr("y", yV + translY) //- 110
    }
    translateRect(rect, 0, 0)
    var xVal = 85
    var yVal = 20
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
    opacityChange(rect, t)
    rectArr.forEach(element => opacityChange(element, t));
    rectArr2.forEach(element => opacityChange(element, t));
}

function createRect(obj) {
    return obj.append("text")
        //.attr('x', 100)
        //.attr('y', height + 180)
        .style("opacity", 0)
        .text("Test")
        .attr("class", "rectT");
}

function createSVG(targetSVG) {
    return targetSVG
        .append("svg")
        .attr("width", 300)
        .attr("height", 300)
        .style("opacity", 0)
        .attr("class", "rectTAct");
}

export function getRadiusDescription(best, radiusAttr) {
    if (best) {
        var actualDescription = ["Best", "Highest", "Highest"]
    } else {
        actualDescription = ["Worst", "Lowest", "Lowest"]
    }
    if (radiusAttr.includes("Score")) {
        return (actualDescription[0])
    } else if (radiusAttr == "Average HRV") {
        return (actualDescription[1])
    } else {
        return (actualDescription[2])
    }
}



export function changeColorsOfSelected(k, ids, dimension, mode){
    var newK = dimension + k.replace("#/", "").split(' ').join('') + mode
    ids.forEach(element => {
        d3.select("#" + element).style("background-color", "white")
        d3.select("#" + element).style("color", "#666666")
    })
    d3.select("#" + newK).style("background-color", "#34a5daa6")//TODO
    d3.select("#" + newK).style("color", "white")
}