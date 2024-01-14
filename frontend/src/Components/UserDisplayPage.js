import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function UserDisplayPage(props) {
    const [fetchedData, setFetchedData] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [assignDivision, setAssignDivision] = useState('');
    const [assignDepartment, setAssignDepartment] = useState('');

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

    const handleEditClick = (userId) => {
        setEditingUserId(userId);
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
    };

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
                // Update the state or re-fetch data as needed
            } else {
                console.error('Error changing user role:', response.statusText);
                // Handle error (if needed)
            }
        } catch (error) {
            console.error('Error changing user role:', error);
            // Handle error (if needed)
        } finally {
            setEditingUserId(null);
            setNewRole('');
        }
    };

    const handleAssignDesign = async (userId) => {
        try {
            const auth = localStorage.getItem('token');
            const response = await fetch(`/assignUser/${userId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${auth}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ department: assignDepartment, division: assignDivision }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('User Assigned/Designed:', updatedUser);
                // Update the state or re-fetch data as needed
            } else {
                console.error('Error assigning/designing user:', response.statusText);
                // Handle error (if needed)
            }
        } catch (error) {
            console.error('Error assigning/designing user:', error);
            // Handle error (if needed)
        } finally {
            setEditingUserId(null);
            setAssignDepartment('');
            setAssignDivision('');
        }
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
                                    {editingUserId === user._id ? (
                                        <>
                                            <p>Username: {capitalizeFirstLetter(user.username)}</p>
                                            <label htmlFor='newRole'>New Role: </label>
                                            <input
                                                type="text"
                                                name="newRole"
                                                placeholder="Enter new role"
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value)}
                                            />
                                            <br />
                                            <button onClick={() => handleRoleChange(user._id)}>
                                                Change Role
                                            </button>
                                            <button type="button" onClick={handleCancelEdit}>
                                                Cancel
                                            </button>
                                            <hr />
                                        </>
                                    ) : (
                                        <>
                                            {/* User Information */}
                                            <p>{`Username: ${user.username}`}</p>
                                            <p>{`Role: ${user.role}`}</p>
                                            <p>{`Department: ${user.department}`}</p>
                                            <p>{`Division: ${user.division}`}</p>

                                            {/* Edit Button */}
                                            <button onClick={() => handleEditClick(user._id)}>
                                                Edit
                                            </button>
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

export default UserDisplayPage;