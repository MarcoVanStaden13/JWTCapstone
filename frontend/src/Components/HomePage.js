import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

function HomePage (props) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const [fetchedData, setFetchedData] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`/data/${localStorage.getItem('department')}/${localStorage.getItem('division')}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
            });
    
            if (response.ok) {
              const data = await response.json();
              console.log('Fetched Data:', data);
              setFetchedData(data.document);
            } else {
              console.error('Error during data fetch:', response.statusText);
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
            </div>

        </>
    );

}
    
export default HomePage;