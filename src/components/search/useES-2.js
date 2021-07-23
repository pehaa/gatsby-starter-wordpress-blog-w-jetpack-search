import { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
const baseServiceUrl =
  "https://public-api.wordpress.com/rest/v1.3/sites/194959051/search?filter[bool][must][0][bool][must_not][0][term][post_type]=page&size=10&highlight_fields[0]=title&highlight_fields[1]=content"

export const useES = ({ query, sort }) => {
  const [allResults, setAllResults] = useState([])
  const [loading, setLoading] = useState(true)
  // Get all post nodes
  const {
    allWpPost: { nodes },
  } = useStaticQuery(graphql`
    query AllPostsQuery {
      allWpPost {
        nodes {
          title
          databaseId
          id
          uri
          excerpt
        }
      }
    }
  `)

  const [total, setTotal] = useState(0)
  const [correctedQuery, setCorrectedQuery] = useState(false)
  const [pageHandle, setPageHandle] = useState(null)
  const next = () => {
    if (pageHandle) {
      let queryString = `${baseServiceUrl}&query=${query.trim()}&sort=${sort}&page_handle=${pageHandle}`
      fetch(queryString)
        .then(r => r.json())
        .then(data => {
          console.log(data)
          const { total, page_handle, results } = data
          setPageHandle(page_handle)
          if (results.length) {
            setAllResults(s => {
              return [
                ...s,
                ...results.map(el => {
                  return {
                    ...nodes.find(
                      item => item.databaseId === el.fields.post_id
                    ),
                    highlight: el.highlight,
                  }
                }),
              ]
            })
          }
        })
    }
  }
  useEffect(() => {
    setAllResults([])
  }, [query, sort])
  useEffect(() => {
    let isCancelled = false
    const queryString = `${baseServiceUrl}&query=${query.trim()}&sort=${sort}`
    if (query.trim().length > 1) {
      setLoading(true)
      fetch(queryString)
        .then(
          r =>
            new Promise(resolve => {
              setTimeout(() => resolve(r), 3000)
            })
        )
        .then(r => r.json())
        .then(data => {
          if (isCancelled) {
            console.log("cancelled")
            return
          }
          console.log(data)
          const { page_handle, results } = data
          setTotal(data.total)
          setCorrectedQuery(data.corrected_query)
          setPageHandle(page_handle)
          setLoading(false)
          if (results.length) {
            setAllResults(
              results.map(el => {
                return {
                  ...nodes.find(item => item.databaseId === el.fields.post_id),
                  highlight: el.highlight,
                }
              })
            )
          }
        })
    }
    return () => {
      isCancelled = true
    }
  }, [query, sort, nodes])
  console.log(allResults)
  return {
    loading,
    allResults,
    next,
    hasNext: !!pageHandle,
    total,
    correctedQuery,
  }
}
