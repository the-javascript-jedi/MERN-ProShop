import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import bread crumbs
import CheckOutSteps from "../components/CheckOutSteps";
// form container component
import FormContainer from "../components/FormContainer";
// import action
import { savePaymentMethod } from "../actions/cartActions";
const PaymentScreen = ({ history }) => {
  // get the shipping address details from redux which were set using local storage if available
  // const cart = useSelector((state) => state.cart);
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  // get the PAYMENT details from redux which were set
  const { paymentMethod } = cart;
  console.log("shippingAddress", shippingAddress);
  // redirect if no shipping address
  if (!shippingAddress) {
    history.push("/shipping");
  }
  const [paymentMethodFromState, setPaymentMethodFromState] = useState(
    paymentMethod
  );
  const dispatchHook = useDispatch();
  //   submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submit");
    // dispatch action with to save the payment method
    dispatchHook(savePaymentMethod(paymentMethodFromState));
    history.push("/placeorder");
  };
  return (
    <FormContainer>
      {/* Bread Crumbs */}
      {/* step1, step2 and step3 will be enabled */}
      <CheckOutSteps step1 step2 step3 />
      {/* checkout steps to be added */}
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            {/* PayPal option */}
            <Form.Check
              type="radio"
              label="Paypal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              onChange={(e) => setPaymentMethodFromState(e.target.value)}
              checked={paymentMethodFromState === "PayPal"}
            ></Form.Check>
            {/* Stripe option */}
            <Form.Check
              type="radio"
              label="Stripe"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              onChange={(e) => setPaymentMethodFromState(e.target.value)}
              checked={paymentMethodFromState === "Stripe"}
            ></Form.Check>
          </Col>
          {/* Form.Group should end after Col */}
        </Form.Group>
        {/* submit method */}
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};
export default PaymentScreen;
