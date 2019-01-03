import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import { Container, Flex, BackgroundImage, Panel, Box } from 'rebass'

export default class ProjectPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: null,
    }
  }

  getData() {
    const { data } = this.props
    return data.projects.edges.map(p => p.node)
  }

  showPanel(idx) {
    this.setState({ visible: idx })
  }

  hidePanel() {
    this.setState({ visible: null })
  }

  render() {
    const projects = this.getData()

    return (
      <Container>
        <Flex flexWrap="wrap">
          {projects.map((prj, i) => (
            <Box
              key={`prj-${i}`}
              width={1 / 2}
              onMouseEnter={() => this.showPanel(i)}
              onMouseLeave={() => this.hidePanel()}
            >
              <BackgroundImage src={prj.pic} />
              <Panel>
                <Panel.Header>{prj.title}</Panel.Header>
                <Box>{prj.description}</Box>
                <Panel.Footer>{prj.url}</Panel.Footer>
              </Panel>
            </Box>
          ))}
        </Flex>
      </Container>
    )
  }
}

export const pageQuery = graphql`
  query ProjectsQuery {
    projects: allProjectsJson {
      edges {
        node {
          title
          url
          pic
          description
        }
      }
    }
  }
`
