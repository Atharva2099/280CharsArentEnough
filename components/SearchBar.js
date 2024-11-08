import { useState } from 'react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="row justify-content-center mb-4">
      <div className="col-md-8">
        <form onSubmit={handleSubmit}>
          <div className="search-container">
            <input
              type="text"
              className="search-input form-control"
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}