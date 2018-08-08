import React from 'react'
import GatsbyLink from 'gatsby-link'
import styled from 'styled-components'
import get from 'lodash/get'
import { complement } from 'polished'
import { Toolbar, NavLink } from 'rebass'
import { linkColor } from '../../utils/theme'

const Container = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 120rem;
  width: 100%;
  padding-top: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;
`

const Wrapper = styled.nav`
  display: flex;
  height: 5rem;
  width: 100%;
  a {
    display: inline;
    font-size: 2.2rem;
    text-transform: uppercase;
    line-height: 6rem;
    letter-spacing: 0.1rem;
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      font-size: 1.4rem;
    }
  }
  ul {
    list-style: none;
    display: flex;
    margin-bottom: 0;
    margin-top: 0;
    li {
      float: left;
      margin: 0;
      position: relative;
      a {
        margin-left: 1rem;
        margin-right: 1rem;
      }
    }
  }
`

const Link = styled(GatsbyLink)`
  text-decoration: none;
  &:hover {
    color: ${linkColor};
  }
  &:active {
    color: ${complement(linkColor)};
  }
`

export default () => (
  <Wrapper>
    <Container>
      <Link to="/">(shatteredaesthetic)</Link>
      <ul>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <Link to="/shows">Shows</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </Container>
  </Wrapper>
)

// <Toolbar bg={'white'} color={'black'}>
//             <NavLink>(shttrdsthtc)</NavLink>
//             <NavLink ml="auto">Blog</NavLink>
//             <NavLink>About</NavLink>
//           </Toolbar>
