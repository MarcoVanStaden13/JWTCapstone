import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function DataDisplay(props) {
    const [fetchedData, setFetchedData] = useState([]);

    useEffect(() => {
      setFetchedData(JSON.parse(props.data));
    }, [props.data]);
  
    const groupedData = {};
  
    // Group data by division
    fetchedData.forEach((item) => {
      if (!groupedData[item.division]) {
        groupedData[item.division] = [];
      }
      groupedData[item.division].push(item);
    });

  return (
    <>
        <p>News Management</p>
        <div className="DataDisplay">
            {Object.keys(groupedData).map((division) => (
                <div key={division}>
                    <h4>{`${division} (division)`}</h4>
                    {groupedData[division].map((item) => (
                        <div key={item._id}>
                            <p>{`ID: ${item._id}`}</p>
                            <p>{`Username: ${item.username}`}</p>
                            <p>{`Password: ${item.password}`}</p>
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

export default DataDisplay;