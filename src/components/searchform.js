import React, { useState } from "react"

const SearchForm = ({ initialQuery = "", setSearchTerm }) => {
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = e => {
    e.preventDefault()
    setSearchTerm(query)
  }

  return (
    <form role="search" onSubmit={handleSubmit}>
      <label htmlFor="search-input" style={{ display: "block" }}>
        Search me:
      </label>
      <input
        id="search-input"
        type="search"
        value={query}
        placeholder="e.g. template"
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}
export default SearchForm
