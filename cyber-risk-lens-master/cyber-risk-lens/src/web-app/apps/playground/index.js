import React, { Component } from 'react';
import {
  MaterialGrid,
  MaterialPaper
} from 'themes/material';
import CyberRiskLensHeader from 'web-app/components/CyberRiskLensHeader.react'
import {config} from 'web-app/ui-configs/Retro.config'
import {graphql} from 'libs/graphql';


class PlaygroundApp extends Component {
  state = {
    vulns: null
  }


  async componentDidMount() {
    console.log('going to get data')
    let query = `
      query vulns {
        vulns {
          id
          title
          criticality
        }
      }
    `
    let graphql_response = await graphql(query)
    if (graphql_response.status === 200) {
      this.setState({vulns: graphql_response.data.data.vulns})
    }
  }


  _renderVulnCard(vuln) {
    return (
      <MaterialPaper style = {{backgroundColor: config.color_2, margin: 20, padding: 10}}>
        <MaterialPaper>
          {vuln.id}
        </MaterialPaper>
        <br/>
        <MaterialPaper>
          {vuln.title}
        </MaterialPaper>
        <br/>
        <MaterialPaper>
          {vuln.criticality}
        </MaterialPaper>
      </MaterialPaper>
    )
  }


  _renderVulnsListCard(vulns) {
    console.log(vulns)
    let list_vulns = []
    vulns.map(
      (vuln) => list_vulns.push(this._renderVulnCard(vuln))
    )
    return (
      <MaterialPaper>
        Vulns List Card
        {list_vulns}
      </MaterialPaper>
    )
  }

  render() {
    return (
      <div>
        {/* <iframe src = 'google.com' width = '100%' height = '100%'/> */}
        {/* <iframe src="https://www.google.com"></iframe> */}

      </div>
    )
  }

  render1() {
    console.log(this.state)
    return (
      <MaterialGrid
        container
        direction = 'row'
        alignItems = 'flex-start'
        justify = 'center'
        style = {{
          // position: 'absolute',
          backgroundColor: config.color_1,
          minHeight: '100%'
        }}
      >
        <MaterialGrid
          item md = {12}
          style = {{padding: 15, height: '10%', backgroundColor: ''}}
        >
          <CyberRiskLensHeader title = 'Cyber Risk | Eagle Eye' user_name = 'Pankaj'/>
        </MaterialGrid>
        <MaterialGrid item md = {11} style = {{minHeight: '900px', padding: 20, color: 'white', backgroundColor: ''}}>
          <MaterialGrid container style = {{backgroundColor: ''}}>
            <MaterialGrid item md = {12}
            style = {{
              padding: 10,
              backgroundColor: '',
              borderStyle: 'solid',
              borderWidth: '0.5px',
              borderRadius: 10,
              height: '100px'
            }}
          >
              Component - FilterQueryCard
            </MaterialGrid>
            <MaterialGrid
              item md = {12}
              style = {{
                marginTop: 20,
                padding: 10,
                backgroundColor: '',
                borderStyle: 'solid',
                borderWidth: '0.5px',
                borderRadius: 10,
                height: '700px'
              }}
            >
              {this.state.vulns ? this._renderVulnsListCard(this.state.vulns) : 'No vulnerabilities found as per the search criteria'}
            </MaterialGrid>
          </MaterialGrid>
        </MaterialGrid>
      </MaterialGrid>

    )
  }
}


PlaygroundApp.displayName = 'PlaygroundApp';
export default PlaygroundApp;
