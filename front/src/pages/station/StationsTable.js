import React from "react";
import "./Stations.css";
import Notification from "../../components/Notification";
import { Link } from "react-router-dom";

import { Card, CardTitle, UncontrolledTooltip, Container } from "reactstrap";
import { CustomImg } from "../../components/CustomTag";

const api = require("./api/api");
const none = "none";

class TableProject extends React.Component {
    constructor(props) {
        super(props);
        const data = this.props;
        this.state = {
            data: data,
        };
    }

    handleSelectProject() {
        api.getInfoProject(this.state.data.mac, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                localStorage.setItem("project", JSON.stringify(result));
                window.location.replace("/dashboard");
            }
        });
    }

    render() {
        console.log(this.state.data)
        return (
            <Container fluid className="table-project mt-4">
                <Card id={"table-project-" + this.state.data.mac} className="table-project__card border-bottom-0">
                    <Link
                        to="#"
                        onClick={this.handleSelectProject.bind(this)}
                        className="table-project__card-header mb-0 px-2 py-1 hover-pointer:hover text-decoration-none overflow-hidden position-relative table-project__card__header"
                    >
                        <CustomImg className="img--user rounded-circle  mr-2" src={this.state.data.photo === null ? none : this.state.data.photo} alt="avt" />
                        <CardTitle className="align-middle d-inline-block mb-0 font-size-2x font-weight-bold text-color-black mt-0 border-bottom-0">
                            <div>
                                <div className="d-inline-block" id={"tooltip-project-" + this.state.data.id}>
                                    {this.state.data.patient_name}
                                </div>
                                <h6 className="text-muted table-project__h6 mt-1">MAC: {this.state.data.mac}</h6>
                                <h6 className="text-muted table-project__h6">Warning: {this.state.data.alert_heart_beat}</h6>
                                <h6 className="text-muted table-project__h6">Phone: {this.state.data.phone_number}</h6>
                                <UncontrolledTooltip placement={"bottom"} target={"tooltip-project-" + this.state.data.id}>
                                    Click to show detail
                                </UncontrolledTooltip>
                            </div>
                        </CardTitle>
                    </Link>
                </Card>
            </Container>
        );
    }
}

export default TableProject;
