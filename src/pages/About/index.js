import React from 'react'
import styled from 'styled-components'
import { complement } from 'polished'
import { rhythm } from '../../utils/typography'
import { linkColor } from '../../utils/theme'
import profilePic from '../../components/Bio/profile-pic.jpg'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Pic = styled.img`
  border-radius: 50%;
  height: ${rhythm(12)};
  width: ${rhythm(12)};
`

const List = styled.ul`
  width: 50%;
  list-style: none;
  display: flex;
  justify-content: space-between;
`

const Link = styled.a`
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: ${linkColor};
  }
  &:active {
    color: ${complement(linkColor)};
  }
`

const Bio = () => (
  <Wrapper>
    <Container>
      <Pic src={profilePic} alt={`Jason Polhemus`} />
      <p>
        This site is a creation by <strong>Jason Polhemus</strong>, who
        currently lives and works in Atlanta as both a sound engineer/sound
        designer in theater, and an electrical engineer building 3-D printers.
        He has spent the past several years learning programming, (specifically
        functional), and hopes to transition shortly to programming full-time.
        He also hopes to move to Chicago soon.{' '}
      </p>
      <List>
        <li>
          <Link href="https://github.com/shatteredaesthetic">Github</Link>
        </li>
        <li>
          <Link mailto="jason.polhemus@shatteredaesthetic.com">Email</Link>
        </li>
        <li>
          <Link href="https://twitter.com/digitalsthtcs">Twitter</Link>
        </li>
      </List>
    </Container>
  </Wrapper>
)

export default Bio

export const pageQuery = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`
