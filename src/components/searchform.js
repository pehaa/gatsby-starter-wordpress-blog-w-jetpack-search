import React from "react"

const SearchForm = ({ query, sort, setQuery, setSort }) => {
  return (
    <form role="search" autoComplete="off" onSubmit={e => e.preventDefault()}>
      <div>
        <label>
          <input
            type="radio"
            value="score_default"
            checked={sort === "score_default"}
            onChange={e => {
              setSort(e.target.value)
            }}
            name="sort"
          />{" "}
          SCORE
        </label>
        <label>
          <input
            type="radio"
            value="date_asc"
            checked={sort === "date_asc"}
            onChange={e => {
              setSort(e.target.value)
            }}
            name="sort"
          />{" "}
          NEWEST
        </label>
        <label>
          <input
            type="radio"
            value="date_desc"
            name="sort"
            checked={sort === "date_desc"}
            onChange={e => {
              setSort(e.target.value)
            }}
          />{" "}
          OLDEST
        </label>
      </div>
      <label htmlFor="search-input" style={{ display: "block" }}>
        Search me:
      </label>
      <input
        id="search"
        type="search"
        placeholder="e.g. template"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}
export default SearchForm
