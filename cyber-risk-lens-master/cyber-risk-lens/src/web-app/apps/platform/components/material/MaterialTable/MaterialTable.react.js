import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import './MaterialTable.css';


type Props = {
  columns: String,
  rows: String,
}


class MaterialTable extends Component <Props> {
  _renderEditIcon(size) {
    return (
      <img src = 'https://github.com/PankajMoolrajani/mxr-icons/blob/master/global/352547-128.png?raw=true'
        width='20px' height='20px'
        alt = 'edit'
      />
    )
  }


  _renderTableRows(columns, table_data, endpoint) {
    if (table_data.length === 0) {
      return (
        <TableRow key = 'empty_table'>
          <TableCell colSpan = {3} style = {{textAlign: 'center'}}>
            The table returned is empty...
          </TableCell>
        </TableRow>
      )
    }
    let row_number = 0
    return (
      table_data.map(row_data => {
        row_number = row_number + 1
        return (
          this._renderTableRow(columns, row_data, row_number, endpoint)
        );
      })
    );
  }


  _renderTableRow(columns, row_data, row_number, endpoint) {
    let table_rows = []
    for (var i=0; i < columns.length; i++) {
      table_rows.push(
        <TableCell
          key = {row_data[columns[i]]}
          onClick = {() => {window.location.assign('view/'+row_data['id'])}}
          style = {{cursor: 'pointer'}}
        >
          {row_data[columns[i]]}
        </TableCell>
      )
    }
    return (
      <TableRow key = {row_data['id']}>
        <TableCell
          key = {row_number.toString()+'-row'}
          onClick = {() => {window.location.assign('view/'+row_data['id'])}}
          style = {{cursor: 'pointer'}}
        >
          {row_number}
        </TableCell>
        {table_rows}
        <TableCell
          key = {row_number.toString()+'-edit'}
          onClick = {() => {window.location.assign('edit/'+row_data['id'])}}
          style = {{cursor: 'pointer'}}
        >
          {this._renderEditIcon(20)}
        </TableCell>
      </TableRow>
    );
  }


  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell key = '#' className = 'MaterialTable-HeaderDataCell'>
              #
            </TableCell>
            {Object.keys(this.props.columns).map(column_name => {
              return (
                <TableCell key = {column_name} className = 'MaterialTable-HeaderDataCell'>
                  {this.props.columns[column_name]}
                </TableCell>
              );
            })}
            <TableCell key = 'edit' className = 'MaterialTable-HeaderDataCell'>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this._renderTableRows(Object.keys(this.props.columns), this.props.rows, this.props.endpoint)}
        </TableBody>
      </Table>
    );
  }
}


MaterialTable.displayName = 'MaterialTable';

export default MaterialTable;
