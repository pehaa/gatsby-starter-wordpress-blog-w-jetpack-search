import React from "react"
import { useES } from "./search/useES"

const SearchResults = ({ query, sort }) => {
  const { result, allResults, next, hasNext } = useES({ query, sort })
  const { data, loading, error } = result

  console.log("data", data)
  console.log("result", result)
  if (loading && !allResults.length) return <p>Searching posts...</p>
  if (error) return <p>Error - {error.message}</p>
  console.log(allResults)
  return (
    !!allResults.length && (
      <section>
        <h2>Found results:</h2>
        <ul>
          {allResults.map((el, index) => {
            // fix it!!!
            return (
              <li key={index}>
                {el.node.databaseId} {el.node.title}
              </li>
            )
          })}
        </ul>
        {loading && <p>Searching posts...</p>}
        {hasNext && (
          <button type="button" onClick={next}>
            Load More
          </button>
        )}
      </section>
    )
  )
}
export default SearchResults
