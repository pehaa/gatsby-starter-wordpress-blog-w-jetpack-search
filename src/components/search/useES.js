import { useReducer } from "react"
import { useStaticQuery, graphql } from "gatsby"
import useConstant from "use-constant"
import AwesomeDebouncePromise from "awesome-debounce-promise"
import { useAsyncAbortable } from "react-async-hook"
import { result } from "lodash"

const baseServiceUrl =
  "https://public-api.wordpress.com/rest/v1.3/sites/194959051/search?filter[bool][must][0][bool][must_not][0][term][post_type]=page&size=3&highlight_fields[0]=title&highlight_fields[1]=content"

const searchFunction = async (
  { searchTerm, sort, pageHandle, dontRefetch },
  abortSignal
) => {
  if (dontRefetch) {
    return {
      shuffle: sort,
    }
  }
  const page_handle_query = pageHandle ? `&page_handle=${pageHandle}` : ""
  const url = `${baseServiceUrl}&query=${searchTerm}&sort=${sort}${page_handle_query}`

  const result = await fetch(url, {
    signal: abortSignal,
  })
  if (result.status !== 200) {
    throw new Error("bad status = " + result.status)
  }
  const json = await result.json()
  console.log("🐙🐙🐙🐙🐙returned json", searchTerm, json)
  return { ...json, fromMore: !!pageHandle }
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
  switch (action.type) {
    case "more":
      return {
        ...state,
        ...action.payload,
        dontRefetch: false,
      }
    case "shuffle":
      return {
        ...state,
        ...action.payload,
        dontRefetch: true,
      }
    default:
      return {
        ...state,
        ...action.payload,
        pageHandle: "",
        dontRefetch: false,
      }
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
      console.log("useAsync pageHandle", params.pageHandle)
      if (params.searchTerm.length < 2) {
        return []
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
        console.log("result", result)
        console.log("state", state)
        const oldResults = state.result?.results || []
        const newResults = result?.results || []
        if (result?.shuffle) {
          console.log(
            "heeere 💎",
            state.result.results
              .sort(() => sortFunction(result.shuffle))
              .map(el => el.fields["title.default"])
          )
          return {
            ...state,
            status: "success",
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
          result: result?.fromMore
            ? {
                ...result,
                results: [...oldResults, ...newResults],
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

export const useES = () => {
  const {
    allWpPost: { nodes },
  } = useStaticQuery(graphql`
    query AllPostsQuery1 {
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
  const { params, setParams, searchResults } = useDebouncedSearch(
    searchFunction
  )
  return {
    params,
    setParams,
    searchResults: {
      ...searchResults,
      result: {
        ...searchResults.result,
        results: searchResults.result?.results?.map(el => {
          return {
            ...nodes.find(item => item.databaseId === el.fields.post_id),
            highlight: el.highlight,
          }
        }),
      },
    },
  }
}

/*
function App() {
  const { params, setParams, searchResults } = useDebouncedSearch(
    esSearchFunction
  )

  const { searchTerm, sort, pageHandle } = params
  const handleRadioChange = e => {
    console.log(searchResults.result)
    if (
      searchResults.result.page_handle === false &&
      ((e.target.value === "score_default" &&
        searchResults.result.results[0]?._score) ||
        e.target.value !== "score_default")
    ) {
      setParams({
        type: "shuffle",
        payload: { sort: e.target.value },
      })
    } else {
      setParams({
        payload: { sort: e.target.value },
      })
    }
  }
  return (
    <section>
      <input
        value={searchTerm}
        onChange={e => setParams({ payload: { searchTerm: e.target.value } })}
      />
      <div>
        <label>
          <input
            type="radio"
            value="score_default"
            checked={sort === "score_default"}
            onChange={handleRadioChange}
            name="sort"
          />{" "}
          SCORE
        </label>
        <label>
          <input
            type="radio"
            value="date_asc"
            checked={sort === "date_asc"}
            onChange={handleRadioChange}
            name="sort"
          />{" "}
          NEWEST
        </label>
        <label>
          <input
            type="radio"
            value="date_desc"
            name="sort"
            checked={sort === "date_desc"}
            onChange={handleRadioChange}
          />{" "}
          OLDEST
        </label>
      </div>
      <p>
        Found {searchResults.result?.total} results for{" "}
        {searchResults.result?.corrected_query ? (
          <>
            <del>{searchTerm}</del>{" "}
            <span>{searchResults.result?.corrected_query}</span>
          </>
        ) : (
          <span>{searchTerm}</span>
        )}
      </p>
      {searchResults.loading && !pageHandle && <p>Loading</p>}
      {searchResults.result?.results?.map(el => (
        <p key={el.fields.post_id}>{el.fields["title.default"]}</p>
      ))}
      {searchResults.loading && !!pageHandle && <p>Loading</p>}
      {searchResults.result?.page_handle && (
        <button
          type="button"
          onClick={() =>
            setParams({
              type: "more",
              payload: { pageHandle: searchResults.result.page_handle },
            })
          }
        >
          load more
        </button>
      )}
    </section>
  )
}
*/
