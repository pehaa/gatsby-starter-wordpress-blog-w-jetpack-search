import { useReducer, useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import useConstant from "use-constant"
import AwesomeDebouncePromise from "awesome-debounce-promise"

const baseServiceUrl =
  "https://public-api.wordpress.com/rest/v1.3/sites/194959051/search?filter[bool][must_not][term][post_type]=page&size=3&highlight_fields[0]=title&highlight_fields[1]=content"

const sortFunction = shuffle => {
  switch (shuffle) {
    case "date_asc":
      return function (a, b) {
        return a.fields.date > b.fields.date ? 1 : -1
      }

    case "date_desc":
      return function (a, b) {
        return a.fields.date < b.fields.date ? 1 : -1
      }

    default:
      return function (a, b) {
        return b._score - a._score
      }
  }
}

const paramsReducer = (state, action) => {
  return {
    ...state,
    ...action,
    pageHandle: action.pageHandle || "",
    dontRefetch: action.dontRefetch || false,
  }
}
// Generic reusable hook
const useDebouncedSearch = () => {
  const [state, setState] = useState({})
  const [params, setParams] = useReducer(paramsReducer, {
    searchTerm: "",
    sort: "score_default",
    pageHandle: "",
  })
  const searchFunction = async ({
    searchTerm,
    sort,
    pageHandle,
    dontRefetch,
  }) => {
    console.log("initiated")
    if (dontRefetch) {
      return {
        shuffle: sort,
      }
    }
    const url = new URL(baseServiceUrl)
    url.searchParams.set("query", searchTerm)
    url.searchParams.set("sort", sort)
    if (pageHandle) {
      url.searchParams.set("page_handle", pageHandle)
    }
    try {
      const result = await fetch(url)
      if (result.status !== 200) {
        throw new Error("bad status = " + result.status)
      }
      const json = await result.json()
      console.log("🐙🐙🐙🐙🐙returned json", searchTerm, json)
      return { ...json, isPaginatedResult: !!pageHandle }
    } catch (error) {
      console.log(error.message)
    }
  }
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 200)
  )

  useEffect(() => {
    setState(s => ({ ...s, loading: true }))
    const runAsyncSearch = async () => {
      if (!params.searchTerm) {
        return { results: [] }
      }
      if (params.pageHandle || params.dontRefetch) {
        return searchFunction(params)
      } else {
        return debouncedSearchFunction(params)
      }
    }
    runAsyncSearch()
      .then(result => {
        if (result.shuffle) {
          return setState(s => ({
            ...s,
            loading: false,
            error: undefined,
            data: {
              ...s.data,
              results: s.data.results.sort(sortFunction(result.shuffle)),
            },
          }))
        }
        setState(s => ({
          ...s,
          loading: false,
          data: result.isPaginatedResult
            ? {
                ...result,
                results: [...s.data?.results, ...result.results],
              }
            : result,
        }))
      })
      .catch(error => {
        setState(s => ({ ...s, error: error.message, loading: false }))
      })
  }, [debouncedSearchFunction, params])

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke

  // Return everything needed for the hook consumer
  return {
    params,
    setParams,
    ...state,
  }
}

export const useJetpackSearch = () => {
  const {
    allWpPost: { nodes },
  } = useStaticQuery(graphql`
    query AllPostsQuery {
      allWpPost {
        nodes {
          id
          databaseId
          uri
          title
          excerpt
        }
      }
    }
  `)
  const { params, setParams, loading, error, data } = useDebouncedSearch()
  console.log(loading, error, data)
  return {
    params,
    setParams,
    loading,
    error,
    data: {
      ...data,
      results: data?.results.map(el => {
        return {
          ...nodes.find(item => {
            return item.databaseId === el.fields.post_id
          }),
          highlight: el.highlight,
          _score: el._score,
        }
      }),
    },
  }
}
