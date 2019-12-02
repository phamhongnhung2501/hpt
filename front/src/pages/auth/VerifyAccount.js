import React, { Component } from 'react';
import { Link, NavLink } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { CustomImg, LoadingSprinner } from "../../components/CustomTag";
import avata from "../../assets/img/logo/login.png";
import utils from "../../utils/utils";
import "./VerifyAccount.css";
import {
    Button,
    Card, CardBody, CardHeader,
    Form, FormGroup, FormFeedback,
    Input,
    Alert,
    Col, Row,
    Label,
    Container,
} from "reactstrap";
const api = require("./api/api");

const email = window.location.search
    .slice(1)
    .split('&')
    .map(p => p.split('='))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).email;
console.log(email);


class VerifyAccount extends Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.state = {
            code: '',
            email: '',
            submitted: false,
            loading: false,
            error: '',

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        // console.log(event.target.value);

        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { code, mail } = this.state;

        this.setState({ loading: true });
        setTimeout(() => {
            api.verify(code, email, (err, result) => {
                console.log("nhung");

                if (err) {
                    this.setState({ error: err.data === undefined ? err : err.data._error_message, loading: false })
                } else {
                    console.log(result);

                    if (result._id !== undefined) {
                        localStorage.setItem('userInfo', JSON.stringify({
                            mail: result.mail,
                        }))
                    }
                    window.location.replace("/auth/sign-in");
                }
            })
        }, 500);
    }
    validateCode(value) {
        let error;
        if (/(?=^.{6,}$).*$/i.test(value)) {
            error = false;
        } else {
            error = true;
        }
        return error;
    }

    render() {
        const { submitted, code, mail, loading, error } = this.state;
        return (
            <React.Fragment>
                <Container className="signin-container-width">
                    {error &&
                        <Alert color="danger" className="p-2" >{error}</Alert>
                    }
                    <div class="d-flex justify-content-center container">
                        <Card className="col-md-7 p-2 !important verify-card">
                            <CardBody className="px-0 pt-0 pb-0">
                                <div className="m-sm-4">
                                    <div className="text-center">
                                        <CustomImg
                                            width={150}
                                            height={150}
                                            key={utils.randomString()}
                                            src={avata}
                                            className="img--user--square-7x mr-4 mb-2"
                                        />
                                    </div>
                                    <div className="h3 text-primary text-center">Welcome To Your Smart Farm!</div>
                                    <div className="text-center">Thank you for joining! Please click the button below to verify your account.</div>
                                    <Row>
                                        {/* <Col xs="4" className="mt-5" > */}

                                        {/* </Col> */}
                                        <Col className="verify__phone-number float-center">
                                            <Label for="name_of_manager" className="text-danger ml-2">*Verification code</Label>
                                            <Form onSubmit={this.handleSubmit}>
                                                <FormGroup >
                                                    <Input
                                                        bsSize="mb-3"
                                                        type="number"
                                                        name="code"
                                                        onChange={this.handleChange}
                                                        value={this.state.code}
                                                        onChange={this.handleChange}
                                                        placeholder="Your code"
                                                        invalid={submitted && this.validateCode(this.state.code) ? true : false}
                                                    />
                                                    {/* <FormFeedback invalid>
                                                        Code is a required field to you can create a successful account!
                                                    </FormFeedback> */}
                                                    {!code &&
                                                        <FormFeedback invalid>
                                                            Code is a required field to you can create a successful account!
                                                        </FormFeedback>
                                                    }
                                                    {code && (!/(?=^.{6,}$).*$/i.test(code)) &&
                                                        <FormFeedback invalid>
                                                            Code is not valid!
                                                        </FormFeedback>
                                                    }
                                                </FormGroup>
                                                <div className="text-center verify__button-sub">
                                                    {loading === false ?
                                                        <Button
                                                            color="primary"
                                                            font-weight="200"
                                                            size="mb-3 mt-1 "
                                                            className="btn btn-block text-capitalize mt-2"
                                                        >
                                                            Verify Account
                                                        </Button>
                                                        :
                                                        <LoadingSprinner />
                                                    }
                                                </div>
                                            </Form>
                                        </Col>

                                    </Row>


                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </Container>
            </React.Fragment >
        );
    }
}

export default VerifyAccount;