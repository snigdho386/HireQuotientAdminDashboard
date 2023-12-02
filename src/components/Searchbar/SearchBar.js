import React, { useState } from 'react';
import { MDBInput, MDBCol } from "mdbreact";

const SearchBar = ({callBack}) => {
  
    const [currentText,setCurrentText]=useState("");
    const handleChange = (event) => {
        setCurrentText(event.target.value);
    };
    const handleKeyDown=(event)=>{
        if(event.key==='Enter')
           callBack(currentText);
    }
  return (
    <>
    <MDBCol md="6">
    <MDBInput
        type="text"
        hint='Search any keyword'
        id="message"
        name="message"
        value={currentText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </MDBCol>
  </>
  )
}

export default SearchBar