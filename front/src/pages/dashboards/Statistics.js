import React from "react";
import { Col, Card, CardBody, CardHeader, Row, Media } from "reactstrap";
import { Slack, TrendingUp, Battery } from "react-feather";
import Chart from "./Chart";
import './Db.css';
import './DomCssTable.css';
class Statistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  ConvertHum1() {
    if (this.props.data.H1 >= this.props.info.status.min_hum && this.props.data.H1 < this.props.info.status.max_hum) {
      return "medium_sensor";
    }
    else if (this.props.data.H1 < this.props.info.status.min_hum) {
      return "low_sensor";
    }
    else {
      return "high_sensor ";
    }

  }
  ConvertPH1() {
    if (this.props.data.PH1 >= this.props.info.status.min_PH && this.props.data.PH1 < this.props.info.status.max_PH) {
      return "medium_sensor";
    }
    else if (this.props.data.PH1 < this.props.info.status.min_PH) {
      return "low_sensor";
    }
    else {
      return "high_sensor ";
    }
  }
  ConvertL1() {
    if (this.props.data.L1 >= this.props.info.status.min_light && this.props.data.L1 < this.props.info.status.max_light) {
      return "medium_sensor";
    }
    else if (this.props.data.L1 < this.props.info.status.max_light) {
      return "low_sensor";
    }
    else {
      return "high_sensor ";
    }
  }
  render() {
    const data = this.props.data;
    return (
        <div className="w-100">
          <Row>
            <Col sm="4">
              <Card className="flex-fill">
                <CardHeader className=" border border-primary ">
                  <div className="float-right">
                    <img src="https://image.flaticon.com/icons/svg/1048/1048166.svg" width={50} height={50} />
                  </div>
                  <h5 className="card-title mb-0 font-weight-bolder text__head--item">Heart Beat</h5>
                  <div className="badge badge-warning ml-4">mbp</div>
                </CardHeader>
                <CardBody className=" border border-primary">
                  <Media>
                    <div className="d-inline-block mr-1">
                      <TrendingUp className="feather-md text-primary mb-1 mr-1" color="#7c7c80" />
                    </div>
                    <Media body>
                      <h4 className="float-right">{data.heartbeat}</h4>
                    </Media>
                  </Media>
                </CardBody>
              </Card>
            </Col>
            <Col sm="4">
              <Card className="flex-fill">
                <CardHeader className="border border-primary">
                  <div className="float-right">
                    <img src="https://image.flaticon.com/icons/svg/3/3832.svg" width={50} height={50} />
                  </div>
                  <h5 className="card-title mb-0 font-weight-bolder text__head--item">Steps</h5>
                </CardHeader>
                <CardBody className="border border-primary" >
                  <Media>
                    <div className="d-inline-block mr-1">
                      <Slack className="feather-md mb-1 mr-1" color="#7c7c80" />
                    </div>
                    <Media body>
                      <h4 className="float-right {this.ConvertPH1()}">{data.steps}</h4>
                    </Media>
                  </Media>
                </CardBody>
              </Card>
            </Col>

            <Col sm="4">
              <Card className="flex-fill ">
                <CardHeader className="border border-primary">
                  <div className="float-right">
                    <img src="https://www.flaticon.com/premium-icon/icons/svg/2174/2174847.svg" width={50} height={50} />
                  </div>
                  <h5 className="card-title mb-0 font-weight-bolder text__head--item">Battery</h5>
                  <div className="badge badge-primary text-center ml-2">%</div>
                </CardHeader>
                <CardBody className="border border-primary">
                  <Media>
                    <div className="d-inline-block mr-1">
                      <Battery className="feather-md mb-1 mr-1" color="#7c7c80" />
                    </div>
                    <Media body>
                      <h4 className="float-right {this.ConvertT1()}">{data.battery}</h4>
                    </Media>
                  </Media>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Chart className="static-chart" data={this.props.data_charts} type={this.props.type} handleSearch={this.props.handleSearch} handleChangeSocket={this.props.handleChangeSocket}/>
          </Row>
        </div>
    );
  }
}


export default Statistics;
