import React from 'react';
import { Modal, FormGroup, Radio } from 'react-bootstrap';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';

import Select from 'react-select';

import moment from 'moment';
import { Table } from 'reactable';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/styles';

import Link from './Link';
import ButtonWithTooltip from './ButtonWithTooltip';

// TODO move to CSS
const STATE_COLOR_MAP = {
  failed: 'red',
  running: 'lime',
  success: 'green',
};

class QueryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVisualizeModal: false,
      activeQuery: null,
    };
  }
  hideVisualizeModal() {
    this.setState({ showVisualizeModal: false });
  }
  showVisualizeModal(query) {
    this.setState({ showVisualizeModal: true });
    this.state.activeQuery = query;
  }
  changeVisualizeOption(event) {
    console.log(event.target);
    console.log(event.target.value);
  }
  render() {
    const data = this.props.queries.map((query) => {
      const q = Object.assign({}, query);
      const since = (q.endDttm) ? q.endDttm : new Date();
      let duration = since.valueOf() - q.startDttm.valueOf();
      duration = moment.utc(duration);
      if (q.endDttm) {
        q.duration = duration.format('HH:mm:ss.SS');
      }
      q.started = moment(q.startDttm).format('HH:mm:ss');
      q.sql = <SyntaxHighlighter language="sql" style={github}>{q.sql}</SyntaxHighlighter>;
      q.state = (
        <span
          className="label label-default"
          style={{ backgroundColor: STATE_COLOR_MAP[q.state] }}
        >
          {q.state}
        </span>
      );
      q.actions = (
        <div>
          <Link
            className="fa fa-line-chart fa-lg"
            tooltip="Visualize the data out of this query"
            onClick={this.showVisualizeModal.bind(this, q)}
            href="#"
          />
          <Link
            className="fa fa-plus-circle"
            tooltip="Pop a tab containing this query"
            href="#"
          />
          <Link
            className="fa fa-trash"
            href="#"
            tooltip="Remove query from log"
            onClick={this.props.actions.removeQuery.bind(this, query)}
          />
          <Link
            className="fa fa-map-pin"
            tooltip="Pin this query to the top of this query log"
            href="#"
          />
        </div>
      );

      return q;
    }).reverse();
    let visualizeModal;
    if (this.state.activeQuery) {
      const cols = this.state.activeQuery.results.columns;
      const columnOptions = cols.map((s) => ({ value: s, label: s }));
      visualizeModal = (
        <div>
          <form>
            <FormGroup>
              <Radio
                name="visualizeOption"
                value="quick"
                onChange={this.changeVisualizeOption.bind(this)}
                inline
              >
                Quick Visualization
              </Radio>
              <Radio
                name="visualizeOption"
                value="datasource"
                onChange={this.changeVisualizeOption.bind(this)}
                inline
              >
                Create a datasource for exploration
              </Radio>
            </FormGroup>

            Visualization Type:
            <Select
              name="select-db"
              placeholder="[Visualization Type]"
              className="m-b-10"
              options={[
                { value: 'line', label: 'Line Chart' },
                { value: 'bar', label: 'Bar Chart' },
                { value: 'bubble', label: 'Bubble Chart' },
              ]}
              value={null}
              autosize={false}
              onChange={() => {}}
            />
            Metric:
            <Select
              className="m-b-10"
              name="select-db"
              placeholder="[Visualization Type]"
              options={columnOptions}
              value={null}
              autosize={false}
              onChange={() => {}}
            />
            Series:
            <Select
              name="select-db"
              placeholder="[Visualization Type]"
              className="m-b-10"
              options={columnOptions}
              value={null}
              autosize={false}
              onChange={() => {}}
            />
            <ButtonWithTooltip
              bsStyle="primary"
              className="m-r-10"
              onClick={() => {}}
            >
              <i className="fa fa-line-chart" /> Visualize!
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={this.hideVisualizeModal.bind(this)}
            >
              <i className="fa fa-close" /> Close
            </ButtonWithTooltip>
          </form>
        </div>
      );
    }
    return (
      <div>
        <Modal show={this.state.showVisualizeModal} onHide={this.hideVisualizeModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Add tables to workspace (mock)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {visualizeModal}
          </Modal.Body>
        </Modal>
        <Table
          columns={['state', 'started', 'duration', 'rows', 'sql', 'actions']}
          className="table table-condensed"
          data={data}
        />
      </div>
    );
  }
}
QueryTable.propTypes = {
  columns: React.PropTypes.array,
  actions: React.PropTypes.object,
  queries: React.PropTypes.object,
};
QueryTable.defaultProps = {
  columns: ['state', 'started', 'duration', 'rows', 'sql', 'actions'],
  queries: [],
};

function mapStateToProps(state) {
  return {
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(QueryTable);
