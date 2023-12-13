import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

class AuthPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            password1: '',
            password2: '',
            department: '',
            isLogin: true, // Added state to track whether it's a login or registration form
            
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleFormSubmit = async (event) => {
        event.preventDefault();

        const { username, password, password1, password2, department, isLogin } = this.state;

        if (isLogin) {
            try {
                // Make an HTTP request to your backend login endpoint
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    // Successfully logged in, handle the response accordingly (e.g., store the token)
                    const data = await response.json();
                    console.log('Login success:', data);
                    localStorage.setItem('token', data.token);
                    this.props.handleSignIn(data); // Call the handleSignIn function from App.js
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
                    body: JSON.stringify({ username, password: password1, department }),
                });

                if (response.ok) {
                    // Successfully registered, handle the response accordingly (e.g., redirect)
                    this.props.history.push('/login'); // Redirect to login page
                } else {
                    // Handle registration failure (e.g., show an error message)
                    console.error('Registration failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error during registration:', error.message);
            }
        }
    };

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
                        </>
                    )}
                    <button onClick={this.toggleForm} className="toggle-button">{isLogin ? 'Register' : 'Login'}</button>
                    <br />
                    <button type="submit" className="submit-button">{isLogin ? 'Login' : 'Register'}</button>
                </form>
                <br />

                <p>{isLogin ? 'Login' : 'Registration'} page</p>
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

export default AuthPanel;