import React from 'react'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import ReactTable from 'react-table'
import {
  Tabs,
  Tab,
  Carousel,
  Box,
  Container,
  Row,
  Column,
  Border,
  Text,
  Small,
} from 'rebass'

const Col = styled(Column)`
  font-family: sans-serif;
  font-size: 0.8em;
  flex: 1;
`

const TCol = styled(Column)`
  font-family: sans-serif;
  font-size: 0.8em;
  flex: 2;
`

const R = styled(Row)`
  height: 2em;
  flex: 1;
`

const Sm = styled(Small)`
  font-size: 0.6em;
  margin-left: 3px;
  color: gray;
`

const Cont = styled(Container)`
  overflow: scroll;
`

const Disclaimer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  color: #0033e7;
`

// const designCols = [
//   {
//     Header: 'Title',
//     accessor: 'title',
//     Cell: row => (
//       <Border>
//         <Text>{row.title}</Text>
//         <Sm>{row.year}</Sm>
//       </Border>
//     ),
//   },
//   {
//     Header: 'Director',
//     accessor: 'director',
//   },
//   {
//     Header: 'Theater',
//     accessor: 'theater',
//   },
// ]
//
// const engineerCols = [
//   {
//     Header: 'Title',
//     accessor: 'title',
//     Cell: row => (
//       <Border>
//         <Text>{row.title}</Text>
//         <Sm>{row.year}</Sm>
//       </Border>
//     ),
//   },
//   {
//     Header: 'Designer',
//     accessor: 'designer',
//   },
//   {
//     Header: 'Theater',
//     accessor: 'theater',
//   },
// ]

const designHeader = (
  <R bg={'black'} color={'white'}>
    <Column>
      Title <Small>year</Small>
    </Column>
    <Column>Director</Column>
    <Column>Theater</Column>
  </R>
)

const engineerHeader = (
  <R bg={'black'} color={'white'}>
    <Column flex={2}>
      Title <Small>year</Small>
    </Column>
    <Column>Designer</Column>
    <Column>Theater</Column>
  </R>
)

export default class ShowPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { tblpg: 0 }
  }

  getData() {
    const {
      data: { allDesignsJson, allEngineersJson },
    } = this.props
    return {
      designs: allDesignsJson.edges.map(d => d.node),
      engineers: allEngineersJson.edges.map(e => e.node),
    }
  }

  render() {
    const { designs, engineers } = this.getData()
    return (
      <Container>
        <Tabs>
          <Tab onClick={e => this.setState({ tblpg: 0 })}>Designs</Tab>
          <Tab onClick={e => this.setState({ tblpg: 1 })}>FOH Engineer</Tab>
        </Tabs>
        <Carousel index={this.state.tblpg}>
          <Container>
            {designHeader}
            {designs.map((design, i) => (
              <R key={`design-${i}`}>
                <Col>
                  {design.title}
                  <Sm>{design.year}</Sm>
                </Col>
                <Col>{design.director}</Col>
                <Col>{design.theater}</Col>
              </R>
            ))}
          </Container>
          <Container>
            {engineerHeader}
            {engineers.map((engineer, i) => (
              <R key={`engineer-${i}`}>
                <TCol>
                  {engineer.title}
                  <Sm>{engineer.year}</Sm>
                </TCol>
                <Col>{engineer.designer}</Col>
                <Col>{engineer.theater}</Col>
              </R>
            ))}
          </Container>
        </Carousel>
        <Disclaimer>partial list of shows.</Disclaimer>
      </Container>
    )
  }
}

export const pageQuery = graphql`
  query ShowsQuery {
    allDesignsJson {
      edges {
        node {
          title
          year
          director
          theater
        }
      }
    }
    allEngineersJson {
      edges {
        node {
          title
          year
          designer
          theater
        }
      }
    }
  }
`
