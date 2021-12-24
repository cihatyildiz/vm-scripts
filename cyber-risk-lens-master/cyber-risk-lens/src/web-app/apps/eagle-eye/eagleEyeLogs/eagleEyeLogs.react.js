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
  MaterialMenuItem,
  MaterialDivider,
  MaterialTable,
  MaterialTableBody,
  MaterialTableCell,
  MaterialTableHead,
  MaterialTableRow,
  MaterialTableFooter,
  MaterialTablePagination,
  MaterialListItem,
  MaterialList,
} from 'themes/material'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import InputLabel from '@material-ui/core/InputLabel'
import Pagination from '@material-ui/lab/Pagination'
import {config} from 'web-app/ui-configs/Retro.config'
import './../EagleEye.css'
import EagleEyeLogStore from 'web-app/apps/eagle-eye/stores/eagleEyeLog.store'
import PlatformObjectCard from 'web-app/apps/platform/components/PlatformObjectCard.react'
import toDate from 'libs/date/date.lib'
import eagleEyeLogStore from 'web-app/apps/eagle-eye/stores/eagleEyeLog.store'


class EaglEyeLogs extends Component {
  async componentDidMount() {
    await EagleEyeLogStore.setLogs()
    EagleEyeLogStore.setFilterValues()
    EagleEyeLogStore.getApps()
  }

  _renderSelectedFilters() {
    let selectedFilters = []
    if (EagleEyeLogStore.selectedFilters) {
      EagleEyeLogStore.selectedFilters.map((filter, filterIndex) => {
        selectedFilters.push(
          <MaterialBox key={filterIndex} style={{margin: 10}}>
            <MaterialChip
              style={{
                fontSize: 15,
                color: config.color_1,
                borderColor: config.color_3,
                backgroundColor: config.color_3,
                fontWeigth: 500
              }}
              label={`${filter.key}: ${filter.value}`}
              deleteIcon={
                <DeleteForeverSharpIcon
                  style={{color: config.color_1}}
                  size='small'
                />
              }
              onDelete={async () =>
                await EagleEyeLogStore.onDeleteFilter(filterIndex)
              }
            />
          </MaterialBox>
        )
      })
    }
    return selectedFilters
  }

  _renderfilterValues() {
    let renderedFilter = {
      apps: [],
      status: [],
      srcTools: [],
      types: []
    }
    if (EagleEyeLogStore.filter && EagleEyeLogStore.filter.apps) {
      for (let app in EagleEyeLogStore.filter.apps) {
        renderedFilter.apps.push(
          <MaterialMenuItem key={app.id} value={app}>
            {app}
          </MaterialMenuItem>
        )
      }
    }
    if (EagleEyeLogStore.filter && EagleEyeLogStore.filter.status) {
      Object.entries(EagleEyeLogStore.filter.status).forEach(([key, value]) => {
        renderedFilter.status.push(
          <MaterialMenuItem value={value}>{key}</MaterialMenuItem>
        )
      })
    }
    if (EagleEyeLogStore.filter && EagleEyeLogStore.filter.srcTools) {
      for (let srcTool in EagleEyeLogStore.filter.srcTools) {
        renderedFilter.srcTools.push(
          <MaterialMenuItem value={srcTool}>{srcTool}</MaterialMenuItem>
        )
      }
    }
    if (EagleEyeLogStore.filter && EagleEyeLogStore.filter.types) {
      Object.entries(EagleEyeLogStore.filter.types).forEach(([key, value]) => {
        renderedFilter.types.push(
          <MaterialMenuItem value={value}>{value}</MaterialMenuItem>
        )
      })
    }
    if (EagleEyeLogStore.newFilter) {
      switch (EagleEyeLogStore.newFilter.key) {
        case 'apps':
          return renderedFilter.apps
        case 'status':
          return renderedFilter.status
        case 'srcTools':
          return renderedFilter.srcTools
        case 'types':
          return renderedFilter.types
        default:
          return null
      }
    }
  }

