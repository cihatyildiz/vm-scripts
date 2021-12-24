import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {toJS} from 'mobx'
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp'
import {
  MaterialGrid,
  MaterialPaper,
  MaterialButton,
  MaterialBox,
  MaterialSnackbar,
  MaterialChip,
  MaterialSelect,
  MaterialMenuItem
} from 'themes/material'
import Pagination from '@material-ui/lab/Pagination'
import {config} from 'web-app/ui-configs/Retro.config'
import PlatformLoaderCard from 'web-app/apps/platform/components/PlatformLoaderCard.react'
import EagleEyeVulnCard from 'web-app/apps/eagle-eye/components/EagleEyeVulnCard.react'
import './../EagleEye.css'
import EagleEyeStore from './EagleEye.store'


class EagleEyeVulns extends Component {
  async componentDidMount() {
    let apps = await EagleEyeStore.fetchApps()
    await EagleEyeStore.setVulns()
    EagleEyeStore.setFilterValues()
  }


  _renderSearchQueryCard() {
    let renderedFilter = {
      apps: [],
      severities: [],
      srcTools: []
    }
    let selectedFilters = []
    if (EagleEyeStore.filter && EagleEyeStore.filter.apps) {
      for (let app in EagleEyeStore.filter.apps) {
        renderedFilter.apps.push(
          <MaterialMenuItem key={app.id} value={app}>
            {app}
          </MaterialMenuItem>
        )
      }
    }
    if (EagleEyeStore.filter && EagleEyeStore.filter.severities) {
      for (let severity in EagleEyeStore.filter.severities) {
        renderedFilter.severities.push(
          <MaterialMenuItem value = {severity}>{severity}</MaterialMenuItem>
        )
      }
    }
    if (EagleEyeStore.filter && EagleEyeStore.filter.srcTools) {
      for (let srcTool in EagleEyeStore.filter.srcTools) {
        renderedFilter.srcTools.push(
          <MaterialMenuItem value = {srcTool}>{srcTool}</MaterialMenuItem>
        )
      }
    }
    if (EagleEyeStore.selectedFilters) {
      EagleEyeStore.selectedFilters.map((filter, filterIndex) => {
        selectedFilters.push(
          <MaterialBox key = {filterIndex} style = {{margin: 10}}>
            <MaterialChip
              style = {{
                fontSize: 15,
                color: config.color_1,
                borderColor: config.color_3,
                backgroundColor: config.color_3,
                fontWeigth: 500
              }}
              label = {`${filter.key}: ${filter.value}`}
              deleteIcon = {
                <DeleteForeverSharpIcon
                  style = {{color: config.color_1}}
                  size = 'small'
                />
              }
              onDelete = {async () =>
                await EagleEyeStore.onDeleteFilter(filterIndex)
              }
            />
          </MaterialBox>
        )
      })
    }
    return (
      <MaterialPaper style = {{backgroundColor: ''}}>
        <MaterialBox
          style = {{
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: 10,
            overflow: 'hidden'
          }}
        >
          <MaterialBox style = {{flex: 0, paddingLeft: 20, paddingTop: 2}}>
            <MaterialSelect
              disableUnderline
              style = {{width: 200}}
              onChange = {(event) => {
                EagleEyeStore.setNewFilterKey(event.target.value)
              }}
              value = {
                EagleEyeStore.newFilter && EagleEyeStore.newFilter.key
                  ? EagleEyeStore.newFilter.key
                  : ''
              }
            >
              <MaterialMenuItem value = 'app'> App </MaterialMenuItem>
              <MaterialMenuItem value = 'severity'>Severity </MaterialMenuItem>
              <MaterialMenuItem value = 'srcTool'>Source Tool </MaterialMenuItem>
            </MaterialSelect>
          </MaterialBox>
          <MaterialBox style = {{flex: 1, paddingLeft: 10, paddingTop: 2}}>
            {EagleEyeStore.newFilter &&
            EagleEyeStore.newFilter.key === 'app' ? (
              <MaterialSelect
                disableUnderline
                style = {{width: '100%'}}
                onChange = {(event) => {
                  EagleEyeStore.setNewFilterValue(event.target.value)
                }}
                value = {
                  EagleEyeStore.newFilter && EagleEyeStore.newFilter.value
                    ? EagleEyeStore.newFilter.value
                    : ''
                }
              >
                {renderedFilter.apps}
              </MaterialSelect>
            ) : null}
            {EagleEyeStore.newFilter &&
            EagleEyeStore.newFilter.key === 'severity' ? (
              <MaterialSelect
                disableUnderline
                style = {{width: '100%'}}
                onChange = {(event) => {
                  EagleEyeStore.setNewFilterValue(event.target.value)
                }}
                value = {
                  EagleEyeStore.newFilter && EagleEyeStore.newFilter.value
                    ? EagleEyeStore.newFilter.value
                    : ''
                }
              >
                {renderedFilter.severities}
              </MaterialSelect>
            ) : null}
            {EagleEyeStore.newFilter &&
            EagleEyeStore.newFilter.key === 'srcTool' ? (
              <MaterialSelect
                disableUnderline
                style = {{width: '100%'}}
                onChange = {(event) => {
                  EagleEyeStore.setNewFilterValue(event.target.value)
                }}
                value = {
                  EagleEyeStore.newFilter && EagleEyeStore.newFilter.value
                    ? EagleEyeStore.newFilter.value
                    : ''
                }
              >
                {renderedFilter.srcTools}
              </MaterialSelect>
            ) : null}
          </MaterialBox>
          <MaterialBox
            style = {{flex: 0, width: 100, backgroundColor: config.color_3}}
          >
            <MaterialButton
              onClick = {async () => await EagleEyeStore.addSearchFilter()}
            >
              Search
            </MaterialButton>
          </MaterialBox>
        </MaterialBox>
        <MaterialBox
          style = {{
            display: 'flex',
            marginTop: 10,
            flexDirection: 'row',
            flexFlow: 'wrap'
          }}
        >
          {selectedFilters}
        </MaterialBox>
      </MaterialPaper>
    )
  }


