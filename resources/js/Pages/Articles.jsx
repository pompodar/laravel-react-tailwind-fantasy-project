// resources/js/Pages/Search.js
import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react'

const Search = (props) => {
    const { query, articles } = props;
    const [searchQuery, setSearchQuery] = useState(query);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query) {
            fetchSearchResults(query);
        } else {
            let params = (new URL(document.location)).searchParams;
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
            })
        }
    };

    const handleSearchInput = (e) => {
        const inputValue = e.target.value;
        setSearchQuery(inputValue);
        fetchSearchResults(inputValue);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setResults(articles);
    };

    return (
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
                            <h2>{result.title}</h2>
                            <p>{result.body}</p>
                            <div>
                                {result.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-500"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))
                ) : (
                    <p>No articles found</p>
                )}
            </div>
        </div>
    );
};

export default Search;
