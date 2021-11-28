import React from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap';
import info from './resources/information-icon.svg'


function InformationMode({ modeName, active, modeText, placement, keyName }) {

  const informationGeneral = (
    <Popover key={keyName + "popover"} style={{ backgroundColor: "white", color: "#666666" }}>
      <Popover.Header key={keyName + "header"} as="h3">{modeName}</Popover.Header>
      <Popover.Body key={keyName + "body"} id="popoverbody">
        {newlineText(modeText)}
      </Popover.Body>
    </Popover>
  );
  function newlineText(sentences) {
    return sentences.split('\n').map(str => <p>{str}</p>);
  }

  //{modeName}
  return (
    <span className="informationMode" key={keyName+"span"}>

      <OverlayTrigger key={keyName+"trigger"}placement={placement} overlay={informationGeneral} className="informationHover">
        <img key={keyName+"img"} alt="informationSign" src={info} id="infovis"></img>
      </OverlayTrigger>

    </span>
  )
}

export default InformationMode
