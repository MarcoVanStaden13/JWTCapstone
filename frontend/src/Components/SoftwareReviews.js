import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

function SoftwareReviews (){

    return (
        <>
            <p>Software Reviews</p>
            
            <Link to="/">Home</Link>
            <br/>
            <Link to="/NewsManagment">News Management</Link>
            <br/>
            <Link to="/SoftwareReviews">Software Reviews</Link>
            <br/>
            <Link to="/HardwareReviews">Hardware Reviews</Link>
            <br/>
            <Link to="/OpinionPublishing">Opinion Publishing</Link>
            <br />
        </>
    );
}
    
export default SoftwareReviews;