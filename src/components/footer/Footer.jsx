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
            {/* Logo and Description */}
            <Col md={6} className="mb-4">
              <h5>ShopEase</h5>
              <p>
                Find the best deals on quality products. Fast delivery and 24/7 customer service.
              </p>
            </Col>

            {/* Social Media */}
            <Col md={6} className="mb-4">
              <h5>Follow Us</h5>
              <div>
                <Button
                  variant="link"
                  href="https://facebook.com"
                  style={{ color: "#fff", margin: "0 10px" }}
                >
                  <FacebookIcon size={24} />
                </Button>
                <Button
                  variant="link"
                  href="https://instagram.com"
                  style={{ color: "#fff", margin: "0 10px" }}
                >
                  <InstagramIcon size={24} />
                </Button>
                <Button
                  variant="link"
                  href="https://twitter.com"
                  style={{ color: "#fff", margin: "0 10px" }}
                >
                  <XIcon size={24} />
                </Button>
                <Button
                  variant="link"
                  href="https://youtube.com"
                  style={{ color: "#fff", margin: "0 10px" }}
                >
                  <YoutubeIcon size={24} />
                </Button>
              </div>
            </Col>
          </Row>
          <hr style={{ backgroundColor: "#fff" }} />
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