  _renderVulnCard(vuln) {
    let vuln_color = config.color_5
    switch (vuln.severity) {
      case 'critical':
        vuln_color = config.color_9
        break
      case 'high':
        vuln_color = config.color_10
        break
      case 'medium':
        vuln_color = config.color_11
        break
      case 'low':
        vuln_color = config.color_12
        break
      default:
        vuln_color = config.color_13
    }
    return (
      <EagleEyeVulnCard key={vuln.id} vuln={vuln} vuln_color={vuln_color} />
    )
  }


  _renderVulnsListCard(vulns) {
    let list_vulns = []
    vulns.map((vuln) => list_vulns.push(this._renderVulnCard(vuln)))
    return (
      <MaterialBox
        style = {{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <MaterialBox style = {{width: '100%'}}>{list_vulns}</MaterialBox>
      </MaterialBox>
    )
  }

  _renderSeverityCount(count) {
    const counts = toJS(EagleEyeStore.counts)
    const searchQuery = EagleEyeStore.getSearchQuery()
    return (
      <MaterialBox
        style = {{
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'flex-start',
          padding: 10
        }}
      >
        <MaterialBox
          style = {{
            display: 'flex',
            flexDirection: 'column',
            width: '50px',
            color: config.color_13,
            alignItems: 'center'
          }}
        >
          <MaterialBox
            style = {{
              fontSize: 12,
              border: '2px solid',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {count.info ? count.info : 0}
          </MaterialBox>
          <MaterialBox
            style = {{
              fontSize: 10,
              fontWeight: 'bold',
              marginTop: 10,
              justifyContent: 'center'
            }}
          >
            <MaterialBox>INFO</MaterialBox>
          </MaterialBox>
        </MaterialBox>
        <MaterialBox
          style = {{
            display: 'flex',
            flexDirection: 'column',
            width: '50px',
            color: config.color_12,
            alignItems: 'center'
          }}
        >
          <MaterialBox
            style = {{
              fontSize: 12,
              border: '2px solid',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {count.low ? count.low : 0}
          </MaterialBox>
          <MaterialBox
            style = {{
              fontSize: 10,
              fontWeight: 'bold',
              marginTop: 10,
              justifyContent: 'center'
            }}
          >
            <MaterialBox>LOW</MaterialBox>
          </MaterialBox>
        </MaterialBox>
        <MaterialBox
          style = {{
            display: 'flex',
            flexDirection: 'column',
            width: '50px',
            color: config.color_11,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <MaterialBox
            style = {{
              fontSize: 12,
              border: '2px solid',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {count.medium ? count.medium : 0}
          </MaterialBox>
          <MaterialBox
            style = {{
              fontSize: 10,
              fontWeight: 'bold',
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <MaterialBox>MED</MaterialBox>
          </MaterialBox>
        </MaterialBox>
        <MaterialBox
          style = {{
            display: 'flex',
            flexDirection: 'column',
            width: '50px',
            color: config.color_10,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10
          }}
        >
          <MaterialBox
            style = {{
              fontSize: 12,
              border: '2px solid',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {count.high ? count.high : 0}
          </MaterialBox>
          <MaterialBox
            style = {{
              fontSize: 10,
              fontWeight: 'bold',
              marginTop: 10,
              justifyContent: 'center'
            }}
          >
            <MaterialBox>HIGH</MaterialBox>
          </MaterialBox>
        </MaterialBox>
        <MaterialBox
          style = {{
            display: 'flex',
            flexDirection: 'column',
            width: '50px',
            color: config.color_9,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <MaterialBox
            style={{
              fontSize: 12,
              border: '2px solid',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {count.critical ? count.critical : 0}
          </MaterialBox>
          <MaterialBox
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              marginTop: 10,
              justifyContent: 'center'
            }}
          >
            <MaterialBox>CRITICAL</MaterialBox>
          </MaterialBox>
        </MaterialBox>
      </MaterialBox>
    )
  }


  _renderErrorSnackbar() {
    const onSnackBarClose = () => {
      EagleEyeStore.errorSnackbarStatus = false
      EagleEyeStore.errorSnackbarStatus = null
    }
    return (
      <MaterialSnackbar
        anchorOrigin = {{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        open = {EagleEyeStore.errorSnackbarStatus}
        autoHideDuration = {2000}
        onClose = {onSnackBarClose}
        message = {<span>{EagleEyeStore.errorSnackbarMessage}</span>}
      />
    )
  }


  render() {
    let vulns = EagleEyeStore.getVulns()
    let counts = EagleEyeStore.getCounts()
    return (
      <MaterialPaper
        display = 'flex'
        style = {{
          minHeight: '100%',
          backgroundColor: config.color_1,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'flex-start'
        }}
      >
        {this._renderErrorSnackbar()}
        <MaterialBox
          style = {{
            padding: '30px 60px 30px 60px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          <MaterialBox
            style = {{display: 'flex', flexDirection: 'column', width: '100%'}}
          >
            <MaterialBox
              style = {{
                backgroundColor: '',
                borderStyle: 'solid',
                borderWidth: '0px',
                borderRadius: 10
              }}
            >
              {this._renderSearchQueryCard()}
            </MaterialBox>
            <MaterialBox
              style = {{width: '100%', display: 'flex', flexDirection: 'column'}}
            >
              {EagleEyeStore.counts
                ? this._renderSeverityCount(EagleEyeStore.counts)
                : null}
            </MaterialBox>
            <MaterialBox
              style = {{
                marginTop: 10,
                minHeight: '700px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              {vulns
                ? this._renderVulnsListCard(vulns)
                : 'No vulnerabilities found as per the search criteria'}
            </MaterialBox>
            <MaterialBox>
              <MaterialBox style = {{display: 'flex', justifyContent: 'center'}}>
                <MaterialBox
                  style = {{
                    backgroundColor: 'white',
                    padding: 5,
                    borderRadius: 20
                  }}
                >
                  <Pagination
                    count = {Math.ceil(EagleEyeStore.countVulns / 30)}
                    onChange = {(event, page) => {
                      EagleEyeStore.pageNum = page
                      EagleEyeStore.setVulns()
                    }}
                  />
                </MaterialBox>
              </MaterialBox>
            </MaterialBox>
          </MaterialBox>
        </MaterialBox>
      </MaterialPaper>
    )
  }
}

EagleEyeVulns.displayName = 'EagleEyeVulns'
export default observer(EagleEyeVulns)
