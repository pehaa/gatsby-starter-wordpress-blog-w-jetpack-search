import React, { useState } from "react"
import SearchForm from "./search-form"
import SearchResults from "./search-results"
import "../css/search.css"
import { useJetpackSearch } from "./search/useES"

const Search = () => {
  const [visible, setVisible] = useState(false)
  const { params, setParams, searchResults } = useJetpackSearch()
  return (
    <>
      <button
        type="button"
        className="search-open-button"
        onClick={() => setVisible(true)}
      >
        Search{" "}
        <span role="img" aria-label="magnifying glass">
          🔎
        </span>
      </button>
      {visible && (
        <section className="search-container">
          <SearchForm data={searchResults} {...params} setParams={setParams} />
          <SearchResults
            {...params}
            searchResults={searchResults}
            setParams={setParams}
          />
          <button
            type="button"
            className="search-close-button"
            onClick={() => setVisible(false)}
          >
            Close
          </button>
        </section>
      )}
    </>
  )
}

export default Search
