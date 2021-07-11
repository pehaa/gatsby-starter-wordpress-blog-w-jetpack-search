import { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
const baseServiceUrl =
  "https://public-api.wordpress.com/rest/v1.3/sites/194959051/search?filter[bool][must][0][bool][must_not][0][term][post_type]=page&size=10&highlight_fields[0]=title&highlight_fields[1]=content"

export const useES = ({ query, sort }) => {
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
  const [allResults, setAllResults] = useState([])
  const [total, setTotal] = useState(0)
  const [correctedQuery, setCorrectedQuery] = useState(false)
  const [pageHandle, setPageHandle] = useState(null)
  const next = () => {
    if (pageHandle) {
      const queryString = `${baseServiceUrl}&query=${query.trim()}&sort=${sort}&page_handle=${pageHandle}`
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
    const queryString = `${baseServiceUrl}&query=${query.trim()}&sort=${sort}`
    if (query.length > 1) {
      fetch(queryString)
        .then(r => r.json())
        .then(data => {
          console.log(data)
          const { page_handle, results } = data
          setTotal(data.total)
          setCorrectedQuery(data.corrected_query)
          setPageHandle(page_handle)
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
  }, [query, sort, nodes])
  console.log(allResults)
  return {
    allResults,
    next,
    hasNext: !!pageHandle,
    total,
    correctedQuery,
  }
}
