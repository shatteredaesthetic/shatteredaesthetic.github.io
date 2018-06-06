import React from 'react'
import GatsbyLink from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import { complement } from 'polished'
import { linkColor } from '../../utils/theme'

const Post = styled.li`
  display: flex;
`

const Link = styled(GatsbyLink)`
  text-decoration: none;
`

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 120rem;
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
  ul {
    margin: 3.2rem 0 3.2rem 0;
    list-style: none;
    padding: 0;
    li {
      font-size: 1.6rem;
      @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
        font-size: 1.4rem;
        margin: 1.6rem 0 1.6rem 0;
      }
      span {
        display: inline-block;
        text-align: right;
        width: 20rem;
        margin-right: 3rem;
        @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
          display: block;
          text-align: left;
        }
      }
      a {
        text-transform: uppercase;
        &:hover {
          color: ${complement(linkColor)};
        }
        &:active {
          color: ${linkColor};
        }
      }
    }
  }
  p {
    width: 80%;
    align-item: flex-end;
    font-size: 0.7em;
  }
`

const BlogIndex = props => {
  const siteTitle = get(props, 'data.site.siteMetadata.blogTitle')
  const posts = get(props, 'data.allMarkdownRemark.edges')

  return (
    <Wrapper>
      <Helmet title={siteTitle} />
      <h1>{siteTitle}</h1>
      <ul>
        {posts.map(({ node }, i) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug
          return (
            <Post key={node.fields.slug}>
              <span>{node.frontmatter.date}</span>
              <Link to={node.frontmatter.path}>{title}</Link>
            </Post>
          )
        })}
      </ul>
    </Wrapper>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query BlogQuery {
    site {
      siteMetadata {
        blogTitle
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            path
            title
          }
        }
      }
    }
  }
`

// {i < 3 ? (
//   <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
// ) : (
//   ''
// )}
