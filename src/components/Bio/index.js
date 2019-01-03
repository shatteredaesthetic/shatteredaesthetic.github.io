import React from 'react'
import GatsbyLink from 'gatsby-link'
import styled from 'styled-components'
import { linkColor } from '../../utils/theme'

import profilePic from './profile-pic.jpg'
import { rhythm } from '../../utils/typography'

const Wrapper = styled.div`
  display: flex;
  align-items: space-between;
`

const Pic = styled.img`
  margin-right: ${rhythm(2)};
  margin-bottom: 0;
  width: ${rhythm(6)};
  height: ${rhythm(6)};
  border-radius: 50%;
`

const Link = styled(GatsbyLink)`
  color: ${linkColor};
`

export default () => (
  <Wrapper>
    <Pic src={profilePic} alt={`Jason Polhemus`} />
    <p>
      Written by <strong>Jason Polhemus</strong> who lives and works in Chicago
      building useful things and making beautiful sound.{' '}
      <Link to="https://twitter.com/digitalsthtcs">tweets</Link>
    </p>
  </Wrapper>
)
