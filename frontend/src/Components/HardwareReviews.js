import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

class HardwareReviews extends Component{
    render (){
        return (
            <>
                <p>Hardware Reviews</p>
                
                <Link to="/">Home</Link>
                <br />
                <Link to="/NetworkManagment">Network Management</Link>
                <br />
                <Link to="/SoftwareReviews">Software Reviews</Link>
                <br />
                <Link to="/HardwareReviews">Hardware Reviews</Link>
                <br />
                <Link to="/OpinionPublishing">Opinion Publishing</Link>
                <br />
                <Link to="/AuthPanel">AuthPanel</Link>
            </>
        );
    }
}
    
export default HardwareReviews;