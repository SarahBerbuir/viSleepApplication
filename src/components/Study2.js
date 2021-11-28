
import React, {useState} from 'react'
import { Accordion, Button, Modal } from 'react-bootstrap';
import $ from 'jquery';
export default function Study2() {
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    function postToGoogle() {
        var field1 = $("#Name").val();
        var field2 = $("#Email").val();
        var field3 = $("#Phone").val();
        var field4 = $("#message").val();

        $.ajax({
            url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfNomGGIAL3yl-gJ6nNadOH9ptrQ0LsuieOqcWFOQx7U99tGg/formResponse",

            //add your google form generated numbers below which are also the 'names' of your inputs     
            data: {
                "entry.529429434": field1,
                "entry.1088474291": field2,
                "entry.1025941903": field3,
                "entry.1879899682": field4
            },
            type: "POST",
            dataType: "xml",
            success: function (d) {
                $('#contact').trigger('reset');
            },
            error: function (x, y, z) {
                $('#contact').trigger('reset');
            }
        });
        return false;
    }
    return (
        <div>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Accordion Item #1</Accordion.Header>
                    <Accordion.Body>
                        <div class="container">
                           <form id="contact" onSubmit={postToGoogle() ? true : false}>
            <h3>Colorlib Contact Form</h3>
            <h4>Contact us for custom quote</h4>
            <fieldset>
                <input placeholder="Your name" type="text" name="entry.291195674" data-name="Name" id="Name" required></input>
            </fieldset>
            <fieldset>
                <input placeholder="Your Email Address" type="email" name="entry.1088474291" data-name="Email"
                    id="Email" required></input>
            </fieldset>
            <fieldset>
                <input placeholder="Your Phone Number (optional)" type="tel" name="entry.1025941903" data-name="Phone"
                    id="Phone" required></input>
            </fieldset>
            <fieldset>
                <input placeholder="Your Web Site (optional)" type="url" name="entry.1124394235" data-name="website"
                    id="website" required></input>
            </fieldset>
            <fieldset>
                <textarea placeholder="Type your message here...." name="entry.1879899682" data-name="message"
                    id="message" required></textarea>
            </fieldset>
            <fieldset>
                <button name="submit" type="submit" id="contact" data-submit="...Sending">Submit</button>
            </fieldset>
            <p class="copyright">Designed by <a href="https://colorlib.com" target="_blank"
                    title="Colorlib">Colorlib</a></p>
        </form>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfNomGGIAL3yl-gJ6nNadOH9ptrQ0LsuieOqcWFOQx7U99tGg/viewform?embedded=true" width="100%" height="400" frameborder="0" marginheight="0" marginwidth="0">Wird geladen…</iframe>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
