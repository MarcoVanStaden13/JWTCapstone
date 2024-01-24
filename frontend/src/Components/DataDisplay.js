import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function DataDisplay(props) {
    // State variables
    const [fetchedData, setFetchedData] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [addingCredentialForDivision, setAddingCredentialForDivision] = useState(null);
    const [newCredential, setNewCredential] = useState({
        division: '',
        username: '',
        password: '',
    });
    
    // Update fetchedData state when props.data changes
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
    
        // Helper function to capitalize the first letter aswell as replace any underscores with spaces
    const capitalizeFirstLetter = (string) => {
        //Check if string is null or undefined
        if (!string){
            return string;
        }
        // Remove underscores and capitalize each word
        const stringWithoutUnderscores = string.replace(/_/g, ' ');
        return stringWithoutUnderscores.replace(/\b\w/g, (match) => match.toUpperCase());
    };
    
    // Handle click to start editing an item
    const handleEditClick = (itemId) => {
        setEditingItemId(itemId);
    };
    
    // Handle click to cancel editing
    const handleCancelClick = () => {
        setEditingItemId(null);
    };
    
    // Handle input change for editing an item
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
    
    // Handle form submission for editing an item
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
            } else {
                console.error('Error updating data:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
        setEditingItemId(null);
    };

    // Check if the user is an admin or manager
    const isAdminOrManager = () => {
        const userLevel = localStorage.getItem('level');
        return userLevel === 'admin' || userLevel === 'manager';
    };
    
    // Handle click to add a new credential for a division
    const handleAddCredentialClick = (division) => {
        setAddingCredentialForDivision(division);
        setNewCredential({
            division,
            username: '',
            password: '',
        });
    };

    // Handle click to cancel adding a new credential
    const handleCancelAddCredential = () => {
        setAddingCredentialForDivision(null);
        setNewCredential({
            division: '',
            username: '',
            password: '',
        });
    };

    // Handle form submission for adding a new credential
    const handleAddCredentialSubmit = async (e, division) => {
        e.preventDefault();
    
        // Check if username and password are non-empty
        if (!newCredential.username || !newCredential.password) {
            console.error('Username and password are required');
            return;
        }
    
        try {
            const auth = localStorage.getItem('token');
            const response = await fetch(`/newData/${props.department}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${auth}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    division,
                    username: newCredential.username,
                    password: newCredential.password,
                }),
            });
    
            if (response.ok) {
                // Update the state
                const newData = await response.json();
                console.log('New Credential Added:', newData);
                setAddingCredentialForDivision(null); // Reset the state
                setNewCredential({
                    username: '',
                    password: '',
                });
            } else {
                console.error('Error adding new credential:', response.statusText);
                // Handle error (if needed)
            }
        } catch (error) {
            console.error('Error adding new credential:', error);
            // Handle error (if needed)
        }
    };

    return (
        <>
        {/* Page header */}
            <h1 className='pageDepartment'>{capitalizeFirstLetter(String(props.department))}</h1>

            {/* Data display container */}
            <div className="DataDisplay">
                {Object.keys(groupedData)
                .sort() // Sort keys alphabetically
                .map((division) => (
                    <div key={division}>
                        {/* Division header */}
                        <div className='divisionHeader'>
                            <h4 className='divisionHeaderText'>{capitalizeFirstLetter(String(division))}</h4>
                            {/* Button to add a new credential */}
                            <button
                                className='divisionHeaderButton'
                                onClick={() => handleAddCredentialClick(division)}
                                disabled={addingCredentialForDivision !== null}
                            >
                                +
                            </button>

                            {/* Form for adding a new credential */}
                            {addingCredentialForDivision === division && (
                                <form onSubmit={(e) => handleAddCredentialSubmit(e, division)}>
                                    {/* Form fields for new credential */}
                                    <label htmlFor='new-username'>New Username: </label>
                                    <input
                                        type="text"
                                        id="new-username"
                                        name="username"
                                        value={newCredential.username}
                                        onChange={(e) => setNewCredential({ ...newCredential, username: e.target.value })}
                                    />

                                    <label htmlFor='new-password'>New Password: </label>
                                    <input
                                        type="text"
                                        id="new-password"
                                        name="password"
                                        value={newCredential.password}
                                        onChange={(e) => setNewCredential({ ...newCredential, password: e.target.value })}
                                    />
                                    <button className='submitButton' type="submit">Add Credential</button>
                                    <button className='cancelButton' type="button" onClick={handleCancelAddCredential}>
                                        Cancel
                                    </button>
                                </form>
                            )}
                        </div>
                        {/* Display credentials for the division */}
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
                                    <button className='submitButton' type="submit">Submit</button>
                                    <button className='cancelButton' type="button" onClick={handleCancelClick}>
                                        Cancel
                                    </button>
                                    </form>
                                ) : (
                                    // Display information for the credential
                                    <>
                                        <div className='dataDisplayLayout'>
                                            <div className='dataDisplayTopLeft'>
                                                <p>{`ID: ${item._id}`}</p>
                                                <p>{`Username: ${item.username}`}</p>
                                                <p>{`Password: ${item.password}`}</p>
                                            </div>
                                            <div className='dataDisplayTopRight'>
                                                {/* Edit button for admins and managers */}
                                                {isAdminOrManager() && (
                                                    <button className='editButton' onClick={() => handleEditClick(item._id)}>
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
        </>
    );
}

export default DataDisplay;