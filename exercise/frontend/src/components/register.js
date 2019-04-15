import React, { Component } from "react"
import { Row, Button, Modal, Form, Col, InputGroup } from 'react-bootstrap';
import styled from 'styled-components'
import validate from "validate.js"
import { apiService } from '../service/apiService'
const { Title, Header, Body, Footer } = Modal
const { Group, Label, Control } = Form
const { Prepend } = InputGroup

const ErrorMessage = styled.p`
color:red;
`

export default class Register extends Component {

    constructor(props) {
        super(props)
        this.state = {
            phone: '',
            password: '',
            verifyPassword: '',
            isError: []
        }

        this.submit = this.submit.bind(this)
        this.setValue = this.setValue.bind(this)
        this.clearState = this.clearState.bind(this)
        this.submit = this.submit.bind(this)
    }

    setValue(value, type) {
        this.setState({
            [type]: value.target.value
        })
    }

    clearState() {
        this.setState({
            phone: '',
            password: '',
            verifyPassword: '',
            isError: []
        })
        this.props.closeLocker()
    }

    submit() {
        const { phone, password, verifyPassword } = this.state

        const constraints = {
            phone: {
                numericality: {
                    onlyInteger: true,
                },

                length: {
                    is: 10,
                    wrongLength: "must be at  10 characters"
                }
            },
            verifyPassword: {
                numericality: {
                    onlyInteger: true,
                },
                length: {
                    is: 4,
                    wrongLength: "must be at  4 characters"
                },
                equality: "password"
            }
        };
        const error = validate({ phone: phone, password: password, verifyPassword: verifyPassword }, constraints)
        if (error) {
            this.setState({
                isError: error
            })
        } else {
            const data = {
                id: this.props.getId,
                phone: phone,
                password: password,
            }
            apiService.post('/register', data)
                .then(res => {
                    this.props.closeLocker()
                    this.clearState()
                })
                .catch(err => {
                    console.log('err:', err)
                    this.props.closeLocker()
                    this.clearState()
                })
        }
    }


    render() {
        const { phone, password, verifyPassword, isError } = this.state
        return (
            <Modal show={this.props.isModal} onHide={this.props.closeLocker}>
                <Header closeButton>
                    <Title>Identity Locker</Title>
                </Header>
                <Body>
                    <Form>
                        <Group as={Row}>
                            <Label column sm="3">
                                Phone No :
                                </Label>
                            <Col sm="9">
                                <Control isInvalid={isError.phone} type="tel" value={phone} onChange={e => this.setValue(e, 'phone')} maxLength={10} />
                                {
                                    isError.phone && isError.phone.map((val, index) => {
                                        return <ErrorMessage key={index}>{val}</ErrorMessage>
                                    })
                                }
                            </Col>
                        </Group>
                        <Group as={Row}>
                            <Label column sm="6">
                                Password (4-digi):
                                </Label>
                            <Col sm="6">
                                <InputGroup className="mb-3">
                                    <Control isInvalid={isError.verifyPassword} value={password} type={this.props.hidePass ? 'text' : 'password'} maxLength="4" onChange={e => this.setValue(e, 'password')} />
                                    <Prepend>
                                        <Button variant="outline-secondary" onClick={e => this.props.hiddenPass('hidePass')}>Show</Button>
                                    </Prepend>
                                </InputGroup>

                            </Col>
                        </Group>
                        <Group as={Row}>
                            <Label column sm="6">
                                Confirm Password (4-digi):
                                </Label>
                            <Col sm="6">
                                <InputGroup className="mb-3">
                                    <Control isInvalid={isError.verifyPassword} value={verifyPassword} type={this.props.veriHidePass ? 'text' : 'password'} maxLength="4" onChange={e => this.setValue(e, 'verifyPassword')} />
                                    <Prepend>
                                        <Button variant="outline-secondary" onClick={e => this.props.hiddenPass('veriHidePass')}>Show</Button>
                                    </Prepend>
                                    {
                                        isError.verifyPassword && isError.verifyPassword.map((val, index) => {
                                            return <ErrorMessage key={index}>{val}</ErrorMessage>
                                        })
                                    }
                                </InputGroup>
                            </Col>
                        </Group>
                    </Form>
                </Body>
                <Footer>
                    <Button variant="secondary" onClick={this.clearState}>
                        Close
                        </Button>
                    <Button variant="primary" onClick={this.submit}>
                        Save Changes
                        </Button>
                </Footer>
            </Modal>
        )
    }
}