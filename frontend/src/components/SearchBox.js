import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBox = ({ history }) => {
  const [keyWord, setkeyWord] = useState("");
  // search form  submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    // check for keyword and trim any whitespace
    if (keyWord.trim()) {
      history.push(`/search/${keyWord}`);
    } else {
      history.push("/");
    }
  };
  return (
    <>
      <Form onSubmit={submitHandler} style={{ display: "flex" }}>
        <Form.Control
          type="text"
          name="q"
          onChange={(e) => {
            setkeyWord(e.target.value);
          }}
          placeholder="Search Products..."
          className="mr-sm-2 ml-sm-5"
        ></Form.Control>
        <Button type="submit" variant="outline-success" className="p-2">
          Search
        </Button>
      </Form>
    </>
  );
};

export default SearchBox;
