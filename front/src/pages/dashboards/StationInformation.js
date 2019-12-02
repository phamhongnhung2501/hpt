import React from "react";
import { Link } from "react-router-dom";
import {Card, CardBody, Row, Col,} from "reactstrap";
import {Tabs, Tab} from "react-bootstrap";
import { CustomImg } from "../../components/CustomTag";
import {Briefcase, MapPin, User,PhoneCall, Image} from "react-feather";
import "./Db.css";
import empty_avatar from "../../assets/img/avatars/empty_avatar.png";

class StationInformation extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      data: data,
      activeTab: '1',
      value: null
    };
    this.toggle = this.toggle.bind(this);


  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    const { data } = this.props;
    // console.log(`abc`, data);
    return (
      <React.Fragment>
        <Tabs defaultActiveKey="info" className="info-station " >
          <Tab eventKey="info" title="Bệnh nhân" className="info-station__patient  " >
            <Card className="flex-fill w-100 " style={{ height: 584, width: "100%" }}>
              <CardBody className="my-0">
                <ul className="list-unstyled mb-0">
                  <li className="mb-3 mt-4">
                    <User width={20} height={20} className="mr-1" /> Bệnh nhân: {" "}
                    <Link to="#">{data.patient_name}</Link>
                  </li>
                  <li className="mb-3 mt-4">
                    <PhoneCall width={20} height={20} className="mr-1 " /> Điện thoại: {" "}
                    <Link to="#">{data.phone_number}</Link>
                  </li>
                  <li className="mb-3  mt-4">
                    <Briefcase width={20} height={20} className="mr-1" />Địa chỉ MAC: {" "}
                    <Link to="#" className="info-station__address">{data.mac}</Link>
                  </li>
                  <li className="mb-3  mt-4">
                    <MapPin width={20} height={20} className="mr-1" />Địa chỉ: {" "}
                    <Link to="#" className="info-station__address">{data.address}</Link>
                  </li>
                  <li className="mb-3  mt-4">
                    <Image width={20} height={20} className="mr-1" />Ảnh bệnh nhân: {" "}
                    <Link to="#">{data.doctor.full_name}</Link>
                  </li>
                  <li className="mb-3 station-info__img">
                    <CustomImg
                        src={data.photo !== null ? data.photo : empty_avatar}
                        className="img-fluid station-info__img"
                        alt="Avatar"
                    />
                  </li>
                </ul>
              </CardBody>
            </Card>
          </Tab>
          <Tab eventKey="map" title="Bác sĩ điều trị" className="info-station__doctor">
            <Card className="flex-fill w-100" style={{ height: 584, width: "100%" }}>
              <CardBody className="my-0">
                <ul className="list-unstyled mb-0">
                  <li className="mb-3  mt-4">
                    <User width={20} height={20} className="mr-1" /> Bác sĩ: {" "}
                    <Link to="#">{data.doctor.full_name}</Link>
                  </li>
                  <li className="mb-3  mt-4">
                    <PhoneCall width={20} height={20} className="mr-1" /> Điện thoại: {" "}
                    <Link to="#">{data.doctor.phone_number}</Link>
                  </li>
                  <li className="mb-3  mt-4">
                    <Briefcase width={20} height={20} className="mr-1" />Mail: {" "}
                    <Link to="#">{data.doctor.email}</Link>
                  </li>
                  <li className="mb-3  mt-4">
                    <MapPin width={20} height={20} className="mr-1" />Địa chỉ: {" "}
                    <Link to="#" className="info-station__address">{data.doctor.address}</Link>
                  </li>
                  <li className="mb-3  mt-4">
                    <Image width={20} height={20} className="mr-1" />Bác sĩ điều trị: {" "}
                  </li>
                  <div className="station-info__img">
                    <CustomImg
                        src={data.doctor.photo !== null ? data.doctor.photo : empty_avatar}
                        width={230}
                        height={230}
                        className="img-fluid station-info__img"
                        alt="Avatar"
                    />
                  </div>
                </ul>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>

      </React.Fragment>

    );
  }
}

export default StationInformation;
