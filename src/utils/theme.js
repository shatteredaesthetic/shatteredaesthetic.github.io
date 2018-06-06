import { css } from 'styled-components'

export const bgColor = '#fefefe'
export const fgColor = '#323232'
export const darkerBgColor = '#dcdcdc'
export const darkerFgColor = '#000000'
export const linkColor = '#33cc66'

export const theme = css`
  *,
  *:after,
  *:before {
    box-sizing: inherit;
  }

  html {
    box-sizing: border-box;
    font-size: 62.5%;
  }

  body {
    display: flex;
    justify-content: center;
    color: ${fgColor};
    background-color: ${bgColor};
    font-family: 'Fira Mono', monospace;
    font-size: 1.6em;
    font-weight: 400;
    letter-spacing: 0.0625em;
    line-height: 1.8em;
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      font-size: 1.4em;
      line-height: 1.6em;
    }
  }

  a {
    font-weight: 700;
    color: ${darkerFgColor};
    text-decoration: none;
    &:focus,
    &:hover {
      text-decoration: underline;
    }
  }

  p {
    margin: 1.6rem 0 1.6rem 0;
    a {
      font-weight: 400;
      color: ${darkerFgColor};
      text-decoration: underline;
      text-underline-position: under;
      &:focus,
      &:hover {
        color: ${linkColor};
      }
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${darkerFgColor};
    text-transform: uppercase;
    letter-spacing: 0.0625em;
    margin: 3.2rem 0 1.6rem 0;
  }

  h1 {
    font-size: 3.2rem;
    line-height: 3.2rem;
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      font-size: 2.8rem;
      line-height: 2.8rem;
    }
  }
  h2 {
    font-size: 2.8rem;
    line-height: 2.8rem;
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      font-size: 2.4rem;
      line-height: 2.4rem;
    }
  }
  h3 {
    font-size: 2.4rem;
    line-height: 2.4rem;
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      font-size: 2rem;
      line-height: 2rem;
    }
  }
  h4 {
    font-size: 2.2rem;
    line-height: 2.2rem;
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      font-size: 1.8rem;
      line-height: 1.8rem;
    }
  }
  h5 {
    font-size: 2rem;
    line-height: 2rem;
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      font-size: 1.6rem;
      line-height: 1.6rem;
    }
  }
  h6 {
    font-size: 1.4rem;
    line-height: 1.4rem;
  }

  pre {
    margin: 1.6rem 0 1rem 0;
    padding: 1.6rem;
    overflow-x: auto;
  }

  code {
    background-color: ${darkerFgColor};
    color: ${bgColor};
    padding: 0.4rem 0.8rem 0.4rem 0.8rem;
  }

  blockquote {
    border-left: 2px solid ${darkerBgColor};
    padding-left: 1.6rem;
    font-style: italic;
  }

  th,
  td {
    padding: 1.6rem;
  }
  table {
    border-collapse: collapse;
  }
  table td,
  table th {
    border: 2px solid ${darkerFgColor};
  }
  table tr:first-child th {
    border-top: 0;
  }
  table tr:last-child td {
    border-bottom: 0;
  }
  table tr td:first-child,
  table tr th:first-child {
    border-left: 0;
  }
  table tr td:last-child,
  table tr th:last-child {
    border-right: 0;
  }

  img {
    max-width: 100%;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100vw;
  }

  .container {
    display: flex;
    justify-content: center;
    max-width: 120rem;
    width: 100%;
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .navigation {
    display: flex;
    height: 6rem;
    width: 100%;
    a {
      display: inline;
      font-size: 1.6rem;
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
  }

  .content {
    flex: 1;
    margin-top: 1.6rem;
    margin-bottom: 3.2rem;
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
  }

  .list {
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
        }
      }
    }
    p {
      width: 80%;
      align-item: flex-end;
      font-size: 0.7em;
    }
  }

  .pagination {
    margin-top: 6rem;
    text-align: center;
    li {
      display: inline;
      text-align: center;
      span {
        margin: 0;
        text-align: center;
        width: 3.2rem;
      }
      a {
        span {
          margin: 0;
          text-align: center;
          width: 3.2rem;
        }
      }
    }
  }

  .centered {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    .about {
      text-align: center;
      display: flex;
      flex-direction: column;
      h1 {
        margin-top: 2rem;
        margin-bottom: 0.5rem;
      }

      h2 {
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        font-size: 2.4rem;
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
    }

    .error {
      text-align: center;
      h1 {
        margin-top: 2rem;
        margin-bottom: 0.5rem;
        font-size: 4.6rem;
        @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
          font-size: 3.2rem;
        }
      }

      h2 {
        margin-top: 2rem;
        margin-bottom: 3.2rem;
        font-size: 3.2rem;
        @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
          font-size: 2.8rem;
        }
      }
    }
  }

  .footer {
    height: 6rem;
    width: 100%;
    text-align: center;
    line-height: 6rem;
  }

  .float-right {
    float: right;
  }

  .float-left {
    float: left;
  }
`
