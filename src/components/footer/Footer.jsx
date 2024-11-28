import React from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from ".././../assets/icons/Icons.jsx";
import "./Footer.css"

const Footer = () => {
  return (
    <div className="footer">
      <footer style={{ backgroundColor: "#343a40", color: "#fff", padding: "20px 0" }}>
        <Container  bg="dark" data-bs-theme="dark">

          <Row>
            <Col className="text-center">
              <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
