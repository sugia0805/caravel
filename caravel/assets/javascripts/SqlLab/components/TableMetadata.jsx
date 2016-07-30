import React from 'react';
import Draggable from 'react-draggable';
import { BoostrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

const TableMetadata = React.createClass({
  render() {
    return (
      <BootstrapTable
        condensed
        data={this.props.table.columns}
      >
        <TableHeaderColumn dataField="id" isKey hidden>
          id
        </TableHeaderColumn>
        <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
        <TableHeaderColumn dataField="type">Type</TableHeaderColumn>
      </BootstrapTable>
    );
  },
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(TableMetadata);
