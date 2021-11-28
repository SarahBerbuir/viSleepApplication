import * as d3 from 'd3'
import React, { Component, useState, useEffect, useRef } from 'react'


function HoverBox({opacity, x, y}) {
    const [opac, setOpacity] = useState(0)
    var headline = "2021-06-12"
    var xAxisAttr = "Sleep Score"
    var xAxisAttrVal = "70"
    var yAxisAttr = "Activity Score"
    var yAxisAttrVal = "70"
    var radiusAttr = "Deep Sleep Score"
    var radiusAttrVal = "70"
    var colorAttr = "Total Sleep Time"
    var colorAttrVal = "70"

    var generalHoverBox = d3.select("#GeneralHoverBox")

    
    d3.select("#GeneralHoverBox").style("opacity", opacity)
    var rectGroup = generalHoverBox.append("g")
    rectGroup
        .append("rect")
        .attr("width", 300)
        .attr("height", 300)
        .attr("x", x)
        .attr("y", y)
        .style("fill","#34A5DA")
    rectGroup
        .append("text")
        .text(headline)
        .attr("y", x)
        .attr("y", y + 20)
    rectGroup
        .append("text")
        .text(xAxisAttr  + " " + xAxisAttrVal)
        .attr("y", x)
        .attr("y", y +40)
    rectGroup.attr("transform", "translate(0,200)");

    return (
        <div >
           <svg id="GeneralHoverBox">

           </svg>
        </div>
    )
}

export default HoverBox
