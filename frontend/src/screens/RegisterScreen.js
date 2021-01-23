import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
// form container component
import FormContainer from "../components/FormContainer";
// register action
import { register } from "../actions/userActions";
const RegisterScreen = ({ location, history }) => {
  const [nameFromState, setNameFromState] = useState("");
  const [emailFromState, setEmailFromState] = useState("");
  const [passwordFromState, setPasswordFromState] = useState("");
  const [confirmPasswordFromState, setConfirmPasswordFromState] = useState("");
  const [messageFromState, setMessageFromState] = useState(null);
  // if redirect variable exists use that else use /
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const dispatchHook = useDispatch();
  // select the necessary state using useDispatchHook from store
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;
  // redirect if user is logged in
  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);
  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    if (passwordFromState !== confirmPasswordFromState) {
      setMessageFromState("Passwords do not match");
    } else {
      // DISPATCH REGISTER Action
      dispatchHook(register(nameFromState, emailFromState, passwordFromState));
    }
  };
  return (
    <FormContainer>
      <h1>Sign UP</h1>
      {messageFromState && (
        <Message variant="danger">{messageFromState}</Message>
      )}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        {/* Name */}
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter Name"
            value={nameFromState}
            onChange={(e) => setNameFromState(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/* Email */}
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={emailFromState}
            onChange={(e) => setEmailFromState(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/* Password */}
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={passwordFromState}
            onChange={(e) => setPasswordFromState(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/*Confirm Password */}
        <Form.Group controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPasswordFromState}
            onChange={(e) => setConfirmPasswordFromState(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Have an Account?{" "}
          {/* check if we have a redirect value and point to redirect url else point to /register */}
          <Link to={redirect ? `login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};
export default RegisterScreen;
