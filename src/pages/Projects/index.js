import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import { Container, Flex, BackgroundImage, Panel, Box } from 'rebass'

const Projects = props => {
  const projects = props.data.allProjectsJson.edges
}

export default class ProjectPage extends React.Component {
  constructor(props) {
    super(props)
  }

  getData() {
    const { data } = this.props
    return data.projects.edges.map(p => p.node)
  }

  render() {
    const projects = this.getData()

    return (
      <Container>
        <Flex flexWrap="wrap">
          {projects.map((prj, i) => (
            <Box key={`prj-${i}`} width={1 / 2}>
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
