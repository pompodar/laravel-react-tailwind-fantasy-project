// src/components/ArticleForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddArticle = () => {
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [title, setTitle] = useState('');

    const [tags, setTags] = useState([]);

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

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleTagsChange = (e) => {
        const tagInput = e.target.value;
        // Split the input into an array of tags
        const tagArray = tagInput.split(',').map(tag => tag.trim());
        setTags(tagArray);
    };

    const handleSelectChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(tags);

        try {
            await axios.post('/api/articles/create', { title: title, content: content, tags: tags, selectedCategory: selectedCategory });
            // Handle success (redirect, display a message, etc.)
        } catch (error) {
            // Handle error
            console.error('Error creating article:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Title:</label>
            <input
                type="text"
                name="title"
                value={title}
                onChange={handleTitleChange}
            />

            <label>Content:</label>
            <ReactQuill name="content" theme="snow" value={content} onChange={setContent} />

            <input
                type="text"
                name="tags"
                value={tags.join(', ')} // Display tags as a comma-separated string
                onChange={handleTagsChange}
            />

            <div>
                {categories.length > 0 ? (
                    <>
                        <label htmlFor="categorySelect">Select a category:</label>
                        <select
                            id="categorySelect"
                            value={selectedCategory}
                            onChange={handleSelectChange}
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </>
                ) : (
                    <p>No categories found</p>
                )}
            </div>

            <button type="submit">Add Article</button>
        </form>
    );
};

export default AddArticle;
