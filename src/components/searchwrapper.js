import React from "react"
import Search from "./search"

const SearchWrapper = ({ children }) => {
  return (
    <div>
      <Search />
      {children}
    </div>
  )
}

export default SearchWrapper
