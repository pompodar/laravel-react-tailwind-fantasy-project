import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Articles = ({ auth, props, query, articles }) => {
    // const { query, articles } = props;
    const [searchQuery, setSearchQuery] = useState(query);
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]);

    const [editingArticle, setEditingArticle] = useState(null);
    const [updatedArticle, setUpdatedArticle] = useState({
        title: '',
        body: '',
        tags: [],
        category_ids: [],
    });

    useEffect(() => {
        fetchCategories(); // Fetch categories when the component mounts
    }, []);

    useEffect(() => {
        if (query) {
            fetchSearchResults(query);
        } else {
            let params = new URLSearchParams(document.location.search);
            let q = params.get("q");

            if (q) {
                setSearchQuery(q);
            }
            const hitsArray = [];

            for (const key in articles) {
                hitsArray.push(articles[key]);
            }

            setResults(() => hitsArray);
        }
    }, [query, articles]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSearchResults = (query) => {
        if (query) {
            router.visit(("/articles"), {
                method: 'get',
                data: { q: query },
                preserveState: true,
                onCancel: () => { },
                onSuccess: page => {
                    setSearchQuery(query);
                },
                onError: errors => {
                    console.log(errors);
                },
            });
        }
    };

    const handleDelete = async (articleId) => {
        const shouldDelete = window.confirm('Are you sure you want to delete this category?');

        if (!shouldDelete) {
            return; // If the user cancels, do nothing
        }

        try {
            // Send a DELETE request to delete the article
            await axios.delete(`/api/articles/${articleId}`);
            // After deletion, fetch the updated list of articles
            fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedArticle((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTagsChange = (tags) => {
        setUpdatedArticle((prev) => ({
            ...prev,
            tags,
        }));
    };

    const handleCategoriesChange = (selectedCategoryIds) => {
        setUpdatedArticle((prev) => ({
            ...prev,
            category_ids: selectedCategoryIds,
        }));
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        setUpdatedArticle({
            title: article.title,
            body: article.body,
            tags: article.tags || [],
            category_ids: article.category_ids || [],
        });
    };

    const fetchArticles = async () => {
        try {
            const response = await axios.get('/api/articles');
            setResults(response.data.articles);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const handleSearchInput = (e) => {
        const inputValue = e.target.value;
        setSearchQuery(inputValue);
        fetchSearchResults(inputValue);
    };

    const clearFilters = () => {
        setSearchQuery('');
        fetchArticles();
    };

    const handleChange = (content, delta, source, editor) => {
        setUpdatedArticle((prev) => ({
            ...prev,
            body: content,
        }));
    };

    const handleUpdate = async (articleId) => {
        try {
            // Send a PUT request to update the article
            await axios.put(`/api/articles/${articleId}`, updatedArticle);
            // After updating, fetch the updated list of articles
            fetchArticles();
            // Reset editing state
            setEditingArticle(null);
            setUpdatedArticle({
                title: '',
                body: '',
                tags: [],
                category_ids: [],
            });
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
        >

            <div>
                <input
                    type="text"
                    name="q"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchInput}
                />
                {searchQuery && (
                    <p>
                        Using search: <strong>"{searchQuery}"</strong>.{' '}
                        <a onClick={clearFilters}>Clear filters</a>
                    </p>
                )}

                <div>
                    {results.length > 0 ? (
                        results.map((result) => (
                            <article key={result.id}>
                                {editingArticle === result ? (
                                    <>
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Title"
                                            value={updatedArticle.title}
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                        <ReactQuill
                                            name="content"
                                            theme="snow"
                                            value={updatedArticle.body}
                                            onChange={handleChange}
                                        />

                                        <div>
                                            {/* Tags input */}
                                        </div>
                                        <div>
                                            {/* Categories input */}
                                        </div>
                                        <button onClick={() => handleUpdate(result.id)}>
                                            Update
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h2>{result.title}</h2>
                                        <div dangerouslySetInnerHTML={{ __html: result.body }} />
                                        <div>
                                            {result.tags && result.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-500"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <ul>
                                            {result.categories && result.categories.map((category) => {
                                                return <li key={category.id}>{category.name}</li>;
                                            })}
                                        </ul>
                                        <button onClick={() => handleEdit(result)}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(result.id)}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </article>
                        ))
                    ) : (
                        <p>No articles found</p>
                    )}
                </div>
            </div>

                
        </AuthenticatedLayout>
    );
};

export default Articles;
