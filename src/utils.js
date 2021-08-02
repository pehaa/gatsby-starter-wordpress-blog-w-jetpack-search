export const sortFunction = shuffle => {
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

export const searchFunction = async (
  serviceUrl,
  { searchTerm, sort, pageHandle, dontRefetch }
) => {
  if (dontRefetch) {
    return {
      shuffle: sort,
    }
  }
  const url = new URL(serviceUrl)
  url.searchParams.set("query", searchTerm)
  url.searchParams.set("sort", sort)
  if (pageHandle) {
    url.searchParams.set("page_handle", pageHandle)
  }

  const result = await fetch(url)
  if (result.status !== 200) {
    throw new Error("bad status = " + result.status)
  }
  const json = await result.json()
  console.log("🐙🐙🐙🐙🐙returned json", searchTerm, json)
  return { ...json, isPaginatedResult: !!pageHandle }
}
