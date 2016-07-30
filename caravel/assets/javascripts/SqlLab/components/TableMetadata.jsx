import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

class TableMetadata extends React.Component {
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
  }
}
TableMetadata.propTypes = {
  table: React.PropTypes.object,
};
TableMetadata.defaultProps = {
  table: null,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(TableMetadata);
