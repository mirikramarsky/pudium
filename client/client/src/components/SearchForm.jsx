import React, { useState } from 'react';
import api from '../services/api';

function SearchForm() {
  const [searchName, setSearchName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/searches', { searchname: searchName });
      alert('Search created successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to create search.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h2 className="mb-4">Create Search</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="searchName" className="form-label">Search Name</label>
            <input
              type="text"
              className="form-control"
              id="searchName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default SearchForm;
