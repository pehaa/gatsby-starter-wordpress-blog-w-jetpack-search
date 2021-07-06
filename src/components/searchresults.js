import React, { useEffect } from "react"
import { Link } from "gatsby"
import { useQuery, gql } from "@apollo/client"
const GET_RESULTS = gql`
  query($in: [ID]) {
    posts(where: { in: $in }) {
      edges {
        node {
          id
          slug
          title
          excerpt
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`

const SearchResults = ({
  query,
  ids,
  total,
  pageHandle,
  setCurrentPageHandle,
}) => {
  console.log(ids, query, total)
  const { data, loading, error, fetchMore } = useQuery(GET_RESULTS, {
    variables: { in: ids },
  })
  useEffect(() => {
    console.log("new ids", ids)
    if (ids.length > 10) {
      fetchMore({
        variables: {
          in: ids,
        },
      })
    }
  }, [ids])
  console.log("data", data, loading, error)
  if (loading) return <p>Searching posts...</p>
  if (error) return <p>Error - {error.message}</p>
  const loadMore = () => {
    setCurrentPageHandle(pageHandle)
  }
  console.log("data", data, loading, error)
  return (
    <section>
      <h2>Found {total} results:</h2>
      <ul>
        {data.posts.edges.map(el => {
          return (
            <li key={el.node.id}>
              {el.node.id} <Link to={el.node.slug}>{el.node.title}</Link>
            </li>
          )
        })}
      </ul>

      {pageHandle && (
        <button type="button" onClick={loadMore}>
          Load More
        </button>
      )}
    </section>
  )
}
export default SearchResults
