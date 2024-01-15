import React, { useState, useEffect } from 'react';
import '../App.css';

function AssignDesign(props) {
    const [user, setUser] = useState([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');

    useEffect(() => {
        setUser((props.userData) || []);
    }, [props.userData]);
    
    const handleAssignClick = () => {
        setIsAssigning(true);
    };

    const handleUnassignClick = async () => {
        try {
            // Make a request to unassign the user in the backend
            await fetch(`/unassignAssignUser/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    department: '', // Set to null or appropriate value
                    division: '' // Set to null or appropriate value
                }),
            });
    
            // Assuming a successful unassign in the backend, update the local state
            setUser({
                ...props.userData,
                department: '',
                division: ''
            });
        } catch (error) {
            console.error('Error unassigning user:', error);
            // Handle error as needed
        }
    };
    
    const handleAssignSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior (page refresh)
    
        try {
            // Make a request to assign the user in the backend
            await fetch(`/assignUser/${user._id}`, { // Corrected the URL to assignUser
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    department: selectedDepartment,
                    division: selectedDivision
                }),
            });
    
            // Assuming a successful assign in the backend, update the local state
            setUser({
                ...props.userData,
                department: selectedDepartment,
                division: selectedDivision
            });
    
            setIsAssigning(false);
        } catch (error) {
            console.error('Error assigning user:', error);
            // Handle error as needed
        }
    };

    const handleCancelAssign = () => {
        setIsAssigning(false);
        setSelectedDepartment('');
        setSelectedDivision('');
    };


    return (
        <>
            {props.userData.department && props.userData.division ? (
                <>
                    <button className='unassignButton' onClick={handleUnassignClick}>
                        Unassign
                    </button>
                </>
            ) : (
                <>
                {isAssigning ? (
                    <>
                    </>
                ) : (
                    <>
                        <button className='assignButton' onClick={handleAssignClick}>
                            Assign
                        </button>
                    </>
                )}
                    {isAssigning && (
                        <form onSubmit={handleAssignSubmit}>

                            <label htmlFor='department'>Department: </label>
                            <select
                                name='department'
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                            >

                                <option value="" disabled selected hidden>Select your department</option>
                                <option value='hardware_reviews'>Hardware Reviews</option>
                                <option value='news_management'>News Managment</option>
                                <option value='software_reviews'>Software Reviews</option>
                                <option value='opinion_publishing'>Opinion Publishing</option>
                                <option value='all'>All</option>
                            </select>
                            <br />

                            <label htmlFor='division'>Division: </label>
                            <select
                                name='division'
                                value={selectedDivision}
                                onChange={(e) => setSelectedDivision(e.target.value)}
                            >
                                <option value="" disabled selected hidden>Select your division</option>
                                <option value=''>Select Division</option>
                                <option value='writing'>Writing</option>
                                <option value='it'>It</option>
                                <option value='advertising'>Advertising</option>
                                <option value='editorial'>Editorial</option>
                                <option value='social_media'>Social Media</option>
                                <option value='all'>All</option>
                            </select>
                            <br />

                            <button type='submit'>Assign</button>&emsp;
                            <button type='button' onClick={handleCancelAssign}>
                                Cancel
                            </button>
                        </form>
                    )}
                </>
            )}
        </>
    );
}

export default AssignDesign;