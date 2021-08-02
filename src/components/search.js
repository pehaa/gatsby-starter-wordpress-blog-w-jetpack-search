import React, { useState, useReducer } from "react"
import SearchForm from "./search-form"
import SearchResults from "./search-results"
import "../css/search.css"
import { useJetpackSearch } from "../search-hooks"

const paramsReducer = (state, action) => {
  return {
    ...state,
    ...action,
    pageHandle: action.pageHandle || "",
    // when sort changes but all results are already loaded
    dontRefetch: action.dontRefetch || false,
  }
}

const Search = () => {
  const [visible, setVisible] = useState(false)
  const [params, setParams] = useReducer(paramsReducer, {
    searchTerm: "",
    sort: "score_default",
    pageHandle: "",
  })
  const searchResults = useJetpackSearch(params)
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
            searchResults={searchResults}
            {...params}
            setParams={setParams}
          />
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
