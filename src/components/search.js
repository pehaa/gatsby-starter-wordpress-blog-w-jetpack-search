import React, { useState } from "react"
import SearchForm from "./searchform"
import SearchResults from "./searchResults"

const Search = () => {
  const [data, setData] = useState({})
  const [currentPageHandle, setCurrentPageHandle] = useState("")
  return (
    <section>
      Hey!!
      <SearchForm setData={setData} currentPageHandle={currentPageHandle} />
      {data.query && (
        <SearchResults {...data} setCurrentPageHandle={setCurrentPageHandle} />
      )}
    </section>
  )
}

export default Search
