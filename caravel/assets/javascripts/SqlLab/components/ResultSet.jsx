import React from 'react';
import { Alert } from 'react-bootstrap';
import { Table } from 'reactable';


class ResultSet extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    if (this.props.resultset.data.length > 0) {
      return (
        <Table
          data={this.props.resultset.data}
          columns={this.props.resultset.columns}
          sortable
          className="table table-condensed"
        />
      );
    }
    return (<Alert bsStyle="warning">The query returned no data</Alert>);
  }
}
ResultSet.propTypes = {
  resultset: React.PropTypes.object,
};

ResultSet.defaultProps = {
};

export default ResultSet;
