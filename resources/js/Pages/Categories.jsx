import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react'

const Categories = (props) => {
    const [categories, setCategories] = useState([]);

    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editedCategoryName, setEditedCategoryName] = useState('');


    useEffect(() => {
        fetchCategories();
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleDelete = async (categoryId) => {
        const shouldDelete = window.confirm('Are you sure you want to delete this category?');

        if (!shouldDelete) {
            return; // If the user cancels, do nothing
        }

        try {
            // Send a DELETE request to delete the category
            await axios.delete(`/api/categories/${categoryId}`);
            // After deletion, fetch the updated list of categories
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`/api/categories/${editingCategoryId}`, {
                name: editedCategoryName,
            });

            // After updating, fetch the updated list of categories
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
        } finally {
            // Reset editing state
            setEditingCategoryId(null);
            setEditedCategoryName('');
        }
    };

    const handleEdit = (categoryId, categoryName) => {
        setEditingCategoryId(categoryId);
        setEditedCategoryName(categoryName);
    };

    return (
        <div>
            <h2>Categories</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        {editingCategoryId === category.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedCategoryName}
                                    onChange={(e) => setEditedCategoryName(e.target.value)}
                                />
                                <button onClick={handleUpdate}>Update</button>
                            </>
                        ) : (
                            <>
                                {category.name}
                                <button onClick={() => handleEdit(category.id, category.name)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(category.id)}>
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
