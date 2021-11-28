import React from 'react'
import logo from './resources/Log4_new.svg'
import search from './resources/magnifier.png'
import './css/Header.css'
import { Tooltip, OverlayTrigger, Nav, Navbar, Container } from 'react-bootstrap';


export default function Header() {
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Just prototype
        </Tooltip>
    );

    function changeNav(k) {
        var activeColor = "#666666"
        var notActiveColor = "white"
        var navInfo = document.getElementById("navInformations")
        var navStudy = document.getElementById("navStudy")
        var navTrends = document.getElementById("navTrends")
        var navLogIn = document.getElementById("navLogIn")
        var navHome = document.getElementById("navHome")
        var headerComp = [navInfo, navStudy, navTrends, navLogIn, navHome]
        //console.log(headerComp)
        var number;

        if (k === "#informations") number = 0
        else if (k === "#study") number = 1
        else if (k === "#trends") number = 2
        else if (k === "#logIn") number = 3
        else if (k === "#home") number = 4
        else number = 5

        for (var i = 0; i < headerComp.length; i++) {
            if (i === number) headerComp[i].style.color = activeColor;
            else headerComp[i].style.color = notActiveColor;
        }


    }
    return (
        <div>
            <Navbar className="navbar" fixed="top" onSelect={(k) => changeNav(k)} >
                <Container id="headerContainer" >
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}>
                        <Nav.Link className="navLinks" id="logoNav"><img alt="logo" src={logo} id="logoheader" /></Nav.Link>
                    </OverlayTrigger>
                    <Nav className="Navs" >
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}>
                            <Nav.Link className="navLinks" id="navLogIn" >Home</Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}>
                            <Nav.Link className="navLinks" id="navLogIn" >Information</Nav.Link>
                        </OverlayTrigger>
                        <div id="trendsOverlay" >
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                        >  
                            <Nav.Link className="navLinks" id="navTrends" >Trends</Nav.Link>  
                        </OverlayTrigger>
                        </div>
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}>
                            <Nav.Link className="navLinks" id="navLogIn" >Log-In</Nav.Link>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}>
                            <Nav.Link id="navSearch" className="navLinks">
                                <div id="searchDiv">
                                    <img alt="searchSign" src={search} id="search" />
                                    <input type="search" placeholder="search..." id="searchInput" disabled></input>
                                </div>
                            </Nav.Link>
                        </OverlayTrigger>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    )
}
