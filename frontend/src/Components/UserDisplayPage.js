import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AssignDesign from './AssignDesign.js';
import '../App.css';

function UserDisplayPage(props) {
    
    // State variables
    const [fetchedData, setFetchedData] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [newRole, setNewRole] = useState('');

    // Update fetchedData when props.data changes
    useEffect(() => {
        setFetchedData(JSON.parse(props.data) || []);
    }, [props.data]);

    const groupedData = {};

    // Group data by division
    fetchedData.forEach((item) => {
        if (!groupedData[item.role]) {
            groupedData[item.role] = [];
        }
        groupedData[item.role].push(item);
    });

    // Helper function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        // Remove underscores and capitalize each word
        const stringWithoutUnderscores = string.replace(/_/g, ' ');
        return stringWithoutUnderscores.replace(/\b\w/g, (match) => match.toUpperCase());
    };

    // Handle click event to start editing user
    const handleEditClick = (userId) => {
        setEditingUserId(userId);
    };

    // Cancel the edit mode
    const handleCancelEdit = () => {
        setEditingUserId(null);
    };

    // Handle role change for a user
    const handleRoleChange = async (userId) => {
        try {
            const auth = localStorage.getItem('token');
            const response = await fetch(`/changeUserRole/${userId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${auth}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newRole }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('User Role Changed:', updatedUser);

                // Update the local state with the changed user role
                const updatedData = fetchedData.map((user) =>
                    user._id === userId ? { ...user, role: newRole } : user
                );
                setFetchedData(updatedData);
            } else {
                console.error('Error changing user role:', response.statusText);
                // Handle error (if needed)
            }
        } catch (error) {
            console.error('Error changing user role:', error);
            // Handle error (if needed)
        } finally {
            // Reset editing state variables
            setEditingUserId(null);
            setNewRole('');
        }
    };

    return (
        <>
            <h1 className='pageDepartment'>Users</h1>
            {/* User Display Section */}
            <div className="UserDisplay">
                {Object.keys(groupedData)
                    .sort()
                    .map((division) => (
                        <div key={division}>
                            {/* Division Header */}
                            <h4 className="divisionHeader">{capitalizeFirstLetter(division)}</h4>

                            {/* User Information */}
                            {groupedData[division].map((user) => (
                                <div key={user._id}>
                                    {editingUserId === user._id ? (
                                        // Edit Mode
                                        <>
                                            <p>Username: {user.username}</p>
                                            <label htmlFor='newRole'>New Role: </label>
                                            <select
                                                name="newRole"
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value)}
                                            >
                                                <option value="" disabled selected hidden>Set user role</option>
                                                <option value="admin">Admin</option>
                                                <option value="manager">Manager</option>
                                                <option value="normal">User</option>
                                            </select>&emsp;
                                            <button className='submitButton' onClick={() => handleRoleChange(user._id)}>
                                                Change Role
                                            </button>&emsp;
                                            <button className='cancelButton' type="button" onClick={handleCancelEdit}>
                                                Cancel
                                            </button>
                                            <p>{`Department: ${user.department}`}</p>
                                            <p>{`Division: ${user.division}`}</p>
                                            <hr />
                                        </>
                                    ) : (
                                        // Display Mode
                                        <>
                                            {/* User Information */}
                                            <p>{`Username: ${user.username}`}</p>
                                            <p>
                                                {`Role: ${user.role}`}&nbsp;
                                                <button className='editButton' onClick={() => handleEditClick(user._id)}>
                                                    Edit
                                                </button>
                                            </p>
                                            <p>{`Department: ${user.department}`}</p>
                                            <p>{`Division: ${user.division}`}</p>
                                            <AssignDesign userData={user} siteData={props.siteData}/>
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

export default UserDisplayPage;