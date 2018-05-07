import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './profile-pic.jpg'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`Kyle Mathews`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        <p>
          Written by <strong>Jason Polhemus</strong> who lives and works in
          Atlanta building useful things and making beautiful sound, and hopes
          to relocate to Chicago soon.{' '}
          <a
            href="https://twitter.com/digitalsthtcs"
            style={{
              color: '#3a72b8',
            }}
          >
            tweets
          </a>
        </p>
      </div>
    )
  }
}

export default Bio
