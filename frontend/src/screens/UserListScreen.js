import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
// import the actions
import { listUsers } from "../actions/userActions";
const UserListScreen = ({ history }) => {
  // use dispatchHook to dispatch an action
  const dispatchHook = useDispatch();
  // use useSelector hook to get a specific state value
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;
  // get the userLogin state so we can identify whether user is an admin user
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  console.log("userInfo", userInfo);
  useEffect(() => {
    // dispatch the listUsers action only if userInfo is present and user is an admin
    if (userInfo && userInfo.isAdmin) {
      dispatchHook(listUsers());
    } else {
      // if not an admin redirect to login page
      // history.push("/login");
    }
  }, [dispatchHook, userInfo]);
  // delete handler
  const deleteHandler = (id) => {
    console.log("deleteHandler id", id);
  };
  return (
    <>
      <h1>Users</h1>
      {/* show a loading or error message if it exists else display the html */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {/* if admin show a green check mark */}
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};
export default UserListScreen;
