import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Head } from '@inertiajs/react';
import Axios from 'axios'; // Import Axios for making API requests

export default function Welcome({ users }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriterion, setSortCriterion] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const { auth } = usePage().props;

    const [usersList, setUsersList] = useState(users); // Initialize with the initial list of users

    function deleteUser(userId) {
        if (window.confirm('Are you sure you want to delete this user?')) {
            Axios.defaults.xsrfCookieName = 'XSRF-TOKEN'; // The name of the CSRF cookie in Laravel
            Axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'; // The name of the CSRF token header in Laravel

            Axios.delete(`/users/${userId}`)
                .then((response) => {
                    // Update the user list by filtering out the deleted user
                    setUsersList((prevUsers) => prevUsers.filter((user) => user.id !== userId));

                    alert('User deleted successfully.');
                })
                .catch((error) => {
                    alert('Error deleting user. Please try again.');
                    console.log(error);
                });
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
                    <input
                        type="text"
                        className="rounded-lg px-6"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            }
        >
            <Head title="Welcome" />

            <div className="pt-4">
                <div className="pt-2">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <button className="text-left w-40 px-6 p-2 text-gray-900" onClick={() => setSortCriterion('name')}>sort by name</button>
                            <button className="text-left w-36 px-6 p-2 text-gray-900" onClick={() => setSortCriterion('role')}>sort by role</button>
                            <button className="text-left w-48 px-6 p-2 text-gray-900" onClick={() => setSortCriterion('email')}>sort by email</button>
                            <button className="text-left w-40 px-6 p-2 text-gray-900 ml-auto" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                                {sortOrder === 'asc' ? 'ascending' : 'descending'}
                            </button>
                        </div>
                    </div>
                </div>
                {usersList.length === 0 ? (
                    <p>No users found with the given search term.</p>
                ) : (
                    usersList
                        .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .sort((a, b) => {
                            if (sortCriterion === 'name') {
                                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                            } else if (sortCriterion === 'email') {
                                return sortOrder === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
                            } else if (sortCriterion === 'role') {
                                if (sortOrder === 'asc') {
                                    return a.admin - b.admin; // Ascending order
                                } else {
                                    return b.admin - a.admin; // Descending order
                                }
                            }

                            return 0; // No sorting
                        })
                        .map((user) => (
                            <div className="pt-2" key={user.id}>
                                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                    <div className="flex bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                        <div className="text-left w-40 p-6 text-gray-900">
                                            {user.name} {auth.user.id == user.id ? " (me)" : null}
                                        </div>
                                        <div className="text-left w-36 p-6 text-gray-900">{user.admin == 1 ? "admin" : "subscriber"}</div>
                                        <div className="text-left w-56 p-6 text-gray-900">{user.email}</div>
                                        {user.id !== auth.user.id && 
                                            <div
                                                className="text-left w-40 p-6 text-gray-900 ml-auto cursor-pointer"
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                delete
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}
