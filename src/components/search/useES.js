import { useEffect, useReducer, useRef } from "react"
import { useStaticQuery, graphql } from "gatsby"
import AwesomeDebouncePromise from "awesome-debounce-promise"
import { searchFunction, sortFunction } from "./utils"

const serviceUrl =
  "https://public-api.wordpress.com/rest/v1.3/sites/194959051/search?filter[bool][must][0][term][post_type]=post&size=3&highlight_fields[0]=title&highlight_fields[1]=content"

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        loading: true,
      }
    case "FETCH_SUCCESS_SIMPLE":
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload,
      }
    case "FETCH_SUCCESS_MORE":
      return {
        ...state,
        loading: false,
        error: null,
        data: {
          ...action.payload,
          results: [...state.data?.results, ...action.payload.results],
        },
      }
    case "SHUFFLE":
      return {
        ...state,
        loading: false,
        error: null,
        data: {
          ...state.data,
          results: state.data.results.sort(sortFunction(action.payload)),
        },
      }
    case "ERROR":
      return {
        data: {},
        loading: false,
        error: action.payload,
      }
    default:
      throw new Error("unsupporter action type")
  }
}

// Generic reusable hook
const useDebouncedSearch = params => {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: null,
    data: {},
  })
  const cached = useRef(AwesomeDebouncePromise(searchFunction, 200))

  useEffect(() => {
    dispatch({ type: "FETCH_INIT" })
    const runAsyncSearch = async () => {
      if (!params.searchTerm) {
        return { results: [] }
      }
      if (params.pageHandle || params.dontRefetch) {
        return searchFunction(serviceUrl, params)
      } else {
        return cached.current(serviceUrl, params)
      }
    }
    runAsyncSearch()
      .then(result => {
        if (result.shuffle) {
          return dispatch({ type: "SHUFFLE", payload: result.shuffle })
        }
        if (result.isPaginatedResult) {
          return dispatch({
            type: "FETCH_SUCCESS_MORE",
            payload: result,
          })
        }
        return dispatch({
          type: "FETCH_SUCCESS_SIMPLE",
          payload: result,
        })
      })
      .catch(error => {
        return dispatch({ type: "ERROR", payload: error.message })
      })
  }, [params])

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke

  // Return everything needed for the hook consumer
  return state
}

export const useJetpackSearch = params => {
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
  const { loading, error, data } = useDebouncedSearch(params)
  console.log(loading, error, data)
  return {
    loading,
    error,
    data: {
      ...data,
      results: data.results?.map(el => {
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
