import React from "react";
import { Link, NavLink } from "react-router-dom";
import {Key, LogIn, User, UserPlus} from "react-feather";

import { CustomImg, LoadingSprinner } from "../../components/CustomTag";
import avata from "../../assets/img/logo/login.png";
import utils from "../../utils/utils";
import {Button, Card, CardBody, Form, FormGroup, FormFeedback, Input, Alert,
    Container, InputGroupAddon, InputGroupText, InputGroup,} from "reactstrap";
import "./SignIn.css";
const api = require("./api/api");
class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            submitted: false,
            loading: false,
            error: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { email, password } = this.state;
        if (!(email && password)) {
            return;
        }

        this.setState({ loading: true });
        setTimeout(() => {
            api.login(email, password, (err, result) => {
                if (err) {
                    this.setState({ error: err.data === undefined ? err : err.data._error_message, loading: false })
                } else {
                    console.log(result);

                    if (result._id !== undefined) {
                        localStorage.setItem('userInfo', JSON.stringify({
                            id: result._id,
                            token: result.auth_token,
                            full_name: result.full_name,
                            photo: result.photo,
                            is_admin: result.is_admin
                        }))
                    }
                    window.location.replace("/stations");
                }
            })
        }, 500);
    }

    render() {
        const { email, password, submitted, loading, error } = this.state;
        return (

            <React.Fragment>
                <Container className="signin-container-width">
                    {error &&
                        <Alert color="danger" className="p-2" >{error}</Alert>
                    }
                    <div class="d-flex justify-content-center container">
                        <Card className="col-md-7 p-2 !important signin-card">
                            <CardBody className="px-0 pt-0 pb-0">
                                <div className="m-sm-4">
                                    <div className="text-center">
                                        <CustomImg
                                            width={150}
                                            height={150}
                                            key={utils.randomString()}
                                            src={'https://image.flaticon.com/icons/svg/838/838597.svg'}
                                            className="img--user--square-7x mr-4 mb-2"
                                        />
                                    </div>
                                    <h1 className="text-center signin-text-fwork font-weight-bold">Hospital</h1>
                                    <Form onSubmit={this.handleSubmit}>
                                        <FormGroup>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText><User width={15} height={15} /></InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    bsSize="mb-3"
                                                    type="email"
                                                    name="email"
                                                    value={this.state.email}
                                                    onChange={this.handleChange}
                                                    placeholder="Email"
                                                    invalid={submitted && !email}
                                                />
                                            </InputGroup>
                                            <FormFeedback invalid>
                                                Email is a required field!
                                            </FormFeedback>
                                        </FormGroup>
                                        <FormGroup>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText><Key width={15} height={15} /></InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    bsSize="mb-3"
                                                    type="password"
                                                    name="password"
                                                    value={this.state.password}
                                                    onChange={this.handleChange}
                                                    placeholder="Password"
                                                    invalid={submitted && !password}
                                                />
                                            </InputGroup>

                                            <FormFeedback invalid>
                                                Passwords is a required field!
                                            </FormFeedback>
                                            <small>
                                                <Link className="text-password mt-3" to="/auth/reset-password">Forgot Password</Link>
                                            </small>
                                            <div className="text-center mt-3">
                                                {loading === false ?
                                                    <Button
                                                        color="primary"
                                                        font-weight="200"
                                                        size="mb-3"
                                                        className="btn btn-block text-capitalize"
                                                    >
                                                        SignIn<LogIn width={13} height={13} />
                                                    </Button>
                                                    :
                                                    <LoadingSprinner />
                                                }
                                            </div>

                                        </FormGroup>
                                    </Form>
                                
                                
                                    <div className="text-center mt-2">
                                        <NavLink to="/auth/sign-up">Do not have an account. Signup?</NavLink>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </Container>

                
            </React.Fragment>
        );
    }
}

export default SignIn;
