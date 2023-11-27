// src/components/ArticleForm.js
import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddArticle = () => {
    const [content, setContent] = useState('');

    const [title, setTitle] = useState('');

    const [tags, setTags] = useState([]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleTagsChange = (e) => {
        const tagInput = e.target.value;
        // Split the input into an array of tags
        const tagArray = tagInput.split(',').map(tag => tag.trim());
        setTags(tagArray);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(tags);

        try {
            await axios.post('/api/articles/create', { title: title, content: content, tags: tags });
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

            <button type="submit">Add Article</button>
        </form>
    );
};

export default AddArticle;
