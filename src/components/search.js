import React, { useState } from "react"
import SearchForm from "./searchform"
import SearchResults from "./search-results"
import "../css/search.css"
import { useES } from "./search/useES"

const Search = () => {
  const { params, setParams, searchResults } = useES()
  const [visible, setVisible] = useState(false)
  return (
    <>
      <button
        type="button"
        className="open-search-button"
        onClick={() => setVisible(true)}
      >
        Search{" "}
        <span role="img" aria-label="magnifying glass">
          🔎
        </span>
      </button>
      {visible && (
        <section className="search-wrapper">
          <SearchForm data={searchResults} {...params} setParams={setParams} />
          {
            <SearchResults
              {...params}
              data={searchResults}
              setParams={setParams}
            />
          }
          <button
            type="button"
            className="close-button"
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
