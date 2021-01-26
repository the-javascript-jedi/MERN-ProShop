import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
// form container component
import FormContainer from "../components/FormContainer";
// mount actions
import { listProductDetails, updateProduct } from "../actions/productActions";
// constants
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
const ProductEditScreen = (props) => {
  const { match, history } = props;
  // console.log("props", props);
  //get the product id from url
  const productId = match.params.id;
  const [nameFromState, setNameFromState] = useState("");
  const [priceFromState, setPriceFromState] = useState(0);
  const [imageFromState, setImageFromState] = useState("");
  const [brandFromState, setBrandFromState] = useState("");
  const [categoryFromState, setCategoryFromState] = useState("");
  const [countInStockFromState, setCountInStockFromState] = useState(0);
  const [descriptionFromState, setDescriptionFromState] = useState("");
  const [uploadingFromState, setUploadingFromState] = useState(false);

  const dispatchHook = useDispatch();
  // select the necessary state using useDispatchHook from store
  // we select product from productDetails state
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  // console.log("product--productDetails", product);
  // we select updated product from productUpdate state
  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    // reset the data on successfully updating the sample data
    if (successUpdate) {
      dispatchHook({ type: PRODUCT_UPDATE_RESET });
      history.push("/admin/productlist");
    } else {
      //   check if product is present
      // also check if the product id from the url does not match the product id in db then fetch the product
      // to check if old product is still present we must always display the product from the url
      if (!product.name || product._id !== productId) {
        dispatchHook(listProductDetails(productId));
      } else {
        // if product is already here then set the field values
        //(i.e if product in the url is matching with the db)
        setNameFromState(product.name);
        setPriceFromState(product.price);
        setImageFromState(product.image);
        setBrandFromState(product.brand);
        setCategoryFromState(product.category);
        setCountInStockFromState(product.countInStock);
        setDescriptionFromState(product.description);
      }
    }
  }, [dispatchHook, history, productId, product, successUpdate]);
  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    // pass the updated product details as object to action
    //   UPDATE Product
    dispatchHook(
      updateProduct({
        _id: productId,
        name: nameFromState,
        price: priceFromState,
        image: imageFromState,
        brand: brandFromState,
        category: categoryFromState,
        description: descriptionFromState,
        countInStock: countInStockFromState,
      })
    );
  };
  // uploadFileHandler event
  const uploadFileHandler = async (e) => {
    // we are passing only a single file
    const file = e.target.files[0];
    // initialize a form data object
    const formData = new FormData();
    // append image to formdata
    formData.append("image", file);
    // show loader
    setUploadingFromState(true);
    try {
      // set config file for uploading image
      const config = {
        "Content-Type": "multipart/form-data",
      };
      const { data } = await axios.post("/api/upload", formData, config);
      console.log("data--axios.post(/api/upload)-->", data);
      setImageFromState(data);
      // stop loader
      setUploadingFromState(false);
    } catch (error) {
      console.error(error);
      // stop loader
      setUploadingFromState(false);
    }
  };
  return (
    <>
      {/* Go Back Button --Go back to product list */}
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
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
            {/* Price */}
            <Form.Group controlId="Price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={priceFromState || ""}
                onChange={(e) => setPriceFromState(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* Image */}
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Image URL"
                value={imageFromState}
                onChange={(e) => setImageFromState(e.target.value)}
              ></Form.Control>
              {/* Upload file */}
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {/* show loader when file is loading */}
              {uploadingFromState && <Loader />}
            </Form.Group>
            {/* Brand */}
            <Form.Group controlId="Brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Brand"
                value={brandFromState}
                onChange={(e) => setBrandFromState(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* Count In Stock */}
            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter CountInStock"
                value={countInStockFromState}
                onChange={(e) => setCountInStockFromState(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* Category */}
            <Form.Group controlId="Category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category"
                value={categoryFromState}
                onChange={(e) => setCategoryFromState(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* Description */}
            <Form.Group controlId="Description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                value={descriptionFromState}
                onChange={(e) => setDescriptionFromState(e.target.value)}
              ></Form.Control>
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
export default ProductEditScreen;
