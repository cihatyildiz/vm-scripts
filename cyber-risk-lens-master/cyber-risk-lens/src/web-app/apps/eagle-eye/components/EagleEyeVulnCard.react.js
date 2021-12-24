import React, { Component } from 'react';
import JsxParser from "react-jsx-parser";
import {toJS} from "mobx";
import {
  MaterialPaper, MaterialDivider,
  MaterialGrid, MaterialBox, MaterialTooltip
} from 'themes/material';
import {config} from 'web-app/ui-configs/Retro.config'
import EagleEyeCodeCard from 'web-app/apps/eagle-eye/components/EagleEyeCodeCard.react'
import EagleEyeInLineCode from 'web-app/apps/eagle-eye/components/EagleEyeInLineCode.react'
import EagleEyeLink from 'web-app/apps/eagle-eye/components/EagleEyeLink.react'
import date from 'libs/date/date.lib'
import PlatformLoaderCard from 'web-app/apps/platform/components/PlatformLoaderCard.react'
import PlatformBasicButton from 'web-app/apps/platform/components/PlatformBasicButton.react';
import EagleEyeStore from '../vulns/EagleEye.store';
import {Link} from 'react-router-dom';


class EagleEyeVulnCard extends Component {
  constructor (props) {
    super(props)
  }
  state = {
    selected_vuln_id: null,
    selected_tab: null,
    selected_tab_content: null,
    jiraTicketKey:this.props.vuln.jiraTicketKey
  }

  _toUpperCase (string) {
    return string[0].toUpperCase()+string.slice(1)
  }


  async _onClickVulnCard (vuln_id) {
    console.log(vuln_id)
    if (this.state.selected_vuln_id === vuln_id) {
      await this.setState({selected_vuln_id: null})
    } else {
    await this.setState({
      selected_vuln_id: vuln_id, 
      selected_vuln: this.props.vuln,
      selected_tab_content: this.props.vuln.details.info
      })
    }
  }


  _onClickTab(tab) {
    switch(tab) {
      case 'info':
        this.setState({selected_tab_content: this.props.vuln.details.info})
        break
      case 'recommendations':
        this.setState({selected_tab_content: this.props.vuln.details.recommendations})
        break;
      case 'references':
        this.setState({selected_tab_content: this.props.vuln.details.references})
        break;
      default:
        this.setState({selected_tab_content: this.props.vuln.details.info})
        break
    }
  }


  _renderHTMLContent(content) {
    return (
      <JsxParser
        components={{EagleEyeCodeCard, EagleEyeInLineCode, EagleEyeLink}}
        jsx={content}
        style= {{
          display: 'flex', flexFlow:'column', overflow:'scroll',
           width:'100%', flexDirection:'coulmn', boxSizing:'border-box'
        }}
      />
    )
  }


  _renderVulnDetails () {
    return (
      <MaterialBox style = {{padding: 10}}>
        <MaterialBox display = 'flex' style = {{padding: 5, color: this.props.vuln_color}}>
          <MaterialBox style = {{paddingRight: 20, cursor: 'pointer'}} onClick = {() => this._onClickTab('info')}>
            Info
          </MaterialBox>
          <MaterialBox style = {{paddingRight: 20, cursor: 'pointer'}} onClick = {() => this._onClickTab('recommendations')}>
            Recommendations
          </MaterialBox>
          <MaterialBox style = {{paddingRight: 20, cursor: 'pointer'}} onClick = {() => this._onClickTab('references')}>
            References
          </MaterialBox>
        </MaterialBox>
        <MaterialDivider style = {{backgroundColor: this.props.vuln_color}}/>
        <MaterialPaper style={{
          padding: 10}}>
          {
            this.state.selected_tab_content
              ? this._renderHTMLContent(this.state.selected_tab_content)
            : null
          }
        </MaterialPaper>
      </MaterialBox>
    )
  }


