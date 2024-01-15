import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import DataDisplay from './DataDisplay.js';
import UserDisplayPage from './UserDisplayPage.js';
import '../App.css';

function HomePage (props) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const [fetchedData, setFetchedData] = useState(null);
    const [fetchedUsers, setFetchedUsers] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('usersData');
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    // Set the default category based on user level during component mount
    useEffect (() => {
        if(localStorage.getItem('level') !== 'admin'){
            setSelectedCategory(localStorage.getItem('department'));
        } else {
            setSelectedCategory('users');
        };
    }, []);
  
    // Toggle dropdown state
    const toggleDropdown = () => {
      setDropdownOpen(!isDropdownOpen);
    };

    // Fetch data from server
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch document data based on user department and division
                const response = await fetch(`/data/${localStorage.getItem('department')}/${localStorage.getItem('division') || 'all'}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched Data:', data);
                    setFetchedData(data.document || data.allDocuments || data);
                } else {
                    console.error('Error during data fetch:', response.statusText);
                }

                // Fetch all users if the user is an admin
                if (localStorage.getItem('level') === 'admin') {
                    const usersResponse = await fetch('/allUsers', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (usersResponse.ok) {
                        const usersData = await usersResponse.json();
                        console.log('Fetched Users:', usersData);
                        setFetchedUsers(usersData);
                    } else {
                        console.error('Error during users fetch:', usersResponse.statusText);
                    }
                }

            } catch (error) {
                console.error('Error during data fetch:', error);
            }
        };

        fetchData();
    }, []);

     // Render content based on user department and category
    const userDepartment = () => {
        if(localStorage.getItem('isLoggedIn')){
            if (selectedCategory === 'users' && localStorage.getItem('level') === 'admin') {
                return (
                    <>
                        {fetchedData && (
                            <div>
                                <UserDisplayPage data={JSON.stringify(fetchedUsers, null, 2)} siteData={JSON.stringify(fetchedData)}/>
                            </div>
                        )}
                    </>
                );
            } else if (selectedCategory === 'usersData' && localStorage.getItem('level') === 'admin') {
                return (
                    <>
                        {fetchedData && (
                            <div>
                                <p>Fetched Data:</p>
                                <pre>{JSON.stringify(fetchedUsers, null, 2)}</pre>
                            </div>
                        )}
                    </>
                );
            } else if (selectedCategory === 'data') {
                return (
                    <>
                        {fetchedData && (
                            <div>
                                <p>Fetched Data:</p>
                                <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
                            </div>
                        )}
                    </>
                );
            } else {
                if (localStorage.getItem('level') === 'admin') {
                    return <DataDisplay data={JSON.stringify(fetchedData[selectedCategory])} department={selectedCategory} />;
                } else {
                    return <DataDisplay data={JSON.stringify(fetchedData)} department={selectedCategory} />;
                }
            }
        } else {
            return (<></>)
        }
    };

    // Helper function to capitalize the first letter aswell as replace any underscores with spaces
    const capitalizeFirstLetter = (string) => {
        // Remove underscores and capitalize each word
        const stringWithoutUnderscores = string.replace(/_/g, ' ');
        return stringWithoutUnderscores.replace(/\b\w/g, (match) => match.toUpperCase());
    };

    return (
        <>

            <div className="navbar">
                <p>Welcome, {localStorage.getItem('username')}!</p>
                <p>Level: {localStorage.getItem('level')}</p>
                {/* Conditional rendering of Sign Out or Sign In button */}
                {isLoggedIn ? (
                    <button onClick={props.handleSignOut} className='logoutbutton'>Sign Out</button>
                ) : (
                    <Link to="/auth"><button className='logoutbutton'>Sign In</button></Link>
                )}
            </div>

            <div className="sidebar">
                {/* Dropdown for admin users */}
                {localStorage.getItem('level') === 'admin' ? (
                    <>
                        <div className="dropdown-container">
                            <button onClick={toggleDropdown} className="dropdown-button">
                                Select Category
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-content">
                                    {/* uncomment for raw data */}
                                    {/* <button onClick={() => setSelectedCategory('data')}>All Data</button>
                                    <br />
                                    <button onClick={() => setSelectedCategory('usersData')}>Users Data</button>
                                    <br /> */}
                                    <button onClick={() => setSelectedCategory('news_management')}>News Management</button>
                                    <br />
                                    <button onClick={() => setSelectedCategory('software_reviews')}>Software Reviews</button>
                                    <br />
                                    <button onClick={() => setSelectedCategory('hardware_reviews')}>Hardware Reviews</button>
                                    <br />
                                    <button onClick={() => setSelectedCategory('opinion_publishing')}>Opinion Publishing</button>
                                    <br />
                                    <button onClick={() => setSelectedCategory('users')}>Users</button>
                                    <br />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                    {/* Dropdown for non-admin users */}
                        <div className="dropdown-container">
                            <button onClick={toggleDropdown} className="dropdown-button">
                                Select Category
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-content">
                                    <button onClick={() => setSelectedCategory(localStorage.getItem('department'))}>{capitalizeFirstLetter(localStorage.getItem('department'))}</button>
                                    <br />
                                    {/* uncomment for raw data */}
                                    {/* <button onClick={() => setSelectedCategory('data')}>All Data</button> */}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="content">
                {userDepartment()}
            </div>

        </>
    );

}
    
export default HomePage;