import React from "react";
import $ from "jquery";
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAmericas, faKey, faTags } from "@fortawesome/free-solid-svg-icons";
import "./General.css";
import Notification from "../../components/Notification";
import { CustomImg } from "../../components/CustomTag";
// const api_project = require("../project/api/api");
const api = require("./api/api");
const utils = require("../../utils/utils");

class General extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            full_name: "",

            data: {
                doctor:{},
            },
            isLoaded: false,
            modal: false,
            modalInputPass: false,
            modalCloseAll: false,
            changeName: null,
            changeDescription: null,
            changeIsPrivate: null,
            changeLogo: null,
            tempLogo: null
        };
        this.handleChange = this.handleChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.toggleInputPass = this.toggleInputPass.bind(this)
    }

    handleChange(event) {
        let data = Object.assign({}, this.state.data);
        data[event.target.name] = event.target.value;
        this.setState({ data: data });
    }

    handleChangeType(type) {
        this.setState({
            changeIsPrivate: type === "private"
        });
    }


    handleSaveChange() {
        api.modifyStation(this.state.data.mac, this.state.data, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + ' ' + err.data._error_message)
            } else {
                console.log(result);
                localStorage.setItem('project', JSON.stringify(result));
                Notification("success", "Edit Station", "Edit station is successfully");
            }
        })
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    toggleInputPass() {
        this.setState({
            modalInputPass: !this.state.modalInputPass,
            modalCloseAll: false
        });
    }
    handleDelProject() {
        api.deleteStation(this.state.data.sub_id, (err, result) => {
            if (err) {
                console.log(err)
                Notification("error", "Error", err.data === undefined ? err : err.status + ' ' + err.data._error_message)
            } else {
                window.location.replace('/stations')
            }
        })
    }
    componentDidMount() {
        const that = this;
        api.getInfoProject(utils.getStationInfo().mac, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                console.log(result);
                that.setState({
                    data: result
                })
                localStorage.setItem('project', JSON.stringify(result));
            }
        });
    }

    render() {
        let {docter} = this.state.data;
        return (
            <Card className="admin__general__card">
                <CardBody>
                    <Row>
                        <Col md="8">
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="inputStationName">Station name</Label>
                                        <Input
                                            type="text"
                                            name="patient_name"
                                            placeholder="Station name"
                                            autoComplete="off"
                                            defaultValue={this.state.data.patient_name}
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="name_of_manager">Patient</Label>
                                        <Input
                                            type="text" name="alert_heart_beat"
                                            placeholder="Name of manager"
                                            value={this.state.data.alert_heart_beat}
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="name_of_address">Address</Label>
                                        <Input
                                            type="text" name="mac"
                                            placeholder="Address station"
                                            value={this.state.data.mac}
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="name_of_address">Phone Number</Label>
                                        <Input
                                            type="text" name="phone_number"
                                            placeholder="Phone number"
                                            value={this.state.data.phone_number}
                                            onChange={this.handleChange}
                                            autoComplete="off"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            
                        </Col>
                        <Col xs="4"  className="admin_image">
                            <img

                               className="mb-4"
                                src= "https://bizweb.dktcdn.net/100/161/402/articles/bo-y-te-b4b90132-1d76-42a6-b8de-f34ae0f81244.jpg?v=1551857278560"
                            />
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col md="8"></Col>
                        <Col md="2">
                            <Button type="button" color="primary" onClick={this.handleSaveChange.bind(this)}>Save changes</Button>
                        </Col>
                        <Col md="2" className="pr-4">
                            <Button type="button" color="danger" onClick={this.toggle}>Delete project</Button>
                            <Modal isOpen={this.state.modal} toggle={this.toggle}>
                                <ModalHeader>Confirm</ModalHeader>
                                <ModalBody>Are you sure delete this project?</ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                    <Button color="success" onClick={this.handleDelProject.bind(this)}>OK</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}

export default General;