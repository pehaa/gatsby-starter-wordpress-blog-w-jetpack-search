import React from "react"

const SearchForm = ({ setQuery, setSort }) => {
  const handleSubmit = e => {
    e.preventDefault()
    setQuery(e.target.elements.search.value)
    setSort(e.target.elements.sort.value)
    //e.target.elements.sort.value
  }

  return (
    <form role="search" onSubmit={handleSubmit}>
      <div>
        <label>
          <input
            type="radio"
            value="score_default"
            defaultChecked
            name="sort"
          />{" "}
          SCORE
        </label>
        <label>
          <input type="radio" value="date_asc" name="sort" /> NEWEST
        </label>
        <label>
          <input type="radio" value="date_desc" name="sort" /> OLDEST
        </label>
      </div>
      <label htmlFor="search-input" style={{ display: "block" }}>
        Search me:
      </label>
      <input id="search" type="search" placeholder="e.g. template" />
      <button type="submit">Search</button>
    </form>
  )
}
export default SearchForm
