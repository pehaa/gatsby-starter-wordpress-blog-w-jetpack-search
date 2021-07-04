import React, { useState } from "react"
import SearchForm from "./searchform"
import SearchResults from "./searchResults"

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("")
  return (
    <section>
      Hey!!
      <SearchForm setSearchTerm={setSearchTerm} />
      {searchTerm && <SearchResults query={searchTerm} />}
    </section>
  )
}

export default Search
