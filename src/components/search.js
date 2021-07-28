import React, { useState } from "react"
import SearchForm from "./search-form"
import SearchResults from "./search-results"
import "../css/search.css"
import { useJetpackSearch } from "./search/useES"

const Search = () => {
  const [visible, setVisible] = useState(false)
  const { params, setParams, loading, error, data } = useJetpackSearch()
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
          <SearchForm
            loading={loading}
            error={error}
            data={data}
            {...params}
            setParams={setParams}
          />
          <SearchResults
            {...params}
            loading={loading}
            error={error}
            data={data}
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
