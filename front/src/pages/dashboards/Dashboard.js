import React from "react";
import ApexCharts from 'apexcharts';
import {Col, Container, Row} from "reactstrap";
import socketIOClient from "socket.io-client";
import Tables from "./Tables";
import Statistics from "./Statistics";
import StationInformation from "./StationInformation";
import Notification from "../../components/Notification";
import { formatDate, parseDate } from 'react-day-picker/moment';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';

const config_socket = require("../../config/config").config_socket;
const utils = require("../../utils/utils");
const api = require("./api/api");

class DateTimePicker extends React.Component {
  constructor(props) {
      super(props);
      this.handleDayChange = this.handleDayChange.bind(this);
      this.state = {
        selectedDay: undefined,
      };
    }
  
    handleDayChange(day) {
      this.setState({ selectedDay: day });
      this.props.handleDate(day)
    }
  
    render() {
      const { selectedDay } = this.state;

      return (
        <div>
          {selectedDay && <p>Day: {selectedDay.toLocaleDateString()}</p>}
          {!selectedDay && <p>Ngày bắt đầu: </p>}
          <DayPickerInput onDayChange={this.handleDayChange} />
        </div>
      );
    }
}

class Crypto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value_sensor: null,
      data_tables: [],
      data_charts: {},
      status: true,
      info: [],
      isLoaded: false,
      isLoaderAPI_EvaluationList: false,
      type: "all",
      response: false,
      socket: true,
      from_date: "",
      to_date: "",
      endpoint: config_socket.ip,
    };
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeSocket = this.handleChangeSocket.bind(this);
    // --------------------------------
    // this.showT = this.showT.bind(this)
    // --------------------------------
  }
  handleChangeType(type) {
    console.log(type)
    this.setState({ type: type });
  }
  handleSearch(from, to) {
    this.setState({ from_date: from, to_date: to });
    const that = this;
    api.getDataReport(from, to, (err, result) => {
      if (err) {
        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
      } else {
        let element = [];
        let data = [...result];
        data.map((values, index) => {
          let value = { ...values };
          value.time = moment(value.time).format('DD/MM/YYYY h:mm:ss a')
          element.push(value);
        });
        that.setState({ data_tables: element, data_charts: result, isLoaderAPI: true });
      }
    })
  }
  handleChangeSocket(socket) {
     console.log(socket)
    if (socket) {
      this.setState({ socket: true });
    }
    else {
      this.setState({ socket: false });
    }
  }
  componentDidMount() {
    const that = this;
    const { endpoint } = this.state;
    const mac = utils.getStationInfo().mac;
    const socket = socketIOClient(endpoint, {
      query:{
        mac: mac
      }
    });
    socket.on("health_" + mac, function (value) {
      that.setState({ data_charts: value, data: value});
      console.log(that.state.data_charts, "DASH");

      var value_table = Object.assign({}, value);
      value_table["time"] = moment(value_table.time).format('DD/MM/YYYY HH:mm:ss');
      that.setState({ data_tables: [...that.state.data_tables, value_table] });
      let data_tables = that.state.data_tables.length;
      if (data_tables >= 30) {
        that.state.data_tables.shift();
      }
    });
    socket.on('error', function (err) {
    });
    this.setState({ info: utils.getStationInfo(), isLoaded: true });
  }

  render() {
    return (
        !this.state.isLoaded ? <p className="text-center">Loading...</p> :
            <Container fluid className="p-0">
              <Row>
                <Col lg="9" xl="9" className="d-flex ">
                  <Statistics
                      data={this.state.data}
                      data_charts={this.state.data_charts}
                      type={this.state.type}
                      handleSearch={this.handleSearch}
                      handleChangeSocket={this.handleChangeSocket}
                  />
                </Col>
                <Col lg="3" xl="3" >
                  <StationInformation
                      data={this.state.info}
                  />
                </Col>
              </Row>

              <Row>
                <Col lg="12" className="d-flex">
                  <Tables data={this.state.data_tables} handleChangeType={this.handleChangeType} />
                </Col>
                {/*<Col lg="6" className="d-flex">*/}
                {/*  <Chart data={this.state.data_charts} type={this.state.type} handleSearch={this.handleSearch} handleChangeSocket={this.handleChangeSocket}  />*/}
                {/*</Col>*/}
              </Row>
            </Container>
    );
  }
}


export default Crypto;
