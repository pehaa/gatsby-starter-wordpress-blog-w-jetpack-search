import React from "react"
import { Link } from "gatsby"
import { useQuery, gql } from "@apollo/client"
const GET_RESULTS = gql`
  query($in: [ID], $after: String) {
    posts($after: $after, where: { in: $in}) {
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

const SearchResults = ({ query, ids, total, pageHandle }) => {
  console.log(ids, query, total)
  const { data, loading, error, fetchMore } = useQuery(GET_RESULTS, {
    variables: { in: ids },
  })
  console.log("data", data, loading, error)
  if (loading) return <p>Searching posts...</p>
  if (error) return <p>Error - {error.message}</p>
  const loadMore = () => {
    if (pageHandle) {
      console.log("will fetch More", query)
      fetchMore({
        variables: {
          in: ids,
          after: pageHandle,
        },
      })
    }
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
