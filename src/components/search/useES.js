import { useReducer } from "react"
import { useStaticQuery, graphql } from "gatsby"
import useConstant from "use-constant"
import AwesomeDebouncePromise from "awesome-debounce-promise"
import { useAsyncAbortable } from "react-async-hook"

const baseServiceUrl =
  "https://public-api.wordpress.com/rest/v1.3/sites/194959051/search?filter[bool][must_not][term][post_type]=page&size=3&highlight_fields[0]=title&highlight_fields[1]=content"

const searchFunction = async (
  { searchTerm, sort, pageHandle, dontRefetch },
  abortSignal
) => {
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

  const result = await fetch(url, {
    signal: abortSignal,
  })
  if (result.status !== 200) {
    throw new Error("bad status = " + result.status)
  }
  const json = await result.json()
  console.log("🐙🐙🐙🐙🐙returned json", searchTerm, json)
  return { ...json, isPaginatedResult: !!pageHandle }
}

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

const reducer = (state, action) => {
  return {
    ...state,
    ...action,
    pageHandle: action.pageHandle || "",
    dontRefetch: action.dontRefetch || false,
  }
}
// Generic reusable hook
const useDebouncedSearch = searchFunction => {
  const [params, setParams] = useReducer(reducer, {
    searchTerm: "",
    sort: "score_default",
    pageHandle: "",
  })

  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 200)
  )

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResults = useAsyncAbortable(
    async abortSignal => {
      if (!params.searchTerm) {
        return { results: [] }
      }
      if (params.pageHandle) {
        return searchFunction(params, abortSignal)
      } else {
        return debouncedSearchFunction(params, abortSignal)
      }
    },
    [debouncedSearchFunction, params],
    {
      setLoading: state => ({ ...state, loading: true }),
      setResult: (result, state) => {
        if (result?.shuffle) {
          return {
            ...state,
            loading: false,
            error: undefined,
            result: {
              ...state.result,
              results: state.result.results.sort(sortFunction(result.shuffle)),
            },
          }
        }
        return {
          ...state,
          status: "success",
          loading: false,
          error: undefined,
          result: result?.isPaginatedResult
            ? {
                ...result,
                results: [...state.result?.results, ...result?.results],
              }
            : result,
        }
      },
    }
  )

  // Return everything needed for the hook consumer
  return {
    params,
    setParams,
    searchResults,
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
  const { params, setParams, searchResults } = useDebouncedSearch(
    searchFunction
  )
  console.log(searchResults)
  return {
    params,
    setParams,
    searchResults: {
      ...searchResults,
      result: {
        ...searchResults.result,
        results: searchResults.result?.results.map(el => {
          return {
            ...nodes.find(item => {
              return item.databaseId === el.fields.post_id
            }),
            highlight: el.highlight,
            _score: el._score,
          }
        }),
      },
    },
  }
}
