import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { Button, Modal, Row, Col } from 'react-bootstrap'
import SvgImage from "components/common/image/SvgImage";
import classNames from 'classnames';
import EmailPasswordModalHeader from './EmailPasswordModalHeader';
import './ChangePasswordModal.scss';
import { loader } from 'graphql.macro';
import { Mutation } from 'graphql/types';
import { useMutation } from '@apollo/client';

export default function ChangePasswordModal() {
    const [isOpen, setOpen] = React.useState(false);

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(loader('./changePassword.graphql'));

    const changePassword = () => {
        // console.log("Change password ...");
        mutation({
            variables: {
                password: ""
            }
        })
            .then(entry => {
                if (entry.data && entry.data.changeProfilePassword.responseCode == 0) {
                    setOpen(false);
                } else {
                    alert("Error: " + entry.data?.changeProfilePassword.responseMessage);
                }
            });
    } 

    const isMobile = useMediaQuery({
        query: "(max-width: 767px)"
    })
    return (
        <>
            <Button variant="light" onClick={() => setOpen(true)} className={classNames("text-decoration-none d-flex text-blue fs-14px", {'float-right': !isMobile})}>
                <span>Passwort ändern...</span>
            </Button>
            <Modal show={isOpen} onHide={() => setOpen(false)} dialogClassName={isMobile ? "modal-sm" : "modal-md"} backdropClassName="modal-z-2__backdrop" className="change-password-modal fade modal-z-2">
                <EmailPasswordModalHeader close={() => setOpen(false)}/>
                <Modal.Body className={classNames("modal-body pt-md-1 pt-lg-1 pt-xl-1 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3 pb-3 bg-white", {"pt-20px": isMobile})}>
                    <Row className={classNames("justify-content-center gap-10px", {"align-items-baseline": isMobile, "align-items-center": !isMobile})}>
                        <Col className="col-auto pl-0 pr-1">
                            <SvgImage icon="icon_check_hook_green.svg" width="53px" convert={false} />
                        </Col>
                        <Col className="col-8 px-0">
                            <h4 className="m-0 roboto-heading fs-18px font-weight-bold line-height-24">Bestätigungs E-Mail versandt!</h4>
                        </Col>
                    </Row>
                    <Row className="mt-3 pt-1 pt-sp-1 pt-pd-0 pt-lg-0 pt-xl-1">
                        <Col>
                            <p className={classNames("my-0 roboto-regular fs-15px line-height-20px", {"text-center": !isMobile})}><span className="font-weight-bold">Sie erhalten in wenigen Minuten eine E-Mail mit Ihrem persönlichen Bestätigungs-Link.</span><br/><br/>Danach können Sie ein neues Passwort vergeben.</p>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="bg-white border-0 pt-1 pb-0 pb-sm-0 pb-md-1 pb-lg-1 pb-xl-2 mb-20px ">
                    <Row className="mx-0 mt-0 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-2 mb-0 w-100 justify-content-center">
                        <Col className="col-auto">
                            <Button variant="primary" className="fs-14px text-white" onClick={changePassword}>Fertig</Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </>
    )
}

