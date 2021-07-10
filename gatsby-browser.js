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

const cache = new InMemoryCache()

const client = new ApolloClient({
  /* Set the endpoint for your GraphQL server */
  uri: "https://pehaa.xyz/five-boots/graphql",
  cache,
  fetch,
})

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)
