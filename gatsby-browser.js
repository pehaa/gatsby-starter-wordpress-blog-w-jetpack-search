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
import { relayStylePagination } from "@apollo/client/utilities"

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: {
          // Don't cache separate results based on
          // any of this field's arguments.
          //keyArgs: false,
          // Concatenate the incoming list items with
          // the existing list items.
          keyArgs: ["where"],
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