  render () {
    let showLoader = EagleEyeStore.getShowCreateTiketLoader()
    if (showLoader) {
      return (
        <MaterialBox style={{margin: 50}}>
          <PlatformLoaderCard />
        </MaterialBox>
      )
    }
    return (
      <MaterialPaper style={{marginTop: 20, marginBottom: 30}}>
        <MaterialPaper
          style={{
            backgroundColor: config.color_2,
            padding: 10,
            borderRadius: '15px',
            cursor: 'pointer',
          }}
          onClick={async () => await this._onClickVulnCard(this.props.vuln.id)}
        >
          <MaterialGrid container>
            <MaterialGrid item md={6}>
              <MaterialBox
                display='flex'
                alignItems='center'
                style={{marginLeft: 10}}
              >
                <MaterialPaper style={{backgroundColor: ''}}>
                  <MaterialBox
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: this.props.vuln_color,
                      borderRadius: '50%',
                    }}
                  ></MaterialBox>
                </MaterialPaper>
                <MaterialPaper style={{backgroundColor: '', marginLeft: 20}}>
                  <MaterialPaper style={{color: config.color_7, fontSize: 12}}>
                    <span>ID:&nbsp;</span> {this.props.vuln.id}
                  </MaterialPaper>
                  <MaterialPaper
                    style={{fontSize: 16, paddingTop: 5, paddingBottom: 5}}
                  >
                    {this.props.vuln.title.substring(0, 80)}
                  </MaterialPaper>
                  <MaterialBox
                    style={{display: 'flex', fontSize: 14, fontWeight: 600}}
                  >
                    <MaterialPaper style={{color: config.color_3}}>
                      Tool : {this._toUpperCase(this.props.vuln.srcTool)}
                    </MaterialPaper>
                    <MaterialPaper
                      style={{
                        color: this.props.vuln_color,
                        marginLeft: '10px',
                      }}
                    >
                      Status :{' '}
                      {this.props.vuln.status
                        ? this._toUpperCase(this.props.vuln.status)
                        : 'NONE'}
                    </MaterialPaper>
                  </MaterialBox>
                </MaterialPaper>
              </MaterialBox>
            </MaterialGrid>
            <MaterialGrid item md={6} style={{backgroundColor: ''}}>
              <MaterialBox
                style={{
                  backgroundColor: '',
                  textAlign: 'right',
                  paddingRight: 20,
                  color: config.color_3,
                }}
              >
                <MaterialPaper>
                  {this.state.jiraTicketKey ? (
                    <MaterialBox>
                      <button
                        style={{
                          backgroundColor: 'white',
                          border: 0,
                          borderColor: 'black',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          borderRadius: 10,
                          color: 'black',
                          cursor: 'pointer',
                          fontSize: 14,
                          padding: '3px 10px 3px 10px',
                        }}
                      >
                        <Link
                          target={'_blank'}
                          rel={'noopener noreferrer'}
                          style={{textDecoration: 'none', color: 'black'}}
                          to={{
                            pathname:
                              'https://atlassian/jira/browse/' +
                              this.state.jiraTicketKey,
                          }}
                        >
                          <span>JIRA: {this.state.jiraTicketKey}</span>
                        </Link>
                      </button>
                    </MaterialBox>
                  ) : (
                    <MaterialBox>
                      <button
                        radius={10}
                        style={{
                          backgroundColor: 'white',
                          border: 0,
                          borderColor: 'black',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          borderRadius: 10,
                          color: 'black',
                          cursor: 'pointer',
                          fontSize: 14,
                          padding: '3px 10px 3px 10px',
                        }}
                        onClick={() =>
                          EagleEyeStore.createJiraTicket(this.props.vuln).then((state) => {
                            this.setState({jiraTicketKey:state})
                          })
                        }
                      >
                        Create Ticket
                      </button>
                    </MaterialBox>
                  )}
                </MaterialPaper>
                <MaterialPaper
                  style={{
                    textTransform: 'uppercase',
                    paddingTop: 5,
                    paddingBottom: 5
                  }}
                >
                  {this.props.vuln.app.displayName}
                </MaterialPaper>
                <MaterialPaper style={{fontSize:"12px"}}>
                  Updated Time : {date(this.props.vuln.tsUpdate)}
                </MaterialPaper>
              </MaterialBox>
            </MaterialGrid>
          </MaterialGrid>
        </MaterialPaper>
        <MaterialPaper style={{marginTop: 3, backgroundColor: config.color_2}}>
          {this.props.vuln.id === this.state.selected_vuln_id
            ? this._renderVulnDetails()
            : null}
        </MaterialPaper>
      </MaterialPaper>
    )
  }
}

EagleEyeVulnCard.displayName = 'EagleEyeVulnCard';
export default EagleEyeVulnCard;
