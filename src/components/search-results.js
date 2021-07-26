import { Link } from "gatsby"
import React, { Fragment } from "react"
import parse from "html-react-parser"

const SearchResults = ({ searchResults, searchTerm, setParams }) => {
  const { result, error, loading } = searchResults
  if (error) {
    return <p>Error - {error.message}</p>
  }
  return (
    <>
      <section className="search-results">
        {loading ? (
          <p className="info">Searching posts .....</p>
        ) : (
          <>
            {result.total !== undefined && (
              <p className="info results">
                Found {result.total} results for{" "}
                {result.corrected_query ? (
                  <>
                    <del>{searchTerm}</del>{" "}
                    <span>{result?.corrected_query}</span>
                  </>
                ) : (
                  <span>{searchTerm}</span>
                )}
              </p>
            )}
          </>
        )}
        {result.results.length > 0 && (
          <ul>
            {result.results.map(el => {
              return (
                <li key={el.id}>
                  <Link to={el.uri}>
                    {el.highlight.title[0]
                      ? el.highlight.title.map((el, index) => {
                          return <Fragment key={index}>{parse(el)}</Fragment>
                        })
                      : parse(el.title)}
                  </Link>

                  <div className="post-excerpt">
                    {el.highlight.content[0]
                      ? el.highlight.content.map((el, index) => {
                          return <div key={index}>{parse(el)}</div>
                        })
                      : parse(el.excerpt)}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        {/*loading && <p>Searching posts...</p> */}
        {result.page_handle && (
          <button
            type="button"
            onClick={() =>
              setParams({
                pageHandle: result.page_handle,
              })
            }
          >
            load more
          </button>
        )}
      </section>
    </>
  )
}

export default SearchResults
