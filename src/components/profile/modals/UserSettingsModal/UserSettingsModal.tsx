import keycloak from "keycloak";
import React, {ReactElement} from 'react'
import { useMediaQuery } from 'react-responsive'
import { Button, Modal, Row, Col } from 'react-bootstrap'
import { ModalHeaderMeinFinanztreff } from '../ModalHeaderMeinFinanztreff';
import SvgImage from "components/common/image/SvgImage";
import ChangeEmailModal from './ChangeEmailModal';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';
import './UserSettingsModal.scss';
import classNames from "classnames";

export default function UserSettingsModal(props: {control?: ReactElement<{ onClick: () => void}>}) {
    const [isOpen, setOpen] = React.useState(false)
    const [accountDeleteConfirmationModalIsOpen, setAccountDeleteConfirmationModalIsOpen] = React.useState(false)
    const [emailChangeRequestPending, setEmailChangeRequestPending ] = React.useState(false)
    const [passwordChangeRequestPending, setPasswordChangeRequestPending ] = React.useState(false)

    const {control = (
        <Button variant="link" className="pl-0 d-inline-flex align-items-center font-weight-bold text-color-blue">
            <SvgImage icon="icon_gear.svg" width="22px" imgClass="svg-blue mr-5px" convert={true} className="mr-5px"/>
            Benutzer-Einstellungen
        </Button>
    )} = props

    const isMobile = useMediaQuery({
        query: "(max-width: 767px)"
    })
    const isTablet = useMediaQuery({
        query: "(max-width: 1280px)"
    })

    const header = (
        <Modal.Header className="px-2 px-sm-2 px-md-2 px-lg-2 px-xl-3 pb-3 pt-10px border-border-gray"> {/*ModalHeaderMeinFinanztreff does not work properly*/}
            <div className="bg-white w-100">
                <Row className={classNames("mb-0 mx-0 mt-0 mt-sm-0 mt-md-1 mt-lg-1 mt-xl-1 flex-nowrap bg-white rounded-top", {'justify-content-between': !isMobile})} style={{ minWidth: "inherit" }}>
                    <span className="font-weight-bold roboto-heading my-auto fs-18px">Mein finanztreff - Einstellungen</span>
                    <Button variant="" onClick={() => setOpen(false)} className="align-items-center text-decoration-none d-flex text-blue fs-15px py-0 pr-0 mr-n2">
                        <span className="pt-1 pt-sm-1 pt-md-0 pt-lg-0 pt-xl-0">schließen</span>
                        <SvgImage icon="icon_close_blue.svg" convert={false} width="26" />
                    </Button>
                </Row>
            </div>
        </Modal.Header>
    )
    const desktopTabletBody = (
        <Modal.Body className="pt-md-2 pt-lg-2 pt-xl-2 px-2 px-sm-2 px-md-2 px-lg-2 px-xl-3 modal-body bg-white">
            <Row className="mt-md-1 mt-lg-1 mt-xl-1">
                <Col className="font-weight-bold roboto-heading my-auto text-truncate fs-18px">
                    Benutzerkonto
                </Col>
            </Row>
            <Row className="mt-20px align-items-center">
                <Col className="col-lg-2 pr-1 fs-15px">
                    E-Mail Adresse:
                </Col>
                <Col className="pl-4 font-weight-bold fs-15px">
                    {keycloak.authenticated && (keycloak?.idTokenParsed as any).email}
                </Col>
                <Col className="col-lg-4">
                    <ChangeEmailModal />
                </Col>
            </Row>
            {emailChangeRequestPending &&
            <Row className="mt-n2">
                <Col className="col-lg-2 pr-1">
                </Col>
                <Col className="pl-4">
                    <span className="fs-13px text-warning">Neue E-Mail Adresse ist angefordert.</span>
                </Col>
                <Col className="col-lg-4">
                </Col>
            </Row>
            }
            <Row className="mt-md-3 mt-lg-3 mt-xl-3 align-items-center">
                <Col className="col-lg-2 pr-1 fs-15px">
                    Passwort:
                </Col>
                <Col className="pl-4 fs-15px">
                    *************
                </Col>
                <Col className="col-lg-4">
                    <ChangePasswordModal />
                </Col>
            </Row>
            {passwordChangeRequestPending &&
            <Row className="mt-n2">
                <Col className="col-lg-2 pr-1">
                </Col>
                <Col className="pl-4 fs-13px text-warning">
                    Neues Passwort ist angefordert.
                </Col>
                <Col className="col-lg-4">
                </Col>
            </Row>
            }
            <Row className="mt-md-4 mt-lg-4 mt-xl-4 mb-md-3 mb-lg-3 mb-xl-3">
                <Col className="pt-md-2 pt-lg-2 pt-xl-2 px-0">
                    <DeleteAccountModal email={keycloak.authenticated && (keycloak?.idTokenParsed as any).email} onExited={(accountDeleted: boolean) => {console.log(accountDeleted); if (accountDeleted) setAccountDeleteConfirmationModalIsOpen(true)}} />
                </Col>
            </Row>
        </Modal.Body>
    )
    const desktopTabletFooter = (
        <Modal.Footer className="pt-md-3 pt-lg-3 pt-xl-3 pb-md-2 pb-lg-2 pb-xl-3 px-md-2 px-lg-2 px-xl-3 border-border-gray bg-white">
            <Row className="m-0 justify-content-end">
                <Button variant="primary" className="m-0 fs-14px text-white" onClick={() => setOpen(false)}>Schließen</Button>
            </Row>
        </Modal.Footer>
    )
    const deleteConfirmModal = (
        <Modal show={accountDeleteConfirmationModalIsOpen} onHide={() => setAccountDeleteConfirmationModalIsOpen(false)} backdropClassName="modal-z-2__backdrop" className="delete-confirm-modal fade modal-z-2">
            <ModalHeaderMeinFinanztreff close={() => setAccountDeleteConfirmationModalIsOpen(false)} title="" />
            <Modal.Body className="modal-body px-1 px-sm-1 px-md-3 px-lg-3 px-xl-3 pt-3 pt-md-0 pt-lg-0 pt-xl-0 pb-3 bg-white">
                <Row className="justify-content-center align-items-center">
                    <Col className="col-auto mr-2 p-0">
                        <SvgImage icon="icon_check_hook_green.svg" width="53px" convert={false} />
                    </Col>
                    <Col className={classNames("col-auto ml-0 ml-sm-0 ml-md-1 ml-lg-1 ml-xl-1 pl-0", {'pl-2px': !isMobile} )}>
                        <h4 className="m-0 roboto-heading fs-18px font-weight-bold line-height-24">Benutzerkonto gelöscht</h4>
                    </Col>
                </Row>
                <Row className="mx-sm-0 mt-3 pt-2px pt-sm-2px pt-md-0 pt-lg-0 pt-xl-0"> 
                    <Col className="px-0 roboto-regular fs-15 line-height-20px text-center">
                        <p className="my-0">Vielen Dank, dass Sie registrierter Nutzer von "Mein finanztreff" waren. Schade, dass Sie uns verlassen. Sie können sich jederzeit erneut registrieren.</p>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className={classNames("mb-20px pt-1 border-0 bg-white", {"pb-10px": isMobile, "pb-15px": !isMobile})}>
                <Row className={classNames("mx-0 mb-0 mt-2px w-100 justify-content-center")}>
                    <Col className="col-auto p-0">
                        <Button variant="primary" className="fs-14px text-white" onClick={() => setAccountDeleteConfirmationModalIsOpen(false)}>Fertig</Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    )
    const desktopModal = (
        <>
            {React.cloneElement(control, {onClick: () => setOpen(true)})}
            <Modal show={isOpen} onHide={() => setOpen(false)} className="profile-settings-modal" size="lg" animation={true}>
                {header}
                {desktopTabletBody}
                {desktopTabletFooter}
            </Modal>
            {deleteConfirmModal}
        </>
    )
    const tabletModal = (
        <>
            {React.cloneElement(control, {onClick: () => setOpen(true)})}
            <Modal show={isOpen} onHide={() => setOpen(false)} className="profile-settings-modal fade modal-dialog-sky-placement">
                {header}
                {desktopTabletBody}
                {desktopTabletFooter}
            </Modal>
            {deleteConfirmModal}
        </>
    )
    const mobileModal = (
        <>
            {React.cloneElement(control, {onClick: () => setOpen(true)})}
            <Modal show={isOpen} onHide={() => setOpen(false)} className="profile-settings-modal fade modal-dialog-sky-placement">
                {header}
                <Modal.Body className="px-2 px-sm-2 pt-2 pt-sm-2 pb-3 pb-sm-3 modal-body bg-white">
                    <Row className="mt-sm-1 mb-sm-3">
                        <Col className="font-weight-bold roboto-heading my-auto text-truncate fs-18px">
                            Benutzerkonto
                        </Col>
                    </Row>
                    <Row className="mb-sm-3">
                        <Col className="col-12 mb-sm-2 fs-15px">
                            E-Mail Adresse:
                        </Col>
                        <Col className="col-12">
                            <Row>
                                <Col className="font-weight-bold fs-15px mb-sm-2px">
                                    {keycloak.authenticated && (keycloak?.idTokenParsed as any).email}
                                </Col>
                                {emailChangeRequestPending &&
                                <Col className="pending-request col-12 mb-sm-3 fs-13px text-warning">
                                    Neue E-Mail Adresse ist angefordert.
                                </Col>
                                }
                            </Row>
                        </Col>
                        <Col className="col-12">
                            <ChangeEmailModal />
                        </Col>
                    </Row>
                    <Row className="pb-sm-2">
                        <Col className="col-12 mb-sm-2 fs-15px">
                            Passwort:
                        </Col>
                        <Col className="col-12">
                            <Row className="mb-sm-3">
                                <Col className="col-12 fs-15px">
                                    *************
                                </Col>
                                {passwordChangeRequestPending &&
                                <Col className="pending-request d-flex col-12 mt-sm-2px fs-13px text-warning">
                                    Neues Passwort ist angefordert.
                                </Col>
                                }
                            </Row>
                        </Col>
                        <Col className="col-12">
                            <ChangePasswordModal />
                        </Col>
                    </Row>
                    <Row className="mt-4 mt-sm-4 mb-3 mb-sm-3">
                        <Col>
                            <DeleteAccountModal email={keycloak.authenticated && (keycloak?.idTokenParsed as any).email} onExited={(accountDeleted: boolean) => {console.log(accountDeleted); if (accountDeleted) setAccountDeleteConfirmationModalIsOpen(true)}} />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="pt-3 pt-sm-3 pb-2 pb-sm-2 px-2 border-border-gray bg-white">
                    <Row className="m-0 justify-content-end">
                        <Button variant="primary" className="m-0 fs-14px text-white" onClick={() => setOpen(false)}>Schließen</Button>
                    </Row>
                </Modal.Footer>
            </Modal>
            {deleteConfirmModal}
        </>
    )
    return isMobile ? mobileModal : isTablet ? tabletModal : desktopModal
}

