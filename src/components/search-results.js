import { Link } from "gatsby"
import React, { Fragment } from "react"
import parse from "html-react-parser"

const SearchResults = ({ data, searchTerm, setParams }) => {
  const { result, error, loading } = data
  console.log(result)
  return (
    <>
      {!!result?.results?.length && (
        <section className="search-results">
          {loading && <p>Searching posts .....</p>}
          <h2>
            Found {result?.total} results for{" "}
            {result?.corrected_query ? (
              <>
                <del>{searchTerm}</del> <span>{result?.corrected_query}</span>
              </>
            ) : (
              <span>{searchTerm}</span>
            )}
          </h2>
          <ul>
            {result &&
              result.results.map(el => {
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
          {/*loading && <p>Searching posts...</p> */}
          {result?.page_handle && (
            <button
              type="button"
              onClick={() =>
                setParams({
                  type: "more",
                  payload: { pageHandle: result.page_handle },
                })
              }
            >
              load more
            </button>
          )}
        </section>
      )}
    </>
  )
}

export default SearchResults
