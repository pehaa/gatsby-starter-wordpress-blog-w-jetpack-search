import { useEffect, useState } from "react"
import { gql, useLazyQuery } from "@apollo/client"
const GET_RESULTS = gql`
  query($in: [ID]) {
    posts(where: { in: $in }) {
      edges {
        node {
          databaseId
          id
          slug
          title
          excerpt
        }
      }
    }
  }
`
export const useES = ({ query, sort }) => {
  const [allResults, setAllResults] = useState([])
  const [pageHandle, setPageHandle] = useState(null)
  const [load, result] = useLazyQuery(GET_RESULTS)
  const next = () => {
    if (pageHandle) {
      const queryString = `https://public-api.wordpress.com/rest/v1.3/sites/194959051/search?query=${query}&sort=${sort}&size=3&page_handle=${pageHandle}`
      fetch(queryString)
        .then(r => r.json())
        .then(data => {
          console.log(data)
          const { total, page_handle, results } = data
          setPageHandle(page_handle)
          load({ variables: { in: results.map(el => el.fields.post_id) } })
        })
    }
  }
  useEffect(() => {
    setAllResults([])
    const queryString = `https://public-api.wordpress.com/rest/v1.3/sites/194959051/search?query=${query}&sort=${sort}&size=3`
    console.log(queryString)
    fetch(queryString)
      .then(r => r.json())
      .then(data => {
        console.log(data)
        const { total, page_handle, results } = data
        setPageHandle(page_handle)
        load({ variables: { in: results.map(el => el.fields.post_id) } })
      })
  }, [query, sort, load])
  useEffect(() => {
    console.log("useEffect", result.data)
    if (result.data) {
      setAllResults(s => [...s, ...result.data.posts.edges])
    }
  }, [result.data])
  return { result, allResults, next, hasNext: !!pageHandle }
}
