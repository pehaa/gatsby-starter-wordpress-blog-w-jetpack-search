import React from "react"
import { Link } from "gatsby"
import { useQuery, gql } from "@apollo/client"
const GET_RESULTS = gql`
  query($search: String, $after: String) {
    posts(first: 10, after: $after, where: { search: $search }) {
      edges {
        node {
          id
          slug
          title
          excerpt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
`

const SearchResults = ({ query }) => {
  const { data, loading, error, fetchMore } = useQuery(GET_RESULTS, {
    variables: { search: query, after: "" },
  })
  console.log("data", data, loading, error)
  if (loading) return <p>Searching posts...</p>
  if (error) return <p>Error - {error.message}</p>
  const loadMore = () => {
    if (data.posts.pageInfo.hasNextPage) {
      console.log("will fetch More", data.posts.pageInfo.endCursor, query)
      fetchMore({
        variables: {
          after: data.posts.pageInfo.endCursor,
        },
      })
    }
  }
  console.log("data", data, loading, error)
  return (
    <section>
      <h2>Found {data.posts.edges.length} results:</h2>
      <ul>
        {data.posts.edges.map(el => {
          return (
            <li key={el.node.id}>
              {el.node.id} <Link to={el.node.slug}>{el.node.title}</Link>
            </li>
          )
        })}
      </ul>

      {data.posts.pageInfo.hasNextPage && (
        <button type="button" onClick={loadMore}>
          Load More {data.posts.pageInfo.endCursor}
        </button>
      )}
    </section>
  )
}
export default SearchResults
