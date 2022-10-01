import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { Button, Modal, Row, Col } from 'react-bootstrap'
import SvgImage from "components/common/image/SvgImage";
import './DeleteAccountModal.scss';
import classNames from 'classnames';
import { useMutation } from '@apollo/client';
import { Mutation } from 'graphql/types';
import { loader } from 'graphql.macro';

export default function DeleteAccountModal(props: any) {
    const [isOpen, setOpen] = React.useState(false)
    const [deleted, setDeleted] = React.useState(false)

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(loader('./deleteAccount.graphql'));
    
    const deleteAccount = () => {
        // console.log("Deleting account...");
        mutation({
            variables: {}
        })
            .then(entry => {
                if (entry.data && entry.data.deleteProfile.responseCode == 0) {
                    setDeleted(true);
                    setOpen(false);
                } else {
                    alert("Error: " + entry.data?.deleteProfile.responseMessage);
                }
            });        
    }
    
    const isMobile = useMediaQuery({
        query: "(max-width: 767px)"
    })
    const isDesktop = useMediaQuery({
        query: "(min-width: 1280px)"
    })

    const mobileButton = (
        <Button variant="" onClick={() => {setOpen(true)}} className="p-0 d-flex align-items-center ml-n2 text-decoration-none text-warning fs-14px ">
            <SvgImage icon="icon_close_blue.svg" width="28px" imgClass="svg-red" convert={true} />
            <span>Benutzerkonto löschen</span>
        </Button>
    )
    const desktopButton = (
        <Button variant="" onClick={() => {setOpen(true)}} className="py-0 d-flex align-items-center ml-n2 text-decoration-none text-warning fs-14px ">
            <SvgImage icon="icon_close_blue.svg" width="28px" imgClass="svg-red" convert={true} />
            <span>Benutzerkonto löschen</span>
        </Button>
    )
    const modalProps: any = {}
    if (isDesktop)
        modalProps.size = "lg"

    return (
        <>
            {isMobile ? mobileButton : desktopButton}
            <Modal show={isOpen} onHide={() => setOpen(false)} onExited={() => props.onExited(deleted)} {...modalProps} className="delete-modal bottom modal-dialog-sky-placement" dialogClassName="center-dialog" backdrop="static">
                <Modal.Header className="px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3 pt-3 pb-0 border-0"> {/*ModalHeaderMeinFinanztreff does not work properly*/}
                    <div className="bg-white w-100">
                        <Row className="flex-nowrap justify-content-between px-0 px-sm-0 px-md-3 px-lg-3 px-xl-3 mx-md-0 mx-sm-0 mx-lg-n3 bg-white rounded-top" style={{ minWidth: "inherit" }}>
                            <span className="font-weight-bold roboto-heading my-auto fs-18px">Benutzerkonto löschen</span>
                            <Button variant="" onClick={() => setOpen(false)} className="d-flex py-0 pr-0 mt-n1 mr-n2 fs-15px text-decoration-none text-blue">
                                <span className="pt-sm-1">schließen</span>
                                <SvgImage icon="icon_close_blue.svg" className="close-modal-butt pb-2" convert={false} width="26" />
                            </Button>
                        </Row>
                    </div>
                </Modal.Header>
                <Modal.Body className="modal-body bg-white px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3 pt-20px pb-3">
                    <Row>
                        <Col className="roboto-regular fs-15px line-height-22px">
                            <p>Hiermit wird das komplette Benutzerkonto mit der E-Mail Adresse "<span className="font-weight-bold">{props.email}</span>" inklusive aller Portfolios, Watchlisten und Limits <span className="font-weight-bold text-warning">unwiederruflich gelöscht</span>.</p>
                            <p className="font-weight-bold text-warning">Dieser Vorgang kann nicht rückgängig gemacht werden!</p>
                            <p className="mb-0">Möchten Sie dennoch fortfahren?</p>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className={classNames("pb-5 px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3 border-0", {"pt-10px": !isMobile, "pt-20px": isMobile})}>
                    <Row className="mt-0 mb-0 mb-sm-0 mb-md-1 mb-lg-1 mb-xl-1 justify-content-end">
                        <Col className="pr-2 col-auto">
                            <Button variant="light" className="text-blue" onClick={() => setOpen(false)}>Abbrechen</Button>
                        </Col>
                        <Col className="px-0 col-auto">
                            <Button variant="warning" className="px-10px d-flex gap-5px text-white" onClick={deleteAccount}>
                                <SvgImage icon="icon_close_white.svg" convert={true} width="12" className="pr-1" imgClass="mb-2px" />
                                Benutzerkonto löschen
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </>
    )
}

