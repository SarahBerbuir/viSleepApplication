
import React, { Component, useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import $ from 'jquery'
import { render } from 'react-dom';
import ouraData from '../csv/oura_2021-08-03_trends.csv'
import lineData from '../csv/linePlot.csv'
import { csv, mean, range } from 'd3';
import {Card, Popover, Tabs, Tab, Button, Tooltip, OverlayTrigger, ToggleButtonGroup, ButtonGroup, ToggleButton , Dropdown, DropdownButton, Nav, Navbar, Container} from 'react-bootstrap';



function VisGeneralFunc() {
    const [timeAttr, setTimeAttr] = useState("hallo")
    const [prevDropDownVal, setPrevDropDownVal] = useState(timeAttr)
    //var prevDropDownVal = useRef({ dropDownVal }).current;

    useEffect(()=>{
        

        function formatTime(num) {         
            var h = Math.floor( num / 3600 );         
            var m = Math.floor((num - h * 3600) / 60 );         
            var s = num - (h * 3600 + m * 60);          
            return ( h < 10 ? "0" + h : h )      
                + ":" +             
                ( m < 10 ? "0" + m : m )             
            + ":" +             
            ( s < 10 ? "0" + s : s );  
        }
        var timeFormat = d3.timeParse("%Y-%m-%d");
        var ouraDataFormatted = []
        d3.csv(ouraData, function(d) { 

            d.date = (d['date']); //parseDate
            d.SleepScore = +d['Sleep Score'] //score
            d.TotalSleepScore = +d['Total Sleep Score'] //score
            d.REMSleepScore = +d['REM Sleep Score'] //score
            d.DeepSleepScore = +d['Deep Sleep Score'] //score
            d.SleepEfficiencyScore= +d['Sleep Efficiency Score'] //score
            d.RestfulnesScore= +d['RestfulnessScore'] //score
            d.SleepLatencyScore= +d['Sleep Latency Score'] //score
            d.SleepTimingScore= +d['Sleep Timing Score'] //score
            d.TotalBedtime= formatTime(d['Total Bedtime'])  //time
            d.TotalSleepTime= formatTime(d['Total Sleep Time'])  //time
            d.AwakeTime= formatTime(d['Awake Time'])   //time
            d.REMSleepTime= formatTime(d['REM Sleep Time'] ) //time
            d.LightSleepTime= formatTime(d['Light Sleep Time'])  //time
            d.DeepSleepTime= formatTime(d['Deep Sleep Time'])  //time
            d.RestlessSleep= d['Restless Sleep'] 
            d.SleepEfficiency= d['Sleep Efficiency'] //percent
            d.SleepLatency= formatTime(d['Sleep Latency']) //time
            d.SleepTiming= d['Sleep Timing'] //TODO
            d.BedtimeStart= (d['Bedtime Start'] ) //TODO
            d.BedtimeEnd= d['Bedtime End'] //"2021-05-23T09:17:54+02:00" TODO
            d.AverageRestingHeartRate= d['Average Resting Heart Rate'] //bpm number
            d.LowestRestingHeartRate= d['Lowest Resting Heart Rate'] //bpm number
            d.AverageHRV= d['Average HRV']  //ms number
            d.TemperatureDeviation= d['Temperature Deviation (°C)'] //TODO
            d.RespiratoryRate= d['Respiratory Rate'] //br/min float TODO
            d.ActivityScore= +d['Activity Score'] //score
            d.StayActiveScore= d['Stay Active Score'] //score
            d.MoveEveryHourScore= d['Move Every Hour Score'] //score
            d.MeetDailyTargetsScore= d['Meet Daily Targets Score'] //score
            d.TrainingFrequencyScore= d['Training Frequency Score'] //score
            d.TrainingVolumeScore= d['Training Volume Score'] //score
            d.RecoveryTimeScore= d['Recovery Time Score,'] //score
            d.ActivityBurn= d['Activity Burn']  //calories number
            d.TotalBurn= d['Total Burn'] //calories number
            d.TargetCalories= d['Target Calories'] //calories number
            d.Steps= d['Steps'] //number
            d.DailyMovement= d['Daily Movement'] 
            d.InactiveTime= formatTime(d['Inactive Time']) //time
            d.RestTime= formatTime(d['Rest Time'])//time
            d.LowActivityTime= formatTime(d['Low Activity Time'])//time
            d.MediumActivityTime= formatTime(d['Medium Activity Time'])//time
            d.HighActivityTime= formatTime(d['High Activity Time'])//time
            d.NonWearTime = formatTime(d['Non-wear Time']) //time
            d.AverageMET= d['Average MET'] //float MET TODO
            d.LongPeriodsofInactivity= d['Long Periods of Inactivity'] //alerts float TODO
            d.ReadinessScore= +d['Readiness Score'] //score
            d.PreviousNightScore= d['Previous Night Score'] //score
            d.SleepBalanceScore= d['Sleep Balance Score'] //score
            d.PreviousDayActivityScore= d['Previous Day Activity Score'] //score
            d.ActivityBalanceScore= d['Activity Balance Score'] //score
            d.TemperatureScore= d['Temperature Score'] //score
            d.RestingHeartRateScore= d['Resting Heart Rate Score'] //score
            d.HRVBalanceScore= +d['HRV Balance Score'] //score
            d.RecoveryIndexScore= d['Recovery Index Score'] //score
           return d
        }).then(function(data){
            ouraDataFormatted = data
            updateData(data)
        });
        var xAxisAttr = "Sleep Score" //default
        var yAxisAttr = "Activity Score" //default
        var radiusAttr = "Deep Sleep Score" //default
        var weekData = ""

        //take oura data and return csv variable with kw, mean of y-axis and x of radius
        function weekParam() {
            var xAxis = "week"
            var kw = 0
            var weekNumbers = {}
            var actualKW = 0
            
            //find first kw that exists
            var firstDate = new Date(ouraDataFormatted[0].date);
            var firstKW = new Date().getWeekNumber(firstDate)
            var oldKW = firstKW

            //find last kw that exists
            var lastDate = new Date(ouraDataFormatted[ouraDataFormatted.length-1].date);
            var lastKW = new Date().getWeekNumber(lastDate)
            var countArray = 0
            var arrayData = []
            //initialize array with data structure: [[null, null]]
            for(var i = 0; i<52; i++){
                var puffer = []
                for(var j=0; j<7; j++){
                    puffer.push([null, null])
                }
                arrayData.push(puffer)
            }
            ouraDataFormatted.forEach(element =>{
                //get the kw of element.date
                var newDate = new Date(element.date);
                var kw = new Date().getWeekNumber(newDate)
                weekNumbers[kw] = []
                actualKW = kw
                //iterate only through one week for one dimension of the array
                if(countArray> 6 || actualKW != oldKW){
                    countArray = 0
                }
                // arrayData has content in terms of [kw, yAxisValue]
                
                var newYAxisVal = yAxisAttr.split(' ').join('')
                
                arrayData[kw][countArray]= [actualKW, element[newYAxisVal]];
                countArray +=1 
                console.log(kw + " " +element[newYAxisVal])
                oldKW = actualKW
            })
        
            var meanArray = []
            for(var i = firstKW; i<= lastKW; i++){
                var sumOfOneWeek = 0
                var countOfDays = 0
                for(var j=0; j<7; j++){
                    if( arrayData[i][j][0] != null && arrayData[i][j][1] != null){
                        sumOfOneWeek += +(arrayData[i][j][1])
                        countOfDays +=1
                    }
                }
                var meanOfWeek = sumOfOneWeek/countOfDays
                console.log("Mean of week " + i + " " + meanOfWeek)
                meanArray.push([i, meanOfWeek, 3]) //3 as default for radius
                sumOfOneWeek = 0
                countOfDays = 0
            }
            let csvHeader = ["kw","MeanCat","defaultradius"];
            var weekDataString = ""
            meanArray.forEach(element=>{
                weekDataString = weekDataString +   "\n" + element[0] + "," + element[1] + "," + element[2] 
            })
            weekDataString = csvHeader + weekDataString
            weekData = d3.csvParse(weekDataString);
            return weekData
        }
        
        
        

        //update xAxis after clicking button
        document.getElementById("xAxisButton").onclick = function(){
                xAxisAttr = $("#xAxisChoice").val()
                $("#recommChoice").val("customized")
                updateData(ouraDataFormatted)
                $("#timeChoice").val("none")
        };

        //update yAxis after clicking button
        document.getElementById("yAxisButton").onclick = function(){
                yAxisAttr = $("#yAxisChoice").val()
                $("#recommChoice").val("customized")
                if(xAxisAttr =="week"){
                    updateData(weekParam())
                } else{
                    updateData(ouraDataFormatted)
                }
            };

        //update radius after clicking button
        document.getElementById("radiusButton").onclick = function(){
                radiusAttr = $("#radiusChoice").val()
                $("#recommChoice").val("customized")
                console.log("O2 ")
                console.log(ouraDataFormatted)
                if(xAxisAttr =="week"){
                    updateData(weekParam())
                } else{
                    updateData(ouraDataFormatted)
                }
            };
        
        
        Date.prototype.getWeekNumber = function(date){
            var dayNum = date.getUTCDay() || 7;
            date.setUTCDate(date.getUTCDate() + 4 - dayNum);
            var yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
            return Math.ceil((((date - yearStart) / 86400000) + 1)/7)
        };
       
        /*
        document.getElementById("recommButton").onclick = function(){ 
            switch ($("#recommChoice").val()){
                case "SleepActivityAcitivity": 
                    xAxisAttr = "Sleep Score"
                    yAxisAttr = "Activity Score"
                    radiusAttr = "Activity Score"
                    break;
                case "periodMode":
                    xAxisAttr = "date"
                    yAxisAttr = "Temperature Deviation"
                    radiusAttr = "HRV Balance Score"
                    break;
            }
            updateData(ouraDataFormatted)
        };*/

        //update time after selecting dropdown time
        var oldxAxisAttr = xAxisAttr
        xAxisAttr = timeAttr
        if(oldxAxisAttr == xAxisAttr || xAxisAttr=="none"){
            console.log("gleichh")
        } 
        if(xAxisAttr == "none") xAxisAttr = oldxAxisAttr
        console.log("O1 ")
        //onsole.log(weekParam())
        console.log(xAxisAttr)
        $("#recommChoice").val("customized")
        //console.log(weekParam(ouraDataFormatted))
        //updateData(ouraDataFormatted)
        radiusAttr = "defaultradius"
        /*if ( xAxisAttr == "week" ){
            var newData = weekParam(ouraDataFormatted)
            updateData(newData)
        } else{
            updateData(ouraDataFormatted)
        }
*/




        var svg = svg = d3.select("#svG")
        function updateData(data){
        console.log("update")
        //setPrevDropDownVal(dropDownVal)
        //////////////////* initialization */////////////////////////////////////////////////////////////////////////////////////////////
            var labelSVG = d3.select("#labelSVG"),
                labelX = 7,
                labelY = 22,
                margin = 200,
                width = svg.attr("width") - margin, //300
                height = svg.attr("height") - margin, //200
                xLabel = width-50,
                //domainDate = d3.extent(d => d.date);
                avgX = (d3.mean(data, d =>dropDownToValues(d, xAxisAttr, "xAxis"))),
                avgY = (d3.mean(data, d =>dropDownToValues(d, yAxisAttr, "yAxis"))),
                avgR = (d3.mean(data, d =>dropDownToValues(d, radiusAttr, "radius"))),
                avgC = (d3.mean(data, d => d.TotalSleepTime)),
                minX = (d3.min(data, d => dropDownToValues(d, xAxisAttr, "xAxis"))), //-1
                maxX = (d3.max(data, d => parseInt(dropDownToValues(d, xAxisAttr, "xAxis")))), //+1
                minY = (d3.min(data, d => dropDownToValues(d, yAxisAttr, "yAxis")))-1,
                maxY = (d3.max(data, d => dropDownToValues(d, yAxisAttr, "yAxis")))+1,
                minRadius = (d3.min(data, d => dropDownToValues(d, radiusAttr, "radius")))-1,
                maxRadius = (d3.max(data, d => dropDownToValues(d, radiusAttr, "radius")))+1;                
                if(xAxisAttr == "date"){
                    var xScale = d3.scaleTime().domain(d3.extent(data, d => timeFormat(d.date))).range([0, width-50])
                }
                else {
                    var xScale = d3.scaleLinear().domain([minX,maxX]).range([0, width-50]);
                }   
            var yScale = d3.scaleLinear().domain([minY, maxY]).range([height, 0]),
                radius = d3.scaleLinear().domain([minRadius, maxRadius]).range([0, 200]),
                translateGX = 100,
                translateGY = 100;
            
            var g = svg.append("g")
                .attr("transform", "translate(" + translateGX + "," + translateGY + ")");
            
            labelSVG.attr("transform", "translate(" + 0 + "," + 0 + ")");
        

            // Title
            /*svg.append('text')
                .attr('x', width/2 + 100)
                .attr('y', 50)
                .attr('text-anchor', 'middle')
                .style('font-family', 'Helvetica')
                .style('font-size', 20)
                .text('Scatter Plot');
            */

            //////////////////* color */////////////////////////////////////////////////////////////////////////////////////////////
            var colors = ["very bad", "bad", "ok", "good", "very good"]
            let color = d3
                .scaleOrdinal()
                .domain(colors)
                .range(["#99154E", "#FF616D", "#FFC93C", "#66DE93", "#558776"]);
            //////////////////* color */////////////////////////////////////////////////////////////////////////////////////////////
            createColorLegend()
            function createColorLegend(){
                    //color legend
                function addColorLegend(text, x, y, xRect, yRect, color){
                    labelSVG.append('text')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('text-anchor', 'left')
                        .style('font-family', 'Helvetica')
                        .style('font-size', 15)
                        .style('fill', '#666666')
                        .text(text);
                    labelSVG.append('rect')
                        .attr('x', xRect)
                        .attr('y', yRect)
                        .attr("height", 10)
                        .attr("width", 10)
                        .attr("fill", color);
                }
                var i = 4,
                heightColor = 50,//height+170
                heightColorRect = 40;//height+160

                while(i>=0){
                    //addColorLegend(colors[i], 685, heightColor, 670, heightColorRect, color(colors[i]));
                    addColorLegend(colors[i], labelX+15, heightColor, labelX, heightColorRect, color(colors[i]));
                    heightColor = heightColor +20;
                    heightColorRect += 20;
                    i --;
                }
            }
            
            //////////////////* label color and radius*////////////////////////////////////////////////////////////////////////////
            labelColorRadius()
            function labelColorRadius(){
                labelSVG.append('text')
                    .attr('x', labelX) //670
                    .attr('y', 30)//30
                    .attr('text-anchor', 'left')
                    .style('font-weight', '600')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 15)
                    .style('fill', '#666666')
                    .text("Total Sleep")

                // radius label    
                labelSVG.append('text')
                    .attr('x', labelX)
                    .attr('y', 160)
                    .attr('text-anchor', 'left')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 15)
                    .style('fill', '#666666')
                    .style('font-weight', '600')
                    .text("Radius: ");

                //remove old label
                d3.select("#radiusLabel").remove()
                // radius label    
                labelSVG.append('text')
                    .attr('x', labelX)
                    .attr('y', 180)
                    .attr('text-anchor', 'left')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 14)
                    .style('fill', '#666666')
                    .text(function(d){
                        return radiusAttr;
                    }).attr("id", "radiusLabel");


                //update everything after clicking button
                var actualVal = d3.select("#actualValues")
                actualVal.selectAll("p").remove()
                actualVal.append("p").text("X-Axis: " + xAxisAttr)
                actualVal.append("p").text("Y-Axis: " + yAxisAttr)
                actualVal.append("p").text("Radius: " + radiusAttr)
            }
            
            //////////////////* average*////////////////////////////////////////////////////////////////////////////////////////////////////////
            labelAverageValues()
            function labelAverageValues(){
                /*var avgDiv = svg.append("rect")  
                                    .attr("x", 700)
                                    .attr("y", 220)
                                    .attr("width", 200)
                                    .attr("height", 200)
                                    .attr("fill", "white")*/
                                    
                    labelSVG.append('text')
                    .attr('x', labelX)
                    .attr('y', 240)
                    .attr('text-anchor', 'left')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 15)
                    .style('fill', '#666666')
                    .style('font-weight', '600')
                    .text(function(d){
                        return "Average";
                    });
                function avgValue(name, value, id, y){
                    //remove old label
                    d3.select("#"+id+"label").remove()
                    d3.select("#"+id+"value").remove()
                    // avg x label    
                    labelSVG.append('text')
                        .attr('x', labelX)
                        .attr('y', y)
                        .attr('text-anchor', 'left')
                        .style('font-family', 'Helvetica')
                        .style('font-size', 13)
                        .style('fill', '#666666')
                        .text(function(d){
                            return name + ": ";
                        }).attr("id", id +"label");
                    labelSVG.append('text')
                        .attr('x', labelX)
                        .attr('y', y+15)
                        .attr('text-anchor', 'left')
                        .style('fill', '#666666')
                        .style('font-family', 'Helvetica')
                        .style('font-size', 15)
                        .text(function(d){
                            return Math.round((value + Number.EPSILON) * 100) / 100 + " / 100"; //TODO
                        }).attr("id", id+"value");
                }
                if(xAxisAttr != "date" && xAxisAttr != "week"){
                    avgValue(xAxisAttr, avgX, "averageX", 260)
                } 
                
                avgValue(yAxisAttr, avgY, "averageY", 290)
                avgValue(radiusAttr, avgR, "averageRadius", 320)
                //remove old label
                d3.select("#averageCircle").remove()

                svg.append('circle')
                        //.attr("cx", xScale(avgX))
                        .attr("cx", 700)
                        .attr("cy", 400)
                        //.attr("cy", yScale(avgY))
                        //.attr("fill", function(d){
                        //    console.log(avgC);
                        //   return generateColor(avgC)})
                        .attr("fill", "black")
                        .attr("r", function(d){return radius(avgR)/15})
                        .attr("id", "averageCircle");
            }

            //////////////////* axis*////////////////////////////////////////////////////////////////////////////////////////////////////////
            createAxis()
            function createAxis(){
                //remove old label
                d3.select("#xAxisLabel").remove()
                // X label/new X label
                svg.append('text')
                    .attr('x', width/2 + 100)
                    .attr('y', height - 15 + 150)
                    .attr('text-anchor', 'middle')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 12)
                    .text(function(d){
                        return xAxisAttr;
                    }).attr("id", "xAxisLabel");

                //remove old label
                d3.select("#yAxisLabel").remove()
                // Y label/new Y label
                svg.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'translate(60,' + height + ')rotate(-90)')
                    .style('font-family', 'Helvetica')
                    .style('font-size', 12)
                    .text(function(d){
                        return yAxisAttr;
                    }).attr("id", "yAxisLabel");

                // append x- and y-Axis
                d3.select("#xAxisAppend").remove()
                g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(xScale))
                    .attr("id", "xAxisAppend");

                d3.select("#yAxisAppend").remove()
                g.append("g")
                    .call(d3.axisLeft(yScale))
                    .attr("id", "yAxisAppend");
            }
            
            //////////////////* bubbles */////////////////////////////////////////////////////////////////////////////////////////////
          
            var circles = svg.selectAll("circle");
            circles.remove()
            var x = 0
            var y = 0
            var g2 = svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d, i) { 
                    return xScale(dropDownToValues(d, xAxisAttr, "xAxis"))})
                .attr("cy", function (d) { 
                    return yScale(dropDownToValues(d, yAxisAttr, "yAxis"))})
                .attr("r", function(d){ 
                    return generateRadius(d)})
                .attr("transform", "translate(" + translateGX + "," + translateGY + ")")
                .style("fill", function(d){ 
                    return generateColor(d.TotalSleepTime)})
                .on("mouseover",  function(d){
                    d3.select(this).transition()
                                .duration('50')
                                .attr('opacity', '.6');
                    x = d.x
                    console.log(x)
                    y = d.y
                    console.log(y)
                    d3.select(this).attr("translate", function(d){
                    handleRect(true, x, y)   
                    rectValue(d)
                    })
                })
                .on('mouseout', function (d, i) {
                    d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                    handleRect(false, 0, 0)
                });
                
                
            //////////////////* functions for creating */////////////////////////////////////////////////////////////////////////////////////////////
            /*
            *
            */
            function generateRadius(d){
                var rad = dropDownToValues(d, radiusAttr, "radius")
                var r = radius (dropDownToValues(d, radiusAttr, "radius")) /15; //10
                
                if(isNaN(r)) { return 6;} 
                else { return r;}
            }

            /*
            *
            */
            function generateColor(length){
                if(xAxisAttr =="week"){
                    return "#800080"
                } else{
                    if(length <= "05:00:00"){
                        return color("very bad");
                    } else if(length <= "06:00:00" && length > "05:00:00"){
                        return color("bad");
                    } else if(length <= "07:00:00" && length > "06:00:00"){
                        return color("ok");
                    } else if(length <= "08:00:00" && length > "07:00:00"){
                        return color("good");
                    } else if (length >= "08:00:00"){
                        return color("very good");
                    }
                }
                
            }

            //////////////////* functions for interacting */////////////////////////////////////////////////////////////////////////////////////////////

            /*
            *
            */
            function dropDownToValues(d, attr, purpose){
                if(xAxisAttr == "week"){
                    if (purpose=="xAxis"){
                        return d.kw
                    } else if(purpose == "radius"){
                        return 3
                    } else if(purpose == "yAxis"){
                        return d.MeanCat
                    }
                }else {
                    if (attr == "Activity Score") return d.ActivityScore;
                    else if (attr == "date") return timeFormat(d.date);
                    else if (attr == "Readiness Score") return d.ReadinessScore;
                    else if (attr == "Deep Sleep Score") return d.DeepSleepScore;
                    else if (attr == "HRV Balance Score") return d.HRVBalanceScore;
                    else if (attr == "Temperature Deviation") return d.TemperatureDeviation;
                    else if (attr == "Inactive Time") return d.InactiveTime;
                    else if (attr == "week") {
                        return timeFormat(d.date);
                    }
                    else return d.SleepScore;
                }
                
            }
            
            //////////////////* rectangles when mouse over */////////////////////////////////////////////////////////////////////////////////////////////
            var rectSVG = svg
                            .append("svg")
                            .attr("class", "rectSVG");
                
            var rect = rectSVG.append('rect')
                            .attr('x', 100)
                            .attr('y', height+180)
                            .attr("height", 80)
                            .attr("width", 130)
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
            
            function handleRect(b, xV, yV){
                var t = 0
                var yVal = 0
                var yValSum = 10
                if (b){
                    t = 0.8
                    function translateRect(r, translX, translY){
                        r.attr("x", xV+translX-440 )
                        r.attr("y", yV+translY-180)
                    }
                    translateRect(rect, 0, 0)
                    translateRect(rectT0, 5, yVal+20)
                    translateRect(rectT1, 5, 30)
                    translateRect(rectT2, 5, 40)
                    translateRect(rectT3, 5, 50)
                    translateRect(rectT4, 5, 60)
                    translateRect(rectT5, 10, 70)
                } else {
                    t = 0
                }
            function opacityChange(r){
                    r.transition()
                        .duration(50)
                        .style("opacity", t)
                }
                opacityChange(rect)
                rectArr.forEach(element => opacityChange(element));
            }
            
            /**
             * give rectangle values when mouse over
             **/
            function rectValue(d){
                if(xAxisAttr=="week"){
                    rectT0.text("KW " + d.kw ).attr("id","dateValue").attr("font-weight", 700)
                    //rectT1.text( + d.SleepScore )
                    var meanCat = Math.round((parseFloat(d.MeanCat) + Number.EPSILON) * 100) / 100
                    rectT2.text(yAxisAttr + ": " + meanCat )
                }else{
                    rectT0.text( d.date ).attr("id","dateValue").attr("font-weight", 700)
                    //rectT1.text(xAxisAttr + " " + dropDownToValues(d, xAxisAttr) )
                    rectT1.text("Sleep Score: " + d.SleepScore )
                    rectT2.text("Activity Score: " + d.ActivityScore)
                    rectT3.text("HRV Balance Score: " + d.HRVBalanceScore)
                    rectT4.text("Total Sleep Time: " + d.TotalSleepTime)
                    rectT5.text("Inactive Time: " + d.InactiveTime)
                    //rectT5.text("\uf107 more").attr("class", " fas rectT")
                }
                
            }
            function createRect(){
                return rectSVG.append("text")
                        .attr('x', 100)
                        .attr('y', height+180)
                        .style("opacity", 0)
                        .text("Test").attr("class", "rectT");
            }
            
            createLinePlot(ouraDataFormatted, 300, 400)

        };

        function createLinePlot(data, xPos,  yPos){
            var linePlotData = []
            d3.csv(lineData, function(d) { 
                d.date = d.date
                d.SleepScore = d.value
                d.day = (d.day)
               return d
            }).then(function(data){
                linePlotData = data
                console.log(linePlotData)
                doPlot(data)
            });
            function doPlot(data){
                // Add X axis --> it is a date format
                const margin = {top: 10, right: 30, bottom: 30, left: 60},
                width = 300 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;
                var linePlot = svg.append("g")
                linePlot.attr("transform", `translate(${xPos}, ${yPos})`)
                const x = d3.scaleTime()
                .domain(d3.extent(data, function(d) { return timeFormat(d.date); }))
                .range([ 0, width ]);
                var weekDays = ["Mon", "Tue","Wen","Th","Fri","Sat","Sun"]
                var xScale = d3.scaleBand().range([0, width])
                xScale.domain(weekDays.map(function(d) { 
                    console.log(d)
                    return d; }));
                linePlot.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(xScale));
                
                // Add Y axis
                const y = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return d.SleepScore; })])
                .range([ height, 0 ]);
                linePlot.append("g")
                .call(d3.axisLeft(y));

                // Add the line
                linePlot.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function(d) { return x(timeFormat(d.date)) })
                    .y(function(d) { return y(d.SleepScore) })
                    )
            }
            
        }
        
    },[timeAttr, prevDropDownVal, setPrevDropDownVal])
    
    return (
        <div className="row">
        <div id="test">
            <div className="column-1" >
                <Card id="labelDescription">
                <Card.Header as="h5">Label description</Card.Header>
                <Card.Body>
                    <svg width="300" height="400" id="labelSVG"></svg>
                </Card.Body>
                </Card>
            </div>
            <div className="column-2" >
                <svg width="800" height="600" id="svG"></svg>
                <div id="actualValues"></div>
            </div>
            <div className="column-3" >
     
                
                <div id="yAxis" className="dropdownDiv">
                    <h1>Timeline</h1>
                    <DropdownButton id="timeChoice" onSelect={(k) => setTimeAttr(k.replace("#/", ""))} title={timeAttr} className="select-wrapper">
                        <Dropdown.Item id="none" href="#/none">none</Dropdown.Item>
                        <Dropdown.Item id="date" href="#/date">date</Dropdown.Item>
                        <Dropdown.Item id="week" href="#/week">week</Dropdown.Item>
                    </DropdownButton>
                    <button text="Choose" id="timeButton" className="AxisButton"> Choose</button>
                </div>
                <div id="xAxiss" className="dropdownDiv" >
                    <h1>X-axis</h1>
                    <select id="xAxisChoice" input="dropdown" className="select-wrapper">
                    <option value="SleepScore ">Sleep Score </option>
                    <option value="Activity Score">Activity Score</option>
                    <option value="Readiness Score">Readiness Score</option>
                    <option value="Deep Sleep Score">Deep Sleep Score</option>
                    </select>
                    <button text="Choose" id="xAxisButton" className="AxisButton"> Choose</button>
                </div>
                <div id="yAxis" className="dropdownDiv">
                    <h1>Y-axis</h1>
                    <select id="yAxisChoice" input="dropdown" className="select-wrapper">
                    <option value="Activity Score">Activity Score</option>
                    <option value="Sleep Score">Sleep Score</option>
                    <option value="Readiness Score">Readiness Score</option>
                    <option value="Deep Sleep Score">Deep Sleep Score</option>
                    <option value="Temperature Deviation">Temperature Deviation</option>
                    </select>
                    <button text="Choose" id="yAxisButton" className="AxisButton"> Choose</button>
                </div>
                <div id="radius" className="dropdownDiv">
                    <h1>Radius</h1>
                    <select id="radiusChoice" input="dropdown" className="select-wrapper">
                        <option value="Deep Sleep Score">Deep Sleep Score</option>
                        <option value="HRV Balance Score">HRV Balance Score </option>
                        <option value="Activity Score">Activity Score</option>
                        <option value="Readiness Score">Readiness Score</option>
                        <option value="Inactive Time">Inactive Time</option>
                    </select>
                    <button text="Choose" id="radiusButton" className="AxisButton"> Choose</button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default VisGeneralFunc
