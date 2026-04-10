import { useEffect, useState } from 'react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  return (
    <form className="search-form" onSubmit={event => event.preventDefault()}>
      <label className="sr-only" htmlFor="post-search">
        Search posts
      </label>
      <div className="search-container">
        <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M21 21L15.8 15.8M10.9 18a7.1 7.1 0 1 1 0-14.2 7.1 7.1 0 0 1 0 14.2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          id="post-search"
          type="text"
          className="search-input"
          placeholder="Search posts, topics..."
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
      </div>
    </form>
  );
}
