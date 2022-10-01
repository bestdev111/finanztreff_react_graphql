import keycloak from "keycloak";
import React from 'react'
import './ChangeEmailModal.scss'
import { useMediaQuery } from 'react-responsive'
import { Button, Modal, Row, Col, Form } from 'react-bootstrap'
import SvgImage from "components/common/image/SvgImage";
import classNames from "classnames";
import EmailPasswordModalHeader from "./EmailPasswordModalHeader";
import { useMutation } from "@apollo/client";
import { Mutation } from "graphql/types";
import { loader } from "graphql.macro";

export default function ChangeEmailModal() {
    const [state, setState] = React.useState({
        isOpen: false,
        isChanged: false,
        emailAvailable: false,
        email: ""
    })

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(loader('./changeEmail.graphql'));

    const changeEmail = () => {
        // console.log("Change email ...");
        mutation({
            variables: {
                email: state.email
            }
        })
            .then(entry => {
                if (entry.data && entry.data.changeProfileEmail.responseCode == 0) {
                    setState({...state, isOpen: false});
                } else {
                    alert("Error: " + entry.data?.changeProfileEmail.responseMessage);
                }
            });
    } 


    const checkEmailValid = (email: string): boolean => {
        if (!keycloak.authenticated) return false

        // eslint-disable-next-line no-empty-character-class
        const emailValidationRegex: RegExp = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*|\[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]*[0-9A-Za-z]:[!-Z^-~]+)])/
        const currentEmail: string = (keycloak?.tokenParsed as any).email
        return email !== currentEmail && emailValidationRegex.test(email)
    }
    const setEmailAndCheckEvailable = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        setState(currentState => ({...currentState, email: ev.target.value}))
        const emailValid = checkEmailValid(ev.target.value)
        setState((currentState) => ({...currentState, emailAvailable: emailValid}))
    }

    const isMobile = useMediaQuery({
        query: "(max-width: 767px)"
    })

    const mobileFooter = (
        <Row className="mt-20px mb-1 mb-sm-1 mb-md-0 mb-lg-0 mb-xl-0 mx-0 w-100 align-items-baseline justify-content-between">
            <Col className="col-auto px-0">
                <Button variant="light" className="bg-gray-light text-blue" onClick={() => setState({...state, isOpen: false})}>Abbrechen</Button>
            </Col>
            <Col className="col-auto px-0">
                <Button variant={state.emailAvailable ? "primary": "light"} className={state.emailAvailable ? "text-white" : "text-kurs-grau"} disabled={!state.emailAvailable} onClick={() => setState({...state, isChanged: true})}>Speichern</Button>
            </Col>
        </Row>
    )
    const tabletDesktopFooter = (
        <Row className="mx-0 mt-20px mb-0">
            <Col className="px-0">
                <Button variant="light" className="bg-gray-light text-blue" onClick={() => setState({...state, isOpen: false})}>Abbrechen</Button>
            </Col>
        </Row>
    )

    const defaultState = (
        <>
            <Button variant="light" onClick={() => setState({...state, isOpen: true})} className={classNames("text-decoration-none d-flex text-blue fs-14px", {"float-right":!isMobile})}>
                <span>E-Mail Adresse ändern...</span>
            </Button>
            <Modal show={state.isOpen} onHide={() => setState({...state, isOpen: false})} dialogClassName={isMobile ? "modal-sm" : "modal-md"} backdropClassName="modal-z-2__backdrop" animation={true} className="change-email-modal modal-z-2">
                <EmailPasswordModalHeader title="E-Mail Adresse ändern..." close={() => setState({...state, isOpen: false})} buttonBottom={true} />
                <Modal.Body className="modal-body bg-white pt-sm-3 pt-md-3 pt-lg-3 pt-xl-3 pb-3 px-sm-2 px-md-3 px-lg-3 px-xl-3">
                    <Row className="mt-3">
                        <Col>
                            <p className="my-0 roboto-regular fs-15px line-height-22px">Bitte geben Sie Ihre neue E-Mail Adresse ein. Im Anschluss erhalten Sie einen Bestätigungslink per E-Mail um die Änderung abzuschließen.</p>
                        </Col>
                    </Row>
                    <Row className="mx-0 pt-2">
                        <Form className="w-100 mt-10px">
                            <Row className="mx-0 align-items-center">
                                <Col className="col-sm-9 col-md-7 col-lg-7 px-0">
                                    <Form.Control required type="email" placeholder="Neue E-Mail Adresse eingeben..." className="fs-15px bg-gray-light border-0" value={state.email} onChange={setEmailAndCheckEvailable} />
                                </Col>
                                {!isMobile &&
                                <Col className="pr-0">
                                    <Button variant={state.emailAvailable ? "primary": "light"} className={`float-right ${state.emailAvailable ? "text-white" : "text-kurs-grau"}`} disabled={!state.emailAvailable} onClick={() => setState({...state, isChanged: true})}>Speichern</Button>
                                </Col>
                                }
                            </Row>
                        </Form>
                    </Row>
                </Modal.Body>
                <Modal.Footer className={classNames("px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3 py-2 pb-sm-2 pb-md-3 pb-lg-3 pb-xl-3 pt-2 bg-white border-gray-light", {"justify-content-start": !isMobile})}>
                    {isMobile ? mobileFooter : tabletDesktopFooter}
                </Modal.Footer>
            </Modal>
        </>
    )
    const successState = (
        <>
            <Button variant="light" onClick={() => setState({...state, isOpen: true})} className="text-decoration-none d-flex float-right text-blue fs-14px">
                <span>E-Mail Adresse ändern...</span>
            </Button>
            <Modal show={state.isOpen} onHide={() => setState({...state, isOpen: false})} dialogClassName={isMobile ? "modal-sm" : "modal-md"} backdropClassName="modal-z-2__backdrop" animation={false} className="change-email-modal modal-z-2">
                <EmailPasswordModalHeader close={() => setState({...state, isOpen: false})} buttonClassName="pt-0" />
                <Modal.Body className="modal-body bg-white pt-3 pt-sm-3 pt-md-1 pt-lg-1 pt-xl-1 pb-2px mt-0">
                    <Row className="mt-0 mt-sm-0 mt-md-2px mt-lg-2px mt-xl-2px justify-content-center align-items-center gap-10px">
                        <Col className="col-auto pl-0 pr-1">
                            <SvgImage icon="icon_check_hook_green.svg" width="53px" convert={false} />
                        </Col>
                        <Col className="col-auto px-0">
                            <h4 className="roboto-heading fs-18px font-weight-bold line-height-24">Fast fertig.</h4>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <p className="my-0 roboto-regular fs-15px line-height-22px text-center">Sie erhalten in den nächsten Minuten eine E-Mail mit dem Bestätigungslink. Nach Klick auf diesen Link ist der Änderungsvorgang abgeschlossen.</p>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className={classNames("mb-20px px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3 pt-0 pb-0 border-0 bg-white", {"pb-15px": !isMobile})}>
                    <Row className="my-0 w-100 justify-content-center">
                        <Col className="pt-20px col-3 d-flex justify-content-center">
                            <Button variant="primary" className="mt-2px fs-14px text-white" onClick={changeEmail}>Fertig</Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </>
    )
    return (
        <>
            { state.isChanged ? successState : defaultState }
        </>
    )
}

