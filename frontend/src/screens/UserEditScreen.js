import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
// form container component
import FormContainer from "../components/FormContainer";
// mount actions
import { getUserDetails, updateUser } from "../actions/userActions";
// constants
import { USER_UPDATE_RESET } from "../constants/userConstants";
const UserEditScreen = (props) => {
  const { match, history } = props;
  console.log("props", props);
  //get the user id from url
  const userId = match.params.id;
  console.log("userId", userId);
  const [nameFromState, setNameFromState] = useState("");
  const [emailFromState, setEmailFromState] = useState("");
  const [isAdminFromState, setIsAdminFromState] = useState(false);

  const dispatchHook = useDispatch();
  // select the necessary state using useDispatchHook from store
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  // we need to get the user update state so we can know if the update was successful or not
  const userUpdate = useSelector((state) => state.userUpdate);
  //rename fields respectively
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;
  useEffect(() => {
    if (successUpdate) {
      // redirect after update
      dispatchHook({ type: USER_UPDATE_RESET });
      history.push("/admin/userlist");
    } else {
      //   check if user is present
      // also check if the user id from the url does not match the user id in db then fetch the user
      if (!user.name || user._id !== userId) {
        dispatchHook(getUserDetails(userId));
      } else {
        // if user is already here then set the field values
        setNameFromState(user.name);
        setEmailFromState(user.email);
        setIsAdminFromState(user.isAdmin);
      }
    }
  }, [dispatchHook, history, userId, user, successUpdate]);
  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    // pass the updated user details as object to action
    dispatchHook(
      updateUser({
        _id: userId,
        name: nameFromState,
        email: emailFromState,
        isAdmin: isAdminFromState,
      })
    );
  };
  return (
    <>
      {/* Go Back Button */}
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {/* showLoading and error for update action*/}
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {/* show a loading icon or error icon based on the flags from action state */}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
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
            {/* Checkbox */}
            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                // no placeholder for checkbox only label
                label="Is Admin"
                value={isAdminFromState}
                checked={isAdminFromState}
                onChange={(e) => setIsAdminFromState(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};
export default UserEditScreen;
