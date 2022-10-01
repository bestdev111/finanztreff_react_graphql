import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { Portfolio, PortfolioEntry, AssetGroup } from "graphql/types";
import { useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { numberFormatWithSign, quoteFormat } from "utils";
import { DividendEditModal } from "./DividendEditModal";
import { DividendModal } from "./DividendModal";
import './Dividend.scss';

interface DevidendEntriesModalState {
    isNoteShown: boolean
}

export function DevidendEntriesModal(props: DevidendEntriesModalProps) {

    const [isOpen, setOpen] = useState<boolean>(false);
    const handleClose = () => setOpen(false);
    const BUTTON_LABEL: string = props.entry.instrument?.group.assetGroup == AssetGroup.Share ? "Dividende" :
        (props.entry.instrument?.group.assetGroup == AssetGroup.Fund || props.entry.instrument?.group.assetGroup == AssetGroup.Etf) ? "Ausschüttung" :
            props.entry.instrument?.group.assetGroup == AssetGroup.Bond ? "Zinsen" :
                "";
    const [state, setState] = useState<DevidendEntriesModalState>({ isNoteShown: false })
    const entries = props.portfolio.accountEntries?.filter(current => current.instrumentId === props.entry.instrument?.id && current.accountTypeId === 12) || [];

    return (
        <>
            {!!BUTTON_LABEL && <Button variant="inline-inverse" className="mb-0 mr-1" onClick={() => setOpen(true)}>
                {BUTTON_LABEL}
            </Button>
            }
            <Modal show={isOpen} onHide={handleClose} className="modal bottom fade inner-modal modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title={"Erträge"} close={handleClose} />
                    <Modal.Body className="bg-white w-100" style={{ minHeight: "50vh" }}>
                        {entries.length > 0 ?
                            <>
                                <Container className="border-2-border-gray border-bottom">
                                    <Row className="mb-3 align-items-center justify-content-between">
                                        <Button variant={"inline"} className="text-nowrap bg-gray-light py-0 rounded" onClick={() => setState({ ...state, isNoteShown: !state.isNoteShown })}>
                                            <SvgImage icon={"icon_note" + (state.isNoteShown ? "" : "_gray") + ".svg"} width={"27"} spanClass="" />
                                            <span className={classNames("pt-2 fs-14px mr-1 mt-1 font-weight-bold", state.isNoteShown ? "text-dark" : "text-gray")}>Notizen</span>
                                        </Button>
                                        <DividendModal portfolio={props.portfolio} entry={props.entry} onComplete={props.onComplete} >
                                            <Button variant="primary">
                                                <b>+</b> Eintrag hinzufügen
                                            </Button>
                                        </DividendModal>
                                    </Row>
                                </Container>
                                <Container className="mt-3 etrage-table-content">
                                    <Row className="fs-18px font-weight-bold mb-3">
                                        Eingetragene Erträge für {props.entry.name}:
                                    </Row>
                                    {entries.map(current => {
                                        return (
                                            <>
                                                <Row className="border-2-border-gray border-top py-2 align-items-center">
                                                    <Col md={1} xs={3} className="pl-0 pr-3">
                                                        {quoteFormat(current.entryTime)}
                                                    </Col>
                                                    <Col md={2} xs={3} className="pr-0 font-weight-bold text-right">
                                                        {BUTTON_LABEL}
                                                    </Col>
                                                    <Col md={6} className="d-md-inline d-sm-none text-break pl-5">
                                                        {state.isNoteShown && !!current.memo && 
                                                            <Row>
                                                                <Col xs={1} className="pl-0 pr-2">
                                                                    <SvgImage icon={"icon_note" + (state.isNoteShown ? "" : "_gray") + ".svg"} width={"24"} spanClass="py-1 mr-2" />
                                                                </Col>
                                                                <Col className="text-break px-0 pt-1">
                                                                    <i>{current.memo}</i>
                                                                </Col>
                                                            </Row>
                                                        }
                                                    </Col>
                                                    <Col md={2} xs={5} className={classNames("text-right text-nowrap pr-md-0 pr-sm-2 ", current.amount > 0 ? "text-green" : "text-pink")}>
                                                        {numberFormatWithSign(current.amount)} EUR
                                                    </Col>
                                                    <Col md={1} xs={1} className="pr-md-0 pl-0 pr-sm-3 text-right">
                                                        <DividendEditModal portfolio={props.portfolio} entry={current} onComplete={props.onComplete} >
                                                            <SvgImage icon={"icon_menu_horizontal_blue.svg"} spanClass="cursor-pointer" convert={false} width="27" />
                                                        </DividendEditModal>
                                                    </Col>
                                                </Row>
                                                {state.isNoteShown && !!current.memo &&
                                                    <Row className="d-md-none d-sm-flex">
                                                        <Col xs={1} className="pl-0 pr-2">
                                                            <SvgImage icon={"icon_note" + (state.isNoteShown ? "" : "_gray") + ".svg"} width={"24"} spanClass="py-1 mr-2" />
                                                        </Col>
                                                        <Col className="text-break px-0 pt-1">
                                                            <i>{current.memo}</i>
                                                        </Col>
                                                    </Row>
                                                }
                                            </>
                                        )
                                    })

                                    }
                                </Container>
                            </>
                            :
                            <Container className="mt-5 pt-5">
                                <Row>
                                    <Col xs={12} className="text-center">
                                        Noch keine Erträge eingetragen.
                                    </Col>
                                    <Col className="text-center mt-1">
                                        <DividendModal portfolio={props.portfolio} entry={props.entry} onComplete={props.onComplete} >
                                            <Button variant="primary">
                                                <b>+</b> Eintrag hinzufügen
                                            </Button>
                                        </DividendModal>
                                    </Col>
                                </Row>
                            </Container>
                        }
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
}


interface DevidendEntriesModalProps {
    portfolio: Portfolio
    entry: PortfolioEntry
    onComplete: () => void
}