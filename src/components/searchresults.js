import { Link } from "gatsby"
import React from "react"
import { useES } from "./search/useES"

const SearchResults = ({ query, sort }) => {
  const { allResults, next, hasNext } = useES({ query: query.trim(), sort })
  if (!allResults.length) return <p>Searching posts...</p>
  return (
    !!allResults.length && (
      <section>
        <h2>Found results:</h2>
        <ul>
          {allResults.map((el, index) => {
            // fix it!!!
            return (
              <li key={el.id}>
                <Link
                  to={el.uri}
                  dangerouslySetInnerHTML={{ __html: el.title }}
                />
              </li>
            )
          })}
        </ul>
        {/*loading && <p>Searching posts...</p> */}
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
