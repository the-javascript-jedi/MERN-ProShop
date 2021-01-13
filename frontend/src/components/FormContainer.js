import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// all form we create will go in here as children
const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        {/* on small screen take up all columns on medium screens take up 6 columns */}
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};
export default FormContainer;
