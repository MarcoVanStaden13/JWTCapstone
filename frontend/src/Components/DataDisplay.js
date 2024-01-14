import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function DataDisplay(props) {
    const [fetchedData, setFetchedData] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    
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
    
    const handleEditClick = (itemId) => {
        setEditingItemId(itemId);
    };
    
    const handleCancelClick = () => {
        setEditingItemId(null);
    };
    
      const handleInputChange = (e, itemId) => {
        const newData = fetchedData.map((item) => {
            if (item._id === itemId) {
                return {
                    ...item,
                    [e.target.name]: e.target.value,
                };
            }
            return item;
        });
        setFetchedData(newData);
    };
    
    const handleFormSubmit = async (e, itemId) => {
        e.preventDefault();
    
        try {
            const auth = localStorage.getItem('token');
            const response = await fetch(`/updateData/${props.department}/${itemId}`, {
                method: 'PUT',
                headers: {
                Authorization: `Bearer ${auth}`,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(fetchedData.find((item) => item._id === itemId)),
            });
    
            if (response.ok) {
                const updatedDocument = await response.json();
                console.log('Updated Document:', updatedDocument);
                // Handle success (if needed)
            } else {
                console.error('Error updating data:', response.statusText);
                // Handle error (if needed)
            }
        } catch (error) {
            console.error('Error updating data:', error);
            // Handle error (if needed)
        }
    
        setEditingItemId(null);
    };

    const isAdminOrManager = () => {
        const userLevel = localStorage.getItem('level');
        return userLevel === 'admin' || userLevel === 'manager';
    };
    

    return (
        <>
            <h1 className='pageDepartment'>{capitalizeFirstLetter(props.department)}</h1>
            <div className="DataDisplay">
                {Object.keys(groupedData)
                .sort() // Sort keys alphabetically
                .map((division) => (
                    <div key={division}>
                        <h4 className="divisionHeader">{capitalizeFirstLetter(division)}</h4>
                        {groupedData[division].map((item) => (
                            <div key={item._id}>
                               {editingItemId === item._id ? (
                                    <form onSubmit={(e) => handleFormSubmit(e, item._id)}>
                                        <label for='username'>Username: </label>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder={item.username}
                                        value={item.username || ''}
                                        onChange={(e) => handleInputChange(e, item._id)}
                                    />
                                    <br />
                                    <lable for='password'>Password: </lable>
                                    <input
                                        type="text"
                                        name="password"
                                        placeholder={item.password}
                                        value={item.password || ''}
                                        onChange={(e) => handleInputChange(e, item._id)}
                                    />
                                    <br />
                                    <button type="submit">Submit</button>
                                    <button type="button" onClick={handleCancelClick}>
                                        Cancel
                                    </button>
                                    </form>
                                ) : (
                                    <>
                                        <div className='dataDisplayLayout'>
                                            <div className='dataDisplayTopLeft'>
                                                <p>{`ID: ${item._id}`}</p>
                                                <p>{`Username: ${item.username}`}</p>
                                                <p>{`Password: ${item.password}`}</p>
                                            </div>
                                            <div className='dataDisplayTopRight'>
                                                {isAdminOrManager() && (
                                                    <button onClick={() => handleEditClick(item._id)}>
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <hr />
                                    </>
                                )}
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