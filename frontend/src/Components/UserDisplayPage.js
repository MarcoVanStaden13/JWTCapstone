import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function UserDisplayPage(props) {
    const [fetchedData, setFetchedData] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [newRole, setNewRole] = useState('');

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
            setEditingUserId(null);
            setNewRole('');
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
                                            <p>Username: {user.username}</p>
                                            <label htmlFor='newRole'>New Role: </label>
                                            <select
                                                name="newRole"
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value)}
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="manager">Manager</option>
                                                <option value="normal">User</option>
                                            </select>
                                            <button onClick={() => handleRoleChange(user._id)}>
                                                Change Role
                                            </button>
                                            <button type="button" onClick={handleCancelEdit}>
                                                Cancel
                                            </button>
                                            <p>{`Department: ${user.department}`}</p>
                                            <p>{`Division: ${user.division}`}</p>
                                            <hr />
                                        </>
                                    ) : (
                                        <>
                                            {/* User Information */}
                                            <p>{`Username: ${user.username}`}</p>
                                            <p>
                                                {`Role: ${user.role}`}
                                                <button onClick={() => handleEditClick(user._id)}>
                                                    Edit
                                                </button>
                                            </p>
                                            <p>{`Department: ${user.department}`}</p>
                                            <p>{`Division: ${user.division}`}</p>

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