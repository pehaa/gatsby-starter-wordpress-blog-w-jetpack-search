// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"

// normalize CSS across browsers
import "./src/css/normalize.css"

// custom CSS styles
import "./src/css/style.css"
import fetch from "isomorphic-fetch"
import React from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
//import { relayStylePagination } from "@apollo/client/utilities"

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: {
          read(existing, options) {
            // A read function should always return undefined if existing is
            // undefined. Returning undefined signals that the field is
            // missing from the cache, which instructs Apollo Client to
            // fetch its value from your GraphQL server.
            console.log(options)
            console.log("existing", existing)
            //

            return existing
          },
          keyArgs: false,
          // Concatenate the incoming list items with
          // the existing list items.
          merge(existing = { edges: [] }, incoming) {
            console.log(existing)
            console.log(incoming)
            console.log({
              __typename: "RootQueryToPostConnection",
              edges: [...existing.edges, ...incoming.edges],
            })
            return {
              __typename: "RootQueryToPostConnection",
              edges: [...existing.edges, ...incoming.edges],
            }
          },
        },
      },
    },
  },
})

const client = new ApolloClient({
  /* Set the endpoint for your GraphQL server */
  uri: "http://wp-w-graphql.test/graphql",
  cache,
  fetch,
})

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)
