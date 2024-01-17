import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function AuthPanel(props) {
    const [state, setState] = useState({
        username: '',
        password: '',
        password1: '',
        password2: '',
        department: '',
        division: '',
        isLogin: true, // Flag to determine whether it's a login or registration form
    });

    const navigate = useNavigate();

    // Handle input changes in the form
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    // Handle form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const { username, password, password1, password2, department, isLogin, division } = state;

        if (isLogin) {
            try {
                // Make an HTTP request to the backend login endpoint
                const response = await fetch('/login', {
                    method: 'POST',
                    redirect: 'follow',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    // Successfully logged in, store the token
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    props.handleSignIn(data); // Call the handleSignIn function from App.js
                    navigate('/'); // Redirect to the homepage
                } else {
                    // Handle login failure
                    console.error('Login failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during login:', error.message);
            }
        } else {
            // Registration logic
            if (password1 !== password2) {
                console.error('Passwords do not match');
                return;
            }

            try {
		// Make an HTTP request to your backend register endpoint
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password: password1, department, division }),
                });

                if (response.ok) {
		    // Successfully registered, handle the response accordingly (e.g., redirect)
                    setState((prevState) => ({ ...prevState, isLogin: true })); // Set isLogin to true to switch to the login panel
                } else {
                    // Handle registration failure
                    console.error('Registration failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during registration:', error.message);
            }
        }
    };

    // Toggle between login and registration forms
    const toggleForm = () => {
        // Toggle between login and registration forms
        setState((prevState) => ({ ...prevState, isLogin: !prevState.isLogin }));
    };

    const { isLogin } = state;
    
    return (
        <>
            <form onSubmit={handleFormSubmit} className="auth-form">
                <input
                    type="text"
                    name="username"
                    value={state.username}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder='Username'
                />
                <br />
                <input
                    type="password"
                    name={isLogin ? 'password' : 'password1'}
                    value={isLogin ? state.password : state.password1}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder='Password'
                />
                <br />
                {!isLogin && (
                    <>
                        <input
                            type="password"
                            name="password2"
                            value={state.password2}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder='Confirm Password'
                        />
                        <br />
                        <select
                            id="department"
                            name="department"
                            value={state.department}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="" disabled selected hidden>Select your department</option>
                            <option value="news_management">News Management</option>
                            <option value="software_reviews">Software Reviews</option>
                            <option value="hardware_reviews">Hardware Reviews</option>
                            <option value="opinion_publishing">Opinion Publishing</option>
                        </select>
                        <br />
                        <select
                            id="division"
                            name="division"
                            value={state.division}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="" disabled selected hidden>Select your division</option>
                            <option value="writing">Writing</option>
                            <option value="editorial">Editorial</option>
                            <option value="it">IT</option>
                            <option value="advertising">Advertising</option>
                            <option value="social_media">Social Media</option>
                        </select>
                        <br />
                    </>
                )}
                {/* Toggle button to switch between login and registration forms */}
                <button type="button" onClick={toggleForm} className="toggle-button">
                    {isLogin ? 'Register' : 'Login'}
                </button>
                <br />
                {/* Submit button */}
                <button type="submit" className="submit-button">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <br />

            {/* Display whether it's a login or registration page */}	
            <p>{isLogin ? 'Login' : 'Registration'} page</p>
            <Link to="/">Home</Link>
            <br />
        </>
    );
}

export default AuthPanel;