  _renderSearchQueryCard() {
    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
        }
      }
    }
    return (
      <MaterialBox
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          borderColor: 'grey',
          borderRadius: 5,
          overflow: 'hidden',
          backgroundColor: config.color_8
        }}
      >
        <MaterialBox
          style={{width: '25%', display: 'flex', justifyContent: 'center'}}
        >
          <MaterialSelect
            disableUnderline
            inputProps={{'aria-label': 'Without label'}}
            style={{width: '100%', justifyContent: 'center'}}
            onChange={(event) => {
              EagleEyeLogStore.setNewFilterKey(event.target.value)
            }}
            value={
              EagleEyeLogStore.newFilter && EagleEyeLogStore.newFilter.key
                ? EagleEyeLogStore.newFilter.key
                : ''
            }
          >
            <MaterialMenuItem value='apps'>App</MaterialMenuItem>
            <MaterialMenuItem value='status'>Status</MaterialMenuItem>
            <MaterialMenuItem value='srcTools'>Tool</MaterialMenuItem>
            <MaterialMenuItem value='types'>Type</MaterialMenuItem>
          </MaterialSelect>
        </MaterialBox>
        <MaterialBox style={{width: '55%', display: 'flex'}}>
          {EagleEyeLogStore.newFilter ? (
            <MaterialSelect
              MenuProps={MenuProps}
              disableUnderline
              style={{width: '100%'}}
              onChange={(event) => {
                EagleEyeLogStore.setNewFilterValue(event.target.value)
              }}
              value={
                EagleEyeLogStore.newFilter && EagleEyeLogStore.newFilter.value
                  ? EagleEyeLogStore.newFilter.value
                  : ''
              }
            >
              {this._renderfilterValues()}
            </MaterialSelect>
          ) : null}
        </MaterialBox>
        <MaterialBox
          style={{
            width: '20%',
            backgroundColor: config.color_3,
            display: 'flex'
          }}
        >
          <MaterialButton
            style={{width: '100%', justifyContent: 'center'}}
            onClick={async () => await EagleEyeLogStore.addSearchFilter()}
          >
            {' '}
            SEARCH
          </MaterialButton>
        </MaterialBox>
      </MaterialBox>
    )
  }

  _renderLogCard(log) {
    const data = JSON.stringify(log.data, null, 4)
    return (
      <TableRow key={log.id}>
        <TableCell align='left' style={{fontSize: 14}}>
          {toDate(log.tsUpdate)}
        </TableCell>
        <TableCell align='left' style={{fontSize: 14}}>
          {log.type}
        </TableCell>
        <TableCell style={{fontSize: 14}}>
          <pre style={{fontFamily: 'Roboto,Helvetica,Arial,sans-serif'}}>
            {data}
          </pre>
        </TableCell>
      </TableRow>
    )
  }

  _renderLogListCard() {
    let logsList = EagleEyeLogStore.getLogs()
    let renderedList = []
    if (logsList) {
      logsList.map((log) => {
        renderedList.push(this._renderLogCard(log))
      })
    }
    const columns = [
      {
        id: 'timeStamp',
        label: 'Time Stamp',
        align: 'left',
        width: '30%'
      },
      {
        id: 'logType',
        label: 'Log Type',
        align: 'left',
        width: '20%'
      },
      {
        id: 'data',
        label: 'Data',
        align: 'center',
        width: '50%'
      }
    ]
    return (
      <Table
        stickyHeader
        aria-label='sticky table'
        style={{background: 'white'}}
      >
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{width: column.width}}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{renderedList}</TableBody>
      </Table>
    )
  }

  _renderErrorSnackbar() {
    const onSnackBarClose = () => {
      EagleEyeLogStore.errorSnackbarStatus = false
      EagleEyeLogStore.errorSnackbarStatus = null
    }
    return (
      <MaterialSnackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        open={EagleEyeLogStore.errorSnackbarStatus}
        autoHideDuration={2000}
        onClose={onSnackBarClose}
        message={<span>{EagleEyeLogStore.errorSnackbarMessage}</span>}
      />
    )
  }

  render() {
    return (
      <MaterialBox
        style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        <MaterialPaper style={{width: '100%', backgroundColor: config.color_1}}>
          <MaterialPaper>
            <MaterialBox style={{padding: 10}}>
              {this._renderSearchQueryCard()}
            </MaterialBox>
          </MaterialPaper>
          <MaterialPaper className='selectedFilters'>
            <MaterialBox style={{display: 'flex', flexFlow: 'row wrap'}}>
              {this._renderSelectedFilters()}
            </MaterialBox>
          </MaterialPaper>
          <MaterialPaper
            className='loglistCard'
            style={{
              width: '100%',
              padding: 10,
              boxSizing: 'border-box'
            }}
          >
            <TableContainer
              style={{
                width: '100%',
                boxSizing: 'border-box',
                borderRadius: '5px 5px 0px 0px',
                maxHeight: '100vh',
                scroll: 'auto'
              }}
            >
              {this._renderLogListCard()}
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component='div'
              count={EagleEyeLogStore.countLogs}
              rowsPerPage={eagleEyeLogStore.rowsPerPage}
              page={eagleEyeLogStore.pageNum}
              onChangePage={(event, page) => {
                EagleEyeLogStore.pageNum = page
                EagleEyeLogStore.setLogs()
              }}
              onChangeRowsPerPage={(event) => {
                eagleEyeLogStore.rowsPerPage = event.target.value
                EagleEyeLogStore.setLogs()
                eagleEyeLogStore.pageNum = 0
              }}
              style={{
                backgroundColor: 'white',
                borderTop: '1px solid',
                borderColor: config.color_16,
                borderRadius: '0px 0px 5px 5px'
              }}
            />
          </MaterialPaper>
        </MaterialPaper>
        {this._renderErrorSnackbar()}
      </MaterialBox>
    )
  }
}

EaglEyeLogs.displayName = 'EaglEyeLogs'
export default observer(EaglEyeLogs)
