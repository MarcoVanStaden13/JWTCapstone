import React, { Component } from 'react';
import { Routes, Route, Navigate  } from "react-router-dom";
import HomePage from './Components/HomePage.js';
import AuthPanel from './Components/AuthPanel.js'
import './App.css';

class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            username: '',
            department: '',
            level: '',
            division: '',
        };
    };

    // State Function to log user in and change the userName to the one entered every time the user logs in
    handleSignIn = async (token) => {
        console.log(localStorage.getItem('token'));
        fetch('/verify', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    isLoggedIn: true,
                    username: data.username,
                    department: data.department,
                    level: data.level,
                    division: data.division,
                }, () => {
                    // Save data to localStorage
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('department', data.department);
                    localStorage.setItem('level', data.level);
                    localStorage.setItem('division', data.division);

                    console.log('State:', this.state);
                    console.log('Data saved to localStorage:', localStorage);
                });
            })
            .catch(error => {
                console.error("There was a problem verifying the data:", error);
            });

    }

    // State Function to log the user out
    handleSignOut = () => {
        this.setState({
            isLoggedIn: false,
            username: '',
            department: '',
            level: '',
            division: '',
        });

        // Clear localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('department');
        localStorage.removeItem('level');
        localStorage.removeItem('JWT');
        localStorage.removeItem('division');
    };

    render (){
        const { username, level, department, isLoggedIn, JWT, division } = this.state;
        return (
            <>
                <Routes>
                    {/* <Route
                        path="/"
                        element={
                        isLoggedIn ? (
                            <HomePage handleSignOut={this.handleSignOut} username={username} />
                        ) : (
                            <Navigate to="/auth" replace />
                        )
                        }
                    /> */}
                    <Route exact path="/" element={
                        <HomePage
                            handleSignOut={this.handleSignOut} 
                            username={username}
                            level={level}
                            department={department}
                            isLoggedIn={isLoggedIn}
                            JWT={JWT}
                            division={division}
                        />
                    } />
                    <Route path="/auth" element={<AuthPanel handleSignIn={this.handleSignIn} />} />
                  
                </Routes>
                {/* <NewsManagment />
                <SoftwareReviews />
                <HardwareReviews />
                <OpinionPublishing /> */}
            </>
        );
    }
}
  
export default App;