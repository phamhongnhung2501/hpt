import React from "react";
import {Card, CardHeader, CardTitle, CardBody,
  Row, Col, Input} from "reactstrap";
import './Db.css'
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import "./Tables.css";
import 'react-day-picker/lib/style.css';

const All = [
  {
    dataField: "time",
    text: "Time",
    sort: true,
    classes: (cell, row, rowIndex, colIndex) => {
      if (rowIndex % 2 === 0) return 'demo-row-even';
      return (
          <span>
          <strong style={{ color: 'red' }}>$ {cell} NTD(Sales!!)</strong>
        </span>
      );
    }
  },
  {
    dataField: "heartbeat",
    text: "Heartbeat",
    sort: true
  },
  {
    dataField: "steps",
    text: "Steps",
    sort: true
  },
  {
    dataField: "meters",
    text: "Meters",
    sort: true
  },
  {
    dataField: "fat_gramms",
    text: "Fat gramms",
    sort: true
  },
  {
    dataField: "callories",
    text: "Callories",
    sort: true
  }
];


const Heartbeat = [
  {
    dataField: "time",
    text: "Time",
    sort: true
  },
  {
    dataField: "heartbeat",
    text: "Heartbeat",
    sort: true
  }
];
const Steps = [
  {
    dataField: "time",
    text: "Time",
    sort: true
  },
  {
    dataField: "steps",
    text: "Steps",
    sort: true
  }
];
const Callories = [
  {
    dataField: "time",
    text: "Time",
    sort: true
  },
  {
    dataField: "callories",
    text: "Callories",
    sort: true
  }
];


class MyExportCSV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.props.onExport();
  };

  render() {
    return (
      <div>
        <button className="btn btn-secondary mt-2 float-right" onClick={this.handleClick.bind(this)}>
          Export
        </button>
      </div>
    );
  }
}
class Tables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "all",
      isLoaded: false,
      data: []
    };
    this.handleChangeType = this.handleChangeType.bind(this);
  }

  handleChangeType(event) {
    this.setState({
      type: event.target.value
    });
    console.log(event.target.value);
    this.props.handleChangeType(event.target.value);
  }


  render() {
    const data = this.props.data;
    return (
      <Card className="Card--width">
        <ToolkitProvider
          keyField="time"
          data={data}
          columns={
            this.state.type === "all"
              ?
                All
              :
              this.state.type === "mbp"
                ?
                  Heartbeat
                :
                this.state.type === "cal"
                  ?
                    Callories
                  :
                    Steps

          }

          exportCSV
        >
          {props => (
            <div>
              <CardHeader>
                <div classtime="float-right pull-right">
                  <MyExportCSV {...props.csvProps} />
                </div>
                <CardTitle tag="h5">
                  <Row>
                    <Col xs="4" className="mt-1">
                      <Input type="select" onChange={this.handleChangeType} value={this.state.type}>
                        <option value="all">All</option>
                        <option value="mbp">Heartbeat</option>
                        <option value="cal">Callories</option>
                        <option value="null">Steps</option>
                      </Input>
                    </Col>
                  </Row>
                </CardTitle>
              </CardHeader>
              <CardBody >
                <BootstrapTable
                  {...props.baseProps}
                  bootstrap4
                  bordered={false}
                  condensed // responsive for table
                  striped
                  pagination={paginationFactory({
                    sizePerPage: 5,
                    sizePerPageList: [5, 10, 25, 50]
                  })}
                  noDataIndication="Table is Empty"
                  hover
                />
              </CardBody>
            </div>
          )}
        </ToolkitProvider>
      </Card>
    );
  }
}


export default Tables;
