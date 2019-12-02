import React, { Component } from 'react';
import {
  TabContent, TabPane, Nav, NavItem, NavLink, Button, Card, CardBody, Media,
} from "reactstrap";
import Notification from "../../components/Notification";
import classnames from 'classnames';
import "./Profile.css"
import { CustomImg } from "../../components/CustomTag"
import moment from 'moment'
import { getUserId } from "../../utils/utils"
const api = require('./api/api');

class ProfActivities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      max: 10,
      page: 2,
      status_load: true,
      receiveTimeline: false,
      receiveProject: false,
      receiveWatched: false,
      receiveContact: true,
      activeTab: 'contact',
    }
  }

  toggle(tab) {
    if (tab === 'contact') {
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab,
          receiveTimeline: false,
          receiveProject: false,
          receiveWatched: false,
          receiveContact: true,
        });
      }
    }
    else
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab,
          receiveTimeline: true,
          receiveProject: false,
          receiveWatched: false,
          receiveContact: false,
        });
      }
  }


  render() {
    return (
      <div>
        <Nav tabs className="mb-3">
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'contact' })}
              onClick={this.toggle.bind(this, 'contact')}
            >
              Contact
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="contact">
            {this.state.receiveContact && <ActContact id={this.props.id} />}
          </TabPane>
        </TabContent>
      </div>
    )
  }
}
class ActContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxLoad: 10,
      listContact: []
    }
  }
  loadMore() {
    this.setState({ maxLoad: this.state.maxLoad + 10 })
  }
  componentDidMount() {
    this.setState({ loadApiGetContact: false });
    api.getContacts(this.props.id, (err, result) => {
      if (err) {
        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
      }
      else {
        console.log(result);

        this.setState({ listContact: result, loadApiGetContact: true });
      }
    })
  }

  render() {
    console.log(this.state.listContact);

    return (
      <div>
          <Card>
            <CardBody className="tiles mb-4" aria-live="polite">
              {this.state.listContact.map((data, index) => (
                <div key={index}>
                  <Media>
                    <Media left href={data.id !== getUserId() ? `?username=${data.username}` : window.location.pathname}>
                      <CustomImg
                        src={data.photo}
                        className="img--user rounded-circle  mr-3"
                        title={`@${data.username}`}
                        alt="Avatar"
                      />
                    </Media>
                    <Media body>
                      <Media>
                        <strong>Full Name: <a title={data.full_name} href={data.id !== getUserId() ? `?username=${data.username}` : window.location.pathname}>
                          {data.full_name}
                        </a></strong>
                      </Media>
                      <Media>
                        <strong>Email: {data.email}</strong>
                      </Media>
                      <Media>
                        <strong>Phone: {data.phone_number}</strong>
                      </Media>
                      <Media>
                        <strong>Gender: {data.gender}</strong>
                      </Media>
                      <Media>
                        <strong>Date joined: {moment(data.date_joined).format('DD/MM/YYYY h:mm:ss a')}</strong>
                      </Media>
                      {/*<Media>*/}
                      {/*  <strong> Gateway: {*/}
                      {/*    data.devices.map((farms, index) => {*/}
                      {/*      return (*/}
                      {/*        <p className="d-inline"> {farms} </p>*/}
                      {/*      )*/}
                      {/*    })*/}
                      {/*  }</strong>*/}
                      {/*</Media>*/}
                    </Media>
                  </Media>
                </div>
              ))}
              {this.state.maxLoad < this.state.listContact.length && <Button block color="primary" className="load-more" onClick={this.loadMore.bind(this)}>Load More</Button>}
            </CardBody>
          </Card>
      </div>
    );
  }
}

export default ProfActivities;