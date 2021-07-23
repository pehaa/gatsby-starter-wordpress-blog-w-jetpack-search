import React from "react"

const SearchForm = ({ data, searchTerm, sort, setParams }) => {
  const handleRadioChange = e => {
    if (
      data.result.page_handle === false &&
      ((e.target.value === "score_default" && data.result.results[0]?._score) ||
        e.target.value !== "score_default")
    ) {
      setParams({
        type: "shuffle",
        payload: { sort: e.target.value },
      })
    } else {
      setParams({
        payload: { sort: e.target.value },
      })
    }
  }
  return (
    <form role="search" autoComplete="off" onSubmit={e => e.preventDefault()}>
      <label htmlFor="search-input" style={{ display: "block" }}>
        Search me:
      </label>
      <input
        id="search"
        type="search"
        value={searchTerm}
        onChange={e => setParams({ payload: { searchTerm: e.target.value } })}
        placeholder="Search..."
      />
      <div>
        <label>
          <input
            type="radio"
            value="score_default"
            checked={sort === "score_default"}
            onChange={handleRadioChange}
            name="sort"
          />{" "}
          SCORE
        </label>
        <label>
          <input
            type="radio"
            value="date_asc"
            checked={sort === "date_asc"}
            onChange={handleRadioChange}
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
            onChange={handleRadioChange}
          />{" "}
          OLDEST
        </label>
      </div>
    </form>
  )
}
export default SearchForm
