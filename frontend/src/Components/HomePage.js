import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

function HomePage (props) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const [fetchedData, setFetchedData] = useState(null);
    const [fetchedUsers, setFetchedUsers] = useState(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
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

    const userLevel = () => {
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

    // Extracting division IDs
    const divisionIds = fetchedData ? (Array.isArray(fetchedData) ? fetchedData.map(division => division._id) : []) : [];


    return (
        <>

            <div className="navbar">
                <p>Welcome, {localStorage.getItem('username')}!</p>
                <p>Level: {localStorage.getItem('level')}</p>
                {isLoggedIn ? (
                    <button onClick={props.handleSignOut} className='logoutbutton'>Sign Out</button>
                ) : (
                    <Link to="/auth"><button className='logoutbutton'>Sign In</button></Link>
                )}
            </div>

            <div className="sidebar">
                <p>Department: {localStorage.getItem('department')}</p>
                <p>Division: {localStorage.getItem('division')}</p>
            </div>

            <div className="content">
                <p>{userLevel()}</p>

                <Link to="/NetworkManagment">Network Management</Link>
                <br />
                <Link to="/SoftwareReviews">Software Reviews</Link>
                <br />
                <Link to="/HardwareReviews">Hardware Reviews</Link>
                <br />
                <Link to="/OpinionPublishing">Opinion Publishing</Link>
                <br />
                <Link to="/auth">Authorization</Link>
                <br />

                {fetchedData && (
                    <div>
                        <p>Fetched Data:</p>
                        <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
                    </div>
                )}


                {/* Displaying division IDs */}
                <div>
                    <p>Division IDs:</p>
                    <pre>{JSON.stringify(divisionIds, null, 2)}</pre>
                </div>

                <div>
                    {localStorage.getItem('level') === 'admin' && (
                        <div>
                            <p>Fetched Users:</p>
                            <pre>{JSON.stringify(fetchedUsers, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>

        </>
    );

}
    
export default HomePage;