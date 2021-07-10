import React, { useState } from "react"
import SearchForm from "./searchform"
import SearchResults from "./searchResults"

const Search = () => {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("score_default")
  return (
    <section>
      <SearchForm setQuery={setQuery} setSort={setSort} />
      Hey!!
      {query && <SearchResults query={query} sort={sort} />}
    </section>
  )
}

export default Search
