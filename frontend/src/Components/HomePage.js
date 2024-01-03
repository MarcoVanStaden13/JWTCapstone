import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

class HomePage extends Component {
    
    userLevel = () => {
        if (localStorage.getItem('level') === 'normal') {
            return <p>Normal Page</p>;
        } else if (localStorage.getItem('level') === 'manager') {
            return <p>Manager Page</p>;
        } else if (localStorage.getItem('level') === 'admin') {
            return <p>Admin Page</p>;
        } else {
            return;
        }
    }

    render() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const { username, handleSignOut, level, department, JWT, division } = this.props;
        return (
            <>

                <div className="navbar">
                    <p>Welcome, {localStorage.getItem('username')}!</p>
                    <p>Level: {localStorage.getItem('level')}</p>
                    {isLoggedIn ? (
                        <button onClick={handleSignOut} className='logoutbutton'>Sign Out</button>
                    ) : (
                        <Link to="/auth"><button className='logoutbutton'>Sign In</button></Link>
                    )}
                </div>

                <div className="sidebar">
                    <p>Department: {localStorage.getItem('department')}</p>
                    <p>Division: {localStorage.getItem('division')}</p>
                </div>

                <div className="content">
                    <p>{this.userLevel()}</p>

                    <Link to="/NetworkManagment">Network Management</Link>
                    <br />
                    <Link to="/SoftwareReviews">Software Reviews</Link>
                    <br />
                    <Link to="/HardwareReviews">Hardware Reviews</Link>
                    <br />
                    <Link to="/OpinionPublishing">Opinion Publishing</Link>
                    <br />
                    <Link to="/auth">Authorization</Link>
                </div>

            </>
        );
    }
}
    
export default HomePage;