import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
// import reset constants
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
// import the actions
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
const ProductListScreen = ({ history, match }) => {
  // get page number to dispatch action with page number
  const pageNumber = match.params.pageNumber || 1;
  // use dispatchHook to dispatch an action
  const dispatchHook = useDispatch();
  // use useSelector hook to get a specific state value
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;
  // get success value from productDelete state
  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  // create product state
  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;
  // get the userLogin state so we can identify whether user is an admin user
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  //console.log("userInfo--ProductListScreen.js", userInfo);
  useEffect(() => {
    // reset the state when useEffect is run
    dispatchHook({ type: PRODUCT_CREATE_RESET });
    // if user is not an admin we need to redirect
    if (!userInfo.isAdmin) {
      history.push("/login");
    }
    // if sample data is successfully created naviagate page to editProduct screen with the newly created product id as route params
    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      // listProducts takes in a keyword and a page number
      dispatchHook(listProducts("", pageNumber));
    }
  }, [
    dispatchHook,
    userInfo,
    history,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);
  // delete handler
  const deleteHandler = (id) => {
    console.log("deleteHandler id", id);
    // dispatch the delete action with the id
    // DELETE Products
    if (window.confirm("Are you sure?")) {
      dispatchHook(deleteProduct(id));
    }
  };
  //   create handler
  const createProductHandler = (product) => {
    //CREATE Product creates only sample data so no id is passed
    dispatchHook(createProduct());
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i>
            Create Product
          </Button>
        </Col>
      </Row>
      {/* show loading or error message when delete action is executed */}
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {/* show loading or error message when create action is executed */}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {/* show a loading or error message if it exists else display the html */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* map through the products */}
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true}></Paginate>
        </>
      )}
    </>
  );
};
export default ProductListScreen;
