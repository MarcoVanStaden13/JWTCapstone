import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

class AuthPanel extends Component {
    // Constructor to initialize state
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            password1: '',
            password2: '',
            department: '',
            division: '',
            isLogin: true, // Flag to determine whether it's a login or registration form
        };
    }

    // Handle input changes in the form
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    // Handle form submission
    handleFormSubmit = async (event) => {
        event.preventDefault();

        const { username, password, password1, password2, department, isLogin, division } = this.state;

        if (isLogin) {
            try {
                // Make an HTTP request to your backend login endpoint
                const response = await fetch('/login', {
                    method: 'POST',
                    redirect: 'follow',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    // Successfully logged in, handle the response accordingly (e.g., store the token)
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    this.props.handleSignIn(data); // Call the handleSignIn function from App.js
                    this.props.history.push('/'); // Redirect to the homepage
                } else {
                    // Handle login failure (e.g., show an error message)
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
                    this.setState({ isLogin: true }); // Set isLogin to true to switch to the login panel
                } else {
                    // Handle registration failure (e.g., show an error message)
                    console.error('Registration failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during registration:', error.message);
            }
        }
    };

    // Toggle between login and registration forms
    toggleForm = () => {
        // Toggle between login and registration forms
        this.setState((prevState) => ({ isLogin: !prevState.isLogin }));
    };

    render() {
        const { isLogin } = this.state;

        return (
            <>
                <form onSubmit={this.handleFormSubmit} className="auth-form">
                    <input
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                        className="form-input"
                        placeholder='Username'
                    />
                    <br />
                    <input
                        type="password"
                        name={isLogin ? 'password' : 'password1'}
                        value={isLogin ? this.state.password : this.state.password1}
                        onChange={this.handleInputChange}
                        className="form-input"
                        placeholder='Password'
                    />
                    <br />
                    {!isLogin && (
                        <>
                            <input
                                type="password"
                                name="password2"
                                value={this.state.password2}
                                onChange={this.handleInputChange}
                                className="form-input"
                                placeholder='Confirm Password'
                            />
                            <br />
                            <select
                                id="department"
                                name="department"
                                value={this.state.department}
                                onChange={this.handleInputChange}
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
                                value={this.state.division}
                                onChange={this.handleInputChange}
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
                    <button type="button" onClick={this.toggleForm} className="toggle-button">{isLogin ? 'Register' : 'Login'}</button>
                    <br />
                    {/* Submit button */}
                    <button type="submit" className="submit-button">{isLogin ? 'Login' : 'Register'}</button>
                </form>
                <br />

                {/* Display whether it's a login or registration page */}
                <p>{isLogin ? 'Login' : 'Registration'} page</p>
                <Link to="/">Home</Link>
                <br />
            </>
        );
    }
}

export default AuthPanel;