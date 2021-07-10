import { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
const baseServiceUrl =
  "https://public-api.wordpress.com/rest/v1.3/sites/194959051/search?filter[bool][must][0][bool][must_not][0][term][post_type]=page"
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
          slug
        }
      }
    }
  `)
  const [allResults, setAllResults] = useState([])
  const [pageHandle, setPageHandle] = useState(null)
  const next = () => {
    if (pageHandle) {
      const queryString = `${baseServiceUrl}&query=${query}&sort=${sort}&size=3&page_handle=${pageHandle}`
      fetch(queryString)
        .then(r => r.json())
        .then(data => {
          console.log(data)
          const { total, page_handle, results } = data
          setPageHandle(page_handle)
          const ids = results.map(el => el.fields.post_id)
          if (ids.length) {
            setAllResults(s => {
              return [
                ...s,
                ...ids.map(el => {
                  return nodes.find(item => item.databaseId === el)
                }),
              ]
            })
          }
        })
    }
  }
  useEffect(() => {
    const queryString = `${baseServiceUrl}&query=${query}&sort=${sort}&size=3`
    console.log(queryString)
    fetch(queryString)
      .then(r => r.json())
      .then(data => {
        console.log(data)
        const { total, page_handle, results } = data
        setPageHandle(page_handle)
        const ids = results.map(el => el.fields.post_id)
        if (ids.length) {
          setAllResults(
            ids.map(el => {
              return nodes.find(item => item.databaseId === el)
            })
          )
        }
      })
  }, [query, sort, nodes])
  return { allResults, next, hasNext: !!pageHandle }
}
