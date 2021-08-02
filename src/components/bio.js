/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Bio = () => {
  return (
    <div className="new-bio">
      <p>
        This is{" "}
        <a href="https://github.com/pehaa/pehaa-gatsby-starter-wordpress-blog-w-jetpack-search">
          a fork
        </a>{" "}
        of the{" "}
        <a href="https://github.com/gatsbyjs/gatsby-starter-wordpress-blog">
          gatsby-starter-wordpress-blog.
        </a>{" "}
        It comes with support for <strong>search functionality</strong>{" "}
        <span role="img" aria-lable="magnifying glass">
          🔎
        </span>
        . Search results are provided by <a>Jetpack Search.</a>
      </p>
    </div>
  )
}

export default Bio
