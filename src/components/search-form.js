import React from "react"

const SearchForm = ({ searchResults, searchTerm, sort, setParams }) => {
  const { data } = searchResults
  const sortChoices = [
    { key: "score_default", label: "Relevance" },
    { key: "date_asc", label: "Newest" },
    { key: "date_desc", label: "Oldest" },
  ]
  const handleRadioChange = e => {
    if (
      data.page_handle === false &&
      ((e.target.value === "score_default" && data.results[0]?._score) ||
        e.target.value !== "score_default")
    ) {
      setParams({
        dontRefetch: true,
        sort: e.target.value,
      })
    } else {
      setParams({
        sort: e.target.value,
      })
    }
  }
  return (
    <>
      <label htmlFor="search-input" style={{ display: "block" }}>
        Search me:
      </label>
      <input
        id="search"
        type="search"
        value={searchTerm}
        onChange={e => setParams({ searchTerm: e.target.value })}
        placeholder="Search..."
        autoComplete="off"
        autoCapitalize="none"
      />
      <div>
        {sortChoices.map(({ key, label }) => {
          return (
            <label key={key}>
              <input
                type="radio"
                value={key}
                checked={sort === key}
                onChange={handleRadioChange}
                name="sort"
              />{" "}
              {label}
            </label>
          )
        })}
      </div>
    </>
  )
}
export default SearchForm
