import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function UserDisplayPage(props) {
    const [fetchedData, setFetchedData] = useState([]);
    useEffect(() => {
        setFetchedData(JSON.parse(props.data) || []);
    }, [props.data]);

    const groupedData = {};

    // Group data by division
    fetchedData.forEach((item) => {
        if (!groupedData[item.division]) {
            groupedData[item.division] = [];
        }
        groupedData[item.division].push(item);
    });

    const capitalizeFirstLetter = (string) => {
        // Remove underscores and capitalize each word
        const stringWithoutUnderscores = string.replace(/_/g, ' ');
        return stringWithoutUnderscores.replace(/\b\w/g, (match) => match.toUpperCase());
    };

    return (
        <>
            <h1 className='pageDepartment'>Users</h1>
            <div className="UserDisplay">
                {Object.keys(groupedData)
                    .sort()
                    .map((division) => (
                        <div key={division}>
                            <h4 className="divisionHeader">{capitalizeFirstLetter(division)}</h4>
                            {groupedData[division].map((user) => (
                                <div key={user._id}>
                                    <p>{`ID: ${user._id}`}</p>
                                    <p>{`Username: ${user.username}`}</p>
                                    <p>{`Role: ${user.role}`}</p>
                                    <p>{`Department: ${user.department}`}</p>
                                    <p>{`Division: ${user.division}`}</p>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    ))}
            </div>

            <Link to="/">Home</Link>
            <br />

            <Link to="/AuthPanel">AuthPanel</Link>
            <br />
        </>
    );
}

export default UserDisplayPage;