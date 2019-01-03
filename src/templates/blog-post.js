import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Bio from '../components/Bio'
import styled from 'styled-components'
import { fgColor } from '../utils/theme'

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  max-width: 120rem;
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
`

const Article = styled.article`
  header {
    margin-top: 3.2rem;
    margin-bottom: 3.2rem;
    h1,
    h2 {
      margin: 0;
    }
    h2 {
      margin-top: 1rem;
      font-size: 1.8rem;
      color: ${fgColor};
      @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
        font-size: 1.6rem;
      }
    }
  }
`

const List = styled.ul`
  display: flex;
  flexwrap: wrap;
  justifycontent: space-between;
  liststyle: none;
  padding: 0;
`

const Content = styled.div`
  font-family: Helvetica, sans-serif;
  code {
    font-size: 1.2rem;
  }
`

const SingleNav = ({ next, previous }) => (
  <List>
    {previous && (
      <li>
        <Link to={previous.frontmatter.path} rel="prev">
          ← {previous.frontmatter.title}
        </Link>
      </li>
    )}
    {next && (
      <li>
        <Link to={next.frontmatter.path} rel="next">
          {next.frontmatter.title} →
        </Link>
      </li>
    )}
  </List>
)

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.blogTitle')
    const { previous, next } = this.props.pathContext

    return (
      <Wrapper>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <Article>
          <header>
            <h1>{post.frontmatter.title}</h1>
            <h2>{post.frontmatter.date}</h2>
          </header>
          <Content dangerouslySetInnerHTML={{ __html: post.html }} />
          <SingleNav next={next} previous={previous} />
          <hr />
          <Bio />
        </Article>
      </Wrapper>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        path
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
