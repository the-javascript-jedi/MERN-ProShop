import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import bread crumbs
import CheckOutSteps from "../components/CheckOutSteps";
// form container component
import FormContainer from "../components/FormContainer";
// import action
import { saveShippingAddress } from "../actions/cartActions";
const ShippingScreen = ({ history }) => {
  // get the shipping address details from redux which were set using local storage if available
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  console.log("shippingAddress", shippingAddress);
  // set the state values to local storage value if available
  const [addressFromState, setAddressFromState] = useState(
    shippingAddress.addressFromState
  );
  const [cityFromState, setCityFromState] = useState(
    shippingAddress.cityFromState
  );
  const [postalCodeFromState, setPostalCodeFromState] = useState(
    shippingAddress.postalCodeFromState
  );
  const [countryCodeFromState, setCountryCodeFromState] = useState(
    shippingAddress.countryCodeFromState
  );
  const dispatchHook = useDispatch();
  //   submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submit");
    // dispatch action with the form data
    dispatchHook(
      //this data is stored in local storage inside action
      saveShippingAddress({
        addressFromState,
        cityFromState,
        postalCodeFromState,
        countryCodeFromState,
      })
    );
    history.push("/payment");
  };
  return (
    <FormContainer>
      {/* Bread Crumbs */}
      {/* step1 and step2 will be enabled */}
      <CheckOutSteps step1 step2 />
      {/* checkout steps to be added */}
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        {/* Name */}
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={addressFromState}
            required
            onChange={(e) => setAddressFromState(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/* City */}
        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter City"
            value={cityFromState}
            required
            onChange={(e) => setCityFromState(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/* Postal Code */}
        <Form.Group controlId="city">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Postal Code"
            value={postalCodeFromState}
            required
            onChange={(e) => setPostalCodeFromState(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {/* Country */}
        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Country"
            value={countryCodeFromState}
            required
            onChange={(e) => setCountryCodeFromState(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};
export default ShippingScreen;
