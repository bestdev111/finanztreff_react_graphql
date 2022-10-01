import SvgImage from "components/common/image/SvgImage";
import { useState } from "react";
import { Button, Modal, Row } from "react-bootstrap";
import './FindIndexSection.scss';
import { InstrumentGroup } from "generated/graphql";
import { IndexCompositionComponent } from "components/Assets/IndexPage/IndexComposition/IndexCompositionComponent";

interface IndexCompositionModalProps{
    group: InstrumentGroup;
}

export function IndexCompositionModal(props: IndexCompositionModalProps) {
    const [state, setState] = useState({ isOpen: false });

    const openModal = () => setState({ ...state, isOpen: true });
    const closeModal = () => setState({ ...state, isOpen: false });

    return (
        <>
            <Button variant={ props.group.compositions.length>0 ? 'inline-action' : "inline-action in-active"} className="p-0" onClick={() => openModal()}>
                <SvgImage icon={props.group.compositions.length>0 ? "icon_list_blue.svg" : "icon_list_lightgrey.svg"} imgClass={"mx-0"}
                    spanClass="fire-icon" convert={false} width="25" />
                    Einzelwerte
            </Button>
            <Modal
                show={state.isOpen && props.group.compositions.length>0}
                onHide={closeModal}
                dialogClassName="index-composition-modal"
                className="modal-dialog-sky-placement"
            >
                <Modal.Header>
                    <Row className="row-cols-1">
                        <div className="col d-flex justify-content-between">
                            <Modal.Title>
                                <h5>
                                    <span>{props.group.name} Einzelwerte </span>
                                </h5>
                            </Modal.Title>
                            <button type="button" className="close text-blue" onClick={closeModal}>
                                <span>schließen</span>
                                <SvgImage icon="icon_close_blue.svg" width={"27"} spanClass="close-modal-butt"
                                    imgClass="svg-blue" convert={false} />
                            </button>
                        </div>
                    </Row>
                </Modal.Header>
                <Modal.Body>
                    { props.group?.compositions && <IndexCompositionComponent group={props.group} showOtherIndicesButton={false} />}
                </Modal.Body>
            </Modal>
        </>
    )
}