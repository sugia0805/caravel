import React from 'react';
import { Alert, Button, Label } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import QueryWorkspaceElement from './QueryWorkspaceElement';

// CSS
import 'react-select/dist/react-select.css';

class Workspace extends React.Component {
  render() {
    let queryElements;
    if (this.props.workspaceQueries.length > 0) {
      queryElements = this.props.workspaceQueries.map((q) => <QueryWorkspaceElement query={q} />);
    } else {
      queryElements = (
        <Alert bsStyle="info">
          Use the save button on the SQL editor to save a query into this section for
          future reference
        </Alert>
      );
    }
    return (
      <div className="panel panel-default Workspace">
        <div className="panel-heading">
          <h6 className="m-r-10">
            <i className="fa fa-flask" />
            SQL Lab <Label bsStyle="danger">ALPHA</Label>
          </h6>
        </div>
        <div className="panel-body">
          <div>
            <h6>
              <span className="fa-stack">
                <i className="fa fa-database fa-stack-lg"></i>
                <i className="fa fa-search fa-stack-1x"></i>
              </span> Saved Queries
            </h6>
            <div>
              {queryElements}
            </div>
            <hr />
            <Button onClick={this.props.actions.resetState.bind(this)}>
              Reset State
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
Workspace.propTypes = {
  workspaceQueries: React.PropTypes.array,
};
Workspace.defaultProps = {
  workspaceQueries: [],
};

function mapStateToProps(state) {
  return {
    workspaceQueries: state.workspaceQueries,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
