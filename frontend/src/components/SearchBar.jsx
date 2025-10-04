import React from "react";

export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      className="form-control mb-3"
      placeholder="Search posts..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
