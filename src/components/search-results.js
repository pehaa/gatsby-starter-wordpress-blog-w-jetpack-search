import { Link } from "gatsby"
import React, { Fragment } from "react"
import parse from "html-react-parser"

const SearchResults = ({ searchResults, searchTerm, setParams }) => {
  const { data, error, loading } = searchResults
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
            {data.total !== undefined && (
              <p className="info results">
                Found {data.total} results for{" "}
                {data.corrected_query ? (
                  <>
                    <del>{searchTerm}</del> <span>{data.corrected_query}</span>
                  </>
                ) : (
                  <span>{searchTerm}</span>
                )}
              </p>
            )}
          </>
        )}
        {data.results?.length > 0 && (
          <ul>
            {data.results.map(el => {
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
        {data.page_handle && (
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              setParams({
                pageHandle: data.page_handle,
              })
            }
          >
            {loading ? "loading..." : "load more"}
          </button>
        )}
      </section>
    </>
  )
}

export default SearchResults
