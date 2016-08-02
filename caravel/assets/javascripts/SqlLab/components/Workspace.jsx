const $ = window.$ = require('jquery');
import React from 'react';
import { Alert, Label, Modal } from 'react-bootstrap';
import Link from './Link';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import TableWorkspaceElement from './TableWorkspaceElement';
import QueryWorkspaceElement from './QueryWorkspaceElement';
import shortid from 'shortid';
import Select from 'react-select';

// CSS
import 'react-select/dist/react-select.css';

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableName: null,
      showAddTableModal: false,
      tableOptions: [],
      databaseOptions: [],
      tableLoading: false,
    };
  }
  componentDidMount() {
    this.fetchDatabaseOptions();
  }
  getTableOptions(input, callback) {
    const url = '/tableasync/api/read?_oc_DatabaseAsync=database_name&_od_DatabaseAsync=asc';
    $.get(url, function (data) {
      const options = [];
      for (let i = 0; i < data.pks.length; i++) {
        options.push({ value: data.pks[i], label: data.result[i].table_name });
      }
      callback(null, {
        options,
        cache: false,
      });
    });
  }
  changeDb(db) {
    this.setState({ tableLoading: true });
    const that = this;
    const url = `//${window.location.host}/databasetablesasync/api/read?_flt_0_id=${db.value}`;
    $.get(url, function (data) {
      const tables = data.result[0].all_table_names;
      const options = tables.map((table) => ({ value: table, label: table }));
      that.setState({ tableOptions: options });
      that.setState({ tableLoading: false });
      that.props.actions.setWorkspaceDb(data.result[0]);
    });
  }
  changeTable(tableOpt) {
    const tableName = tableOpt.value;
    this.setState({ tableName });
    const that = this;
    const url = `/caravel/table/${this.props.workspaceDatabase.id}/${tableName}/`;
    $.get(url, function (data) {
      that.props.actions.addTable({
        id: shortid.generate(),
        dbId: that.props.workspaceDatabase.id,
        name: data.name,
        columns: data.columns,
        expanded: true,
        showPopup: false,
      });
    });
  }
  showAddTableModal() {
    this.setState({ showAddTableModal: true });
  }
  hideAddTableModal() {
    this.setState({ showAddTableModal: false });
  }
  fetchDatabaseOptions() {
    this.setState({ databaseLoading: true });
    const that = this;
    const url = '/databaseasync/api/read';
    $.get(url, function (data) {
      const options = data.result.map((db) => ({ value: db.id, label: db.database_name }));
      that.setState({ databaseOptions: options });
      that.setState({ databaseLoading: false });
    });
  }
  render() {
    let tableElems = (
      <Alert bsStyle="info">
        To add a table to your workspace, click the plus [+] sign above.
      </Alert>);
    if (this.props.tables.length > 0) {
      tableElems = this.props.tables.map(function (table) {
        return <TableWorkspaceElement key={table.id} table={table} />;
      });
    }

    let queryElements;
    if (this.props.workspaceQueries.length > 0) {
      queryElements = this.props.workspaceQueries.map((q) => <QueryWorkspaceElement query={q} />);
    } else {
      queryElements = (
        <Alert bsStyle="info">
          Use the save button on the SQL editor to add a query to your
          workspace
        </Alert>
      );
    }
    const dbId = (this.props.workspaceDatabase) ? this.props.workspaceDatabase.id : null;
    const modal = (
      <Modal show={this.state.showAddTableModal} onHide={this.hideAddTableModal.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Add tables to workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h6>Database:</h6>
            <Select
              name="select-db"
              placeholder="[Database]"
              options={this.state.databaseOptions}
              disabled={(this.state.databaseOptions.length === 0)}
              isLoading={(this.state.databaseOptions.length === 0)}
              value={dbId}
              onChange={this.changeDb.bind(this)}
              autosize={false}
            />
          </div>
          <br />
          <div>
            <h6>Tables:</h6>
            <Select
              disabled={(this.props.workspaceDatabase === null)}
              ref="selectTable"
              name="select-table"
              isLoading={this.state.tableLoading}
              placeholder="[Table / View]"
              className="p-t-10"
              value={this.state.tableName}
              onChange={this.changeTable.bind(this)}
              options={this.state.tableOptions}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
    return (
      <div className="panel panel-default Workspace">
        {modal}
        <div className="panel-heading">
          <h6 className="m-r-10">
            <i className="fa fa-flask" />
            SQL Lab <Label bsStyle="danger">ALPHA</Label>
          </h6>
        </div>
        <div className="panel-body">
          <div>
            <h6>
              <i className="fa fa-table fa-lg" /> Tables / Views <Link
                className="fa fa-plus-circle"
                href="#"
                onClick={this.showAddTableModal.bind(this)}
              />
            </h6>
            <div>
              {tableElems}
            </div>
            <hr />

            <h6>
              <span className="fa-stack">
                <i className="fa fa-database fa-stack-lg"></i>
                <i className="fa fa-search fa-stack-1x"></i>
              </span> Queries
            </h6>
            <div>
              {queryElements}
            </div>
            <hr />
          </div>
        </div>
      </div>
    );
  }
}
Workspace.propTypes = {
  workspaceDatabase: React.PropTypes.object,
  workspaceQueries: React.PropTypes.array,
  tables: React.PropTypes.array,
};
Workspace.defaultProps = {
  workspaceDatabase: null,
  workspaceQueries: [],
  tables: [],
};

function mapStateToProps(state) {
  return {
    tables: state.tables,
    workspaceDatabase: state.workspaceDatabase,
    workspaceQueries: state.workspaceQueries,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
