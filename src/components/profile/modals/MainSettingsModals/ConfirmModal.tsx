import classNames from "classnames";
import { useViewport } from "hooks/useViewport";
import { ReactNode } from "react";
import { Button, Modal } from "react-bootstrap";
import { ModalHeaderMeinFinanztreff } from "../ModalHeaderMeinFinanztreff";

export function ConfirmModal(props: ConfirmModalProps) {
    let { width } = useViewport();

    return (
        <Modal show={props.isOpen} onHide={() => props.handleClose()} className="modal-max-width-550 modal-background modal-dialog-sky-placement">
            <ModalHeaderMeinFinanztreff title={props.title} close={() => { props.handleClose() }} />
            <Modal.Body className="modal-body bg-white modal-body-xs-news-profile ">
                <div className="px-auto px-md-0 px-sm-2">
                    {props.text}
                    <Button variant="primary" className="d-flex my-2 ml-auto"
                        data-dismiss-modal="innerModal"
                        onClick={() => {
                            props.handleClose();
                            props.refreshTrigger && props.refreshTrigger();
                        }
                        }
                    >{props.buttonName ? props.buttonName : "OK"}</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

interface ConfirmModalProps {
    title: string | ReactNode
    text: string | ReactNode
    isOpen: boolean;
    width?: string;
    buttonName?: string;
    handleClose: () => void;

    refreshTrigger?: () => void;
}
