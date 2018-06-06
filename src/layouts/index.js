import React from 'react'
import styled, { injectGlobal } from 'styled-components'
import Header from '../components/Header'
import Footer from '../components/Footer'

import { theme, fgColor } from '../utils/theme'
require('prismjs/themes/prism-okaidia.css')

injectGlobal`${theme}`

const Wrapper = styled.main`
  min-height: 100vh;
  width: 85vw;
  display: grid;
  grid-template-rows: 50px 1fr 50px;
`

const Content = styled.div`
  article {
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
  }
`

const Template = ({ children }) => (
  <Wrapper>
    <Header />
    <Content>{children()}</Content>
    <Footer />
  </Wrapper>
)

export default Template
