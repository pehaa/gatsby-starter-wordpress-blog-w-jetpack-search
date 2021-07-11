import { Link } from "gatsby"
import React from "react"
import { useES } from "./search/useES"

const SearchResults = ({ query, sort }) => {
  const { allResults, next, hasNext, total, correctedQuery } = useES({
    query: query.trim(),
    sort,
  })
  if (!allResults.length) return <p>Searching posts...</p>
  return (
    !!allResults.length && (
      <section>
        <h2>Found results {total}:</h2>
        <p>for {correctedQuery || query}</p>
        <ul>
          {allResults.map((el, index) => {
            // fix it!!!
            return (
              <li key={el.id}>
                <Link
                  to={el.uri}
                  dangerouslySetInnerHTML={{
                    __html: el.highlight.title[0] || el.title,
                  }}
                />
                <div
                  dangerouslySetInnerHTML={{
                    __html: el.highlight.content[0] || el.excerpt,
                  }}
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
