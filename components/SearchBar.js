import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SearchBar({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="row justify-content-center mb-3">
      <div className="col-md-8">
        <form onSubmit={handleSubmit}>
          <div className="search-container">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary search-btn">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}