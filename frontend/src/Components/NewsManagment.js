import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

class NewsManagment extends Component{
    render (){
        return (
            <>
                <p>News Managment</p>
                
                <Link to="/">Home</Link>
                <br />
                <Link to="/NewsManagment">News Management</Link>
                <br />
                <Link to="/SoftwareReviews">Software Reviews</Link>
                <br />
                <Link to="/HardwareReviews">Hardware Reviews</Link>
                <br />
                <Link to="/OpinionPublishing">Opinion Publishing</Link>
                <br />
                <Link to="/AuthPanel">AuthPanel</Link>
                <br />
            </>
        );
    }
}
    
export default NewsManagment;