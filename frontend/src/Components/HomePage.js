import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

class HomePage extends Component {
    render() {
        const { username, handleSignOut, level, department, isLoggedIn, JWT } = this.props;
        return (
            <>
                <p>home page</p>
                <p>Welcome, {localStorage.getItem('username')}!</p>
                <button onClick={handleSignOut}>Sign Out</button>
                <br />
                <Link to="/NetworkManagment">Network Management</Link>
                <br />
                <Link to="/SoftwareReviews">Software Reviews</Link>
                <br />
                <Link to="/HardwareReviews">Hardware Reviews</Link>
                <br />
                <Link to="/OpinionPublishing">Opinion Publishing</Link>
                <br />
                <Link to="/auth">Authorization</Link>
            </>
        );
    }
}
    
export default HomePage;