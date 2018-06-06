import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

const Wrapper = styled.footer`
  height: 6rem;
  width: 100%;
  text-align: center;
  line-height: 6rem;
`

const Container = styled.section`
  display: flex;
  justify-content: center;
  max-width: 120rem;
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
`

export default () => (
  <Wrapper>
    <Container>
      `© 2018 ∙ Powered by `<Link to="https://www.gatsbyjs.org/">Gatsbyjs</Link>
    </Container>
  </Wrapper>
)
