import React, { useState, useEffect } from "react"

const SearchForm = ({ setData, currentPageHandle }) => {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("score_default")
  useEffect(() => {
    if (query) {
      const pageHandleQuery = currentPageHandle
        ? `&page_handle=${currentPageHandle}`
        : ""
      const queryString = `https://public-api.wordpress.com/rest/v1.3/sites/194959051/search?query=${query}&sort=${sort}&size=10${pageHandleQuery}`
      console.log(queryString)
      fetch(queryString)
        .then(r => r.json())
        .then(data => {
          console.log(data)
          const { total, page_handle, results } = data

          setData(d => {
            const currentIds = d.ids || []
            return {
              query,
              total,
              ids: results.map(el => el.fields.post_id),
              pageHandle: page_handle,
            }
          })
        })
    }
  }, [query, currentPageHandle, sort, setData])
  const handleSubmit = e => {
    e.preventDefault()
    //e.target.elements.sort.value
    setQuery(e.target.elements["search-input"].value)
    setSort(e.target.elements.sort.value)
  }

  return (
    <form role="search" onSubmit={handleSubmit}>
      <div>
        <label>
          <input
            type="radio"
            value="score_default"
            defaultChecked
            name="sort"
          />{" "}
          SCORE
        </label>
        <label>
          <input type="radio" value="date_asc" name="sort" /> NEWEST
        </label>
        <label>
          <input type="radio" value="date_desc" name="sort" /> OLDEST
        </label>
      </div>
      <label htmlFor="search-input" style={{ display: "block" }}>
        Search me:
      </label>
      <input id="search-input" type="search" placeholder="e.g. template" />
      <button type="submit">Search</button>
    </form>
  )
}
export default SearchForm
