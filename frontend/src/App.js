import React, { Component } from 'react';
import { Routes, Route, Navigate  } from "react-router-dom";
import HomePage from './Components/HomePage.js';
import NetworkManagment from './Components/NetworkManagment.js';
import SoftwareReviews from './Components/SoftwareReviews.js';
import HardwareReviews from './Components/HardwareReviews.js';
import OpinionPublishing from './Components/OpinionPublishing.js';
import AuthPanel from './Components/AuthPanel.js'
import './App.css';

class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            userName: '',
            department: '',
            level: '',
            everyTime: true,
            JWT: '',
        };
    }

    // State Function to log user in and change the userName to the one entered every time the user logs in
    handleSignIn = (token) => {
        const decodedToken = parseJwt(token);


        this.setState({
            isLoggedIn: true,
            userName: decodedToken.username,
            department: decodedToken.department,
            level: decodedToken.level,
            JWT: token,
        });

    };

    // State Function to log the user out
    handleSignOut = () => {
        this.setState({
            isLoggedIn: false,
            userName: '',
            department: '',
            level: '',
            JWT: '',
        });
    };

    render (){
        const { isLoggedIn, userName } = this.state;
        return (
            <>
                <Routes>
                    <Route
                        path="/"
                        element={
                        isLoggedIn ? (
                            <HomePage handleSignOut={this.handleSignOut} userName={userName} />
                        ) : (
                            <Navigate to="/auth" replace />
                        )
                        }
                    />
                    <Route path="/auth" element={<AuthPanel handleSignIn={this.handleSignIn} />} />
          
                    <Route exact path="/NetworkManagment" element={<NetworkManagment />}/>
                    <Route exact path="/SoftwareReviews" element={<SoftwareReviews />}/>
                    <Route exact path="/HardwareReviews" element={<HardwareReviews />}/>
                    <Route exact path="/OpinionPublishing" element={<OpinionPublishing />}/>
                </Routes>
            </>
        );
    }
}

// Helper function to parse JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
}

export default App;