import React from "react";

import {
    Row,
    Col,
    Container,
    Button,
    ModalHeader,
    ModalFooter,
    Modal,
    ModalBody,
    FormGroup,
    FormFeedback,
    Input,
    InputGroupAddon,
    InputGroup,
    InputGroupText,
    Label,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Collapse, Nav, Navbar
} from "reactstrap";
import {Bluetooth, User, AlertTriangle, Phone, Search, UserPlus, LogOut, PieChart, Settings} from "react-feather";
import TableProject from "./StationsTable";
import Notification from "../../components/Notification";
import {CustomImg} from "../../components/CustomTag";
import empty_avatar from "../../assets/img/avatars/empty_avatar.png";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSearch} from "@fortawesome/free-solid-svg-icons";
const api = require("./api/api");
const ValidInput = require("../../utils/ValidInput");

class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showModal: {
                create_project: false
            },
            temp: {
                patient_name: "",
                mac: "",
                phone_number: null,
                alert_heart_beat: null,
            },
            submitted: false,
            isLoaderAPI: false,
            keyWord: null,
            type: "list"
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCreateProject = this.handleCreateProject.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.changeSearchChars = this.changeSearchChars.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    componentDidMount() {
        const that = this;
        api.getInfoProjectAll((err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message
                );
            } else {
                that.setState({ data: result, isLoaderAPI: true });
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
    }
    handleChange(event) {
        let temp = Object.assign({}, this.state.temp);
        temp[event.target.name] = event.target.value;
        this.setState({ temp: temp });
    }

    handleShow() {
        let state = Object.assign({}, this.state);
        state.showModal.create_project = true;
        this.setState(state);
    }

    handleClose() {
        let state = Object.assign({}, this.state);
        state.submitted = false;
        state.temp.name = "";
        state.is_private = false;
        state.showModal.create_project = false;
        this.setState(state);
    }

    handleSignOut() {
        window.location.replace("/auth/sign-in")
    }

    handleSearch(event) {
        this.changeSearchChars(event.target.value);
    }

    changeSearchChars(chars) {
        let state = Object.assign({}, this.state);
        state.keyWord = chars;
        this.setState(state);
    }

    handleChangeType(event) {
        this.setState({
            type: event.target.value
        });
    }

    handleCreateProject() {
        this.setState({ submitted: true });
        // console.log(this.state.temp);

        // stop here if form is invalid
        // const { name } = this.state.temp;
        // if (!name) {
        //     return;
        // }
        api.createProject(this.state.temp, (err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message
                );
            } else {
                this.state.data.push(result);
                Notification("success");
                this.handleClose();
            }
        });
    }

    render() {
        console.log(this.state.data);
        const { dispatch } = this.props;
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const avatar = userInfo.photo;
        const name = userInfo.full_name;
        const isAdmin = userInfo.is_admin;

        return (
            <React.Fragment>
                <Modal isOpen={this.state.showModal.create_project} className="modal-project">
                    <ModalHeader className="modal-project__header">
                        New patient
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name_of_patient">Patient's name</Label>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText><User width={20} height={20} /></InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    type="text"
                                    name="patient_name"
                                    placeholder="Patient's name"
                                    value={this.state.temp.patient_name}
                                    onChange={this.handleChange}
                                    invalid={
                                        this.state.submitted && !this.state.temp.patient_name
                                    }
                                />
                            </InputGroup>
                            <FormFeedback invalid>
                                Patient's name is a required field!
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="mac_add_device">MAC address</Label>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText><Bluetooth width={20} height={20} /></InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    type="text"
                                    name="mac"
                                    placeholder="MAC address"
                                    value={this.state.temp.mac}
                                    onChange={this.handleChange}
                                    invalid={
                                        this.state.submitted && !this.state.temp.mac
                                    }
                                />
                            </InputGroup>
                            <FormFeedback invalid>
                                MAC address is a required field!
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phone_number">Phone number</Label>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText><Phone width={20} height={20} /></InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    type="number"
                                    name="phone_number"
                                    placeholder="Phone number"
                                    value={this.state.temp.phone_number}
                                    onChange={this.handleChange}
                                    invalid={
                                        this.state.submitted && !this.state.temp.phone_number
                                    }
                                />
                            </InputGroup>
                            <FormFeedback invalid>
                                Phone number is a required field!
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="alert_heart_beat">Alert heart beat</Label>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText><AlertTriangle width={20} height={20} /></InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    type="number"
                                    name="alert_heart_beat"
                                    placeholder="Alert heart beat"
                                    value={this.state.temp.alert_heart_beat}
                                    onChange={this.handleChange}
                                    invalid={
                                        this.state.submitted && !this.state.temp.alert_heart_beat
                                    }
                                />
                            </InputGroup>
                            <FormFeedback invalid>
                                Alert heart beat is a required field!
                            </FormFeedback>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.handleClose.bind(this)}>
                            Cancel
                        </Button>
                        <Button color="success" onClick={this.handleCreateProject.bind(this)}>
                            Create
                        </Button>
                    </ModalFooter>
                </Modal>
                {/* -----------------------------AVATAR------------------------------- */}

                <Navbar color="white"  light expand>
                    <CustomImg className="ml-5" src="http://www.wholefamilyhealthcare.com/wp-content/uploads/2017/07/WFH-Logo-02-450.png" width="200" />
                    <Collapse navbar>
                        <Nav className="ml-auto" navbar>
                            <UncontrolledDropdown nav inNavbar className="station_nav-info" >
                                <span className="d-inline-block d-sm-none">
                                <DropdownToggle nav caret className="float-right !important">
                                    <Settings size={18} className="align-middle" />
                                </DropdownToggle>
                            </span>
                                <span className="d-none d-sm-inline-block float-right station__nav mt-2 !important">
                                <DropdownToggle nav caret>
                                    <CustomImg
                                        src={avatar !== null ? avatar : empty_avatar}
                                        className="avatar img-fluid rounded-circle mr-1"
                                        alt="Avatar"
                                    />
                                    <span className="text-dark">{name}</span>
                                </DropdownToggle>
                            </span>
                                <DropdownMenu right className="">
                                    <Link to="">
                                        <DropdownItem>Help</DropdownItem>
                                    </Link>
                                    <Link to="/logout" className="text-dark">
                                        <DropdownItem>Sign out</DropdownItem>
                                    </Link>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>

                {/*------------------------------------------------------------------  */}

                <h1 className="text-center m-3 font__vung font-italic">Hồng Nhung Hospital</h1>
                <Container className="mt-2">
                    <Row className="m-0 !important">
                        <Col xs="4" className="float-left station__icon-new-station">
                            {isAdmin ?
                                <Button
                                    className="float-left  station--button-new bg-success"
                                    onClick={this.handleShow.bind(this)}
                                >
                                    <FontAwesomeIcon icon={faPlus} width={2} height={2} /> New Patient
                                </Button>
                                :null
                            }
                        </Col>
                        <Col xs="3"></Col>
                        <Col xs="5" className="float-right p-0 station__search !important">
                            <InputGroup className="float-right">
                                <Input
                                    className="station--input-search-size"
                                    id="inputSearch"
                                    placeholder= "Search Patient"
                                    onKeyUp={this.handleSearch.bind(this)}
                                />
                                <InputGroupAddon addonType="append">
                                    <Button className="bg-primary">
                                        <FontAwesomeIcon icon={faSearch} width={2} height={2} />
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        {this.state.type === "list" ? (
                            <Col className="pr-0 !important">
                                {this.state.isLoaderAPI ? (
                                    this.state.data.map(
                                        ({
                                             patient_name,
                                             mac,
                                             doctor,
                                             phone_number,
                                             alert_heart_beat,
                                            photo
                                         },
                                            index
                                         // eslint-disable-next-line array-callback-return
                                        ) => {
                                            if (ValidInput.isEmpty(this.state.keyWord)) {
                                                return (<TableProject
                                                        key={index}
                                                        index={index + 1}
                                                        patient_name={patient_name}
                                                        mac={mac}
                                                        phone_number={phone_number}
                                                        alert_heart_beat={alert_heart_beat}
                                                        photo={photo}
                                                    />);
                                            }
                                            else {
                                                if (patient_name.indexOf(this.state.keyWord) !== -1) {
                                                    return (<TableProject
                                                            key={index}
                                                            index={index + 1}
                                                            patient_name={patient_name}
                                                            mac={mac}
                                                            phone_number={phone_number}
                                                            alert_heart_beat={alert_heart_beat}
                                                        />);
                                                }
                                            }
                                        })
                                ) : (
                                        <h1 className="text-center">Loading....</h1>
                                    )}
                            </Col>
                        ) : (
                                <Col>
                                </Col>
                            )}
                    </Row>
                </Container>
                <footer className="footer">
                    <span fluid>
                        <h4 className="text-muted text-center font__vung">
                              Improving the Quality of Your Life at Home
                            &copy; {new Date().getFullYear()}
                        </h4>
                        {/*<p className="mb-0">*/}
                        {/*    &copy; {new Date().getFullYear()} -{" "}*/}
                        {/*    <span href="/" className="text-muted">*/}
                        {/*      AppStack*/}
                        {/*    </span>*/}
                        {/*</p>*/}
                    </span>
                </footer>
            </React.Fragment>
        );
    }
}

export default Project;
