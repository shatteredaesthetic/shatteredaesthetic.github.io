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
  font-family: Helvetica, sans-serif;
`

const Pic = styled.img`
  border-radius: 50%;
  height: ${rhythm(21)};
  width: ${rhythm(21)};
  margin-top: 5rem;
  margin-bottom: 5rem;
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
        This site is a creation by me, <strong>Jason Polhemus</strong>. (That's
        me up there, all bearded and upside-down. Adorable.) I previously lived
        in Atlanta, where I held down two jobs (one I currently hold), the first
        of which is both <strong>sound engineer</strong> and{' '}
        <strong>sound designer</strong> for theaters around town. The second job
        was <strong>electrical engineer</strong> at a company building 3-D
        printers and accessories.{' '}
      </p>
      <p>
        {' '}
        At first they may seem pretty different, but they both involve
        constructing systems that allow information to pass through, processing
        that information in some way, and achieving an aesthetic output. For the
        printing, I, as the engineer, have to worry about every phase of the
        print, making sure that the settings are holding, and that the print is
        otherwise succeeding. And there's a tangible output: the printed part.
      </p>
      <p>
        {' '}
        For the sound engineering, the output happens simultaneously with the
        creation at every phase of the production, and the output is a little
        more intangible (enjoyment? excitement? thoughtfulness?). Both then
        break down into a series of smaller systems that direct the flow of
        information (frequency, or motor controls) from an input (microphone, or
        console buttons), through a processing step, to an output. At a higher
        level, the processing step breaks down into smaller tasks affecting the
        flow of information according to a design.
      </p>
      <p>
        {' '}
        I've spent the past several years learning and practicing programming,
        specifically the functional paradigm, and I began to see the same
        pattern in the idea of small functions that compose to make more complex
        behavior, etc. Here we seem to take an input (user info, a file, etc),
        process it, and output it (another file, the screen, etc.). Seems very
        similar to input (microphone), processing (EQ, compression, etc), and
        output (speakers). Or even input (control panel buttons/tablet
        interface), processing (split signal to different sub-systems, etc), to
        output (3-D printed object). It's this pattern that I hope to explore
        more, though it's led to some pretty harsh thickets, like category
        theory, process philosophy, and GCODE.
      </p>
      <p>
        Update: My wife and I have moved up to Chicago, IL from Atlanta, GA. I
        am actively seeking to transition to programming full-time. Fingers
        crossed; I'm pretty excited about the possibilities. If you like what
        you see here (or think I'm a pretty cool guy), and know of a gig in the
        Chicago area (or remote), email me and let me know. Or just say hi! I
        don't bite.{' '}
      </p>
      <List>
        <li>
          <Link href="https://github.com/shatteredaesthetic">Github</Link>
        </li>
        <li>
          <Link href="mailto:jason.polhemus@shatteredaesthetic.com">Email</Link>
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
