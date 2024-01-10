import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

function NewsManagment (props){
    const [fetchedData, setFetchedData] = useState([]);

    useEffect(() => {
        setFetchedData(JSON.parse(props.data));
    }, [props.data]);

    return (
        <>
            <p>News Managment</p>
            <div className="newsManagmentDepartment">
                {Array.isArray(fetchedData) ? (
                    fetchedData.map((division) => (
                        <div key={division._id}>
                            <h3>{`Division: ${division._id}`}</h3>
                            <div className="loginsContainer">
                                {Object.entries(division.Logins).map(([loginName, loginInfo]) => (
                                    <div key={loginInfo._id} className="login">
                                        <h4>{`Login Name: ${loginName}`}</h4>
                                        <p>{`Username: ${loginInfo.username}`}</p>
                                        <p>{`Password: ${loginInfo.password}`}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <p>Normal user only one division</p>
                        {Object.entries(fetchedData.Logins).map(([loginName, loginInfo]) => (
                            <div key={loginInfo._id} className="login">
                                <h4>{`Login Name: ${loginName}`}</h4>
                                <p>{`Username: ${loginInfo.username}`}</p>
                                <p>{`Password: ${loginInfo.password}`}</p>
                            </div>
                        ))}
                    </>
                )}
            </div>
            
            <Link to="/">Home</Link>
            <br />
            <Link to="/NewsManagment">News Management</Link>
            <br />
            <Link to="/SoftwareReviews">Software Reviews</Link>
            <br />
            <Link to="/HardwareReviews">Hardware Reviews</Link>
            <br />
            <Link to="/OpinionPublishing">Opinion Publishing</Link>
            <br />
            <Link to="/AuthPanel">AuthPanel</Link>
            <br />
        </>
    );
}
    
export default NewsManagment;