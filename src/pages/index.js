import React from 'react'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import { Image } from 'rebass'

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-width: 120rem;
  padding-left: 2rem;
  padding-right: 2rem;
`

const Home = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }
  h2 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 2rem;
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      font-size: 2rem;
    }
  }
  ul {
    list-style: none;
    margin: 3rem 0 1rem 0;
    padding: 0;
    li {
      display: inline;
      position: relative;
      a {
        text-transform: uppercase;
        margin-left: 1rem;
        margin-right: 1rem;
        font-size: 1.6rem;
        @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
          font-size: 1.4rem;
        }
      }
    }
  }
`

export default class HomePage extends React.Component {
  render() {
    const { title, description, author } = get(
      this.props,
      'data.site.siteMetadata'
    )

    return (
      <Wrapper>
        <Helmet title={title} />
        <Home>
          <Image src="https://media.giphy.com/media/IBGk6rXvzVb0c/giphy.gif" />
          <h1>{title}</h1>
          <h2>site by {author}</h2>
          <hr />
          <span>{description}</span>
        </Home>
      </Wrapper>
    )
  }
}

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`
