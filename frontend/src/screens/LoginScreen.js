import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
// action
import { login } from "../actions/userActions";
// form container component
import FormContainer from "../components/FormContainer";
const LoginScreen = ({ location, history }) => {
  const [emailFromState, setEmailFromState] = useState("");
  const [passwordFromState, setPasswordFromState] = useState("");
  // if redirect variable exists use that else use /
  const redirect = location.search ? location.search.split("=")[1] : "/";
  const dispatchHook = useDispatch();
  // select the necessary state using useDispatchHook from store
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  // redirect if user is logged in
  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);
  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    // DISPATCH LOGIN Action
    dispatchHook(login(emailFromState, passwordFromState));
  };
  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
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
        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer?{" "}
          {/* check if we have a redirect value and point to redirect url else point to /register */}
          <Link to={redirect ? `register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};
export default LoginScreen;
