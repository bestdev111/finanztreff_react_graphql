import { useMutation } from "@apollo/client";
import { PortfolioInstrumentAddPurchaseDate } from "components/common/profile/PortfolioInstrumentAdd/PortfolioInstrumentAddPurchaseDate";
import { PORTFOLIO_ENTRY_DELETE, PORTFOLIO_ENTRY_REMOVE } from "components/profile/query";
import { preformatFloat } from "components/profile/utils";
import { Mutation, Portfolio, PortfolioEntry } from "generated/graphql";
import moment from "moment";
import { ReactNode, useState } from "react"
import { Button, Col, Container, FormControl, Modal, Row, Spinner } from "react-bootstrap";
import { ModalHeaderMeinFinanztreff } from "../ModalHeaderMeinFinanztreff";
import { ConfirmModal } from "./ConfirmModal";


export function RemovePositionModal(props: RemovePositionModalProps) {

    let [state, setState] = useState<RemovePositionModalState>({
        isRemoveModalOpen: false,
        isDeleteModalOpen: false,
        isModalOpen: false,
        purchaseDate: moment(),
        value: undefined,
    });
    const handleDeleteModalOpen = () => {
        setState({ ...state, isDeleteModalOpen: false, isModalOpen: false });
        if (props.handleClose) {
            props.handleClose();
        }
    };
    const handleRemoveModalOpen = () => {
        setState({ ...state, isRemoveModalOpen: false, isModalOpen: false });
        if (props.handleClose) {
            props.handleClose();
        }
    };

    const validRemoveForm = !!state.purchaseDate && (!!state.value || state.value === 0);

    return (
        <>
            <span onClick={() => setState({ ...state, isModalOpen: true })}>
                {props.children}
            </span>
            <Modal show={state.isModalOpen} onHide={() => setState({ ...state, isModalOpen: false })} className="bottom modal-background modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title="Löschen oder Ausbuchen" close={() => setState({ ...state, isModalOpen: false })} />
                    <Modal.Body className="modal-body bg-white fs-15px">
                        <Container>
                            <Row>
                                <p className="">
                                    Um
                                    <span className="font-weight-bold mx-1">{props.entry.name || ""}</span>
                                    zu entfernen, können Sie es entweder ausbuchen,
                                    oder den Eintrag inkl. Historie vollständig löschen.
                                    Achtung - das löschen der Historie kann zu Problemen in der Portfolioauswertung führen.
                                </p>
                            </Row>
                            <Row className="mt-xl-4 mt-lg-4 mt-md-4 mt-sm-4">
                                <Col xl={6} lg={6} className="mt-sm-3">
                                    <Row className="align-items-center">
                                        <Col className="px-0">
                                            Ausbuchungs-Datum
                                        </Col>
                                        <Col className="px-0 mr-xl-3 mr-lg-3 mr-md-0">
                                            <PortfolioInstrumentAddPurchaseDate
                                                className="bg-gray-light border-gray-light line-height-1"
                                                callback={date => setState({ ...state, purchaseDate: date.value })}
                                                value={state.purchaseDate}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xl={6} lg={6} className="mt-sm-3">
                                    <Row className="align-items-center">
                                        <Col className="px-0 ml-xl-3 ml-lg-3 ml-md-0">
                                            Ausbuchungs-Summe
                                        </Col>
                                        <Col className="px-0">
                                            <FormControl className="form-control form-control-sm text-right bg-gray-light border-gray-light"
                                                placeholder="EUR"
                                                type="number"
                                                value={state.value}
                                                onChange={control => setState({ ...state, value: Number.parseFloat(preformatFloat(control.target.value)) })}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="text-right px-0 d-xl-none d-lg-none d-md-block d-sm-block text-right mt-3">
                                    <Button variant="pink" className="with-icon-first align-items-center" onClick={() => setState({ ...state, isRemoveModalOpen: true })} disabled={!validRemoveForm}>
                                        <span className="svg-icon px-1">
                                            <img src="/static/img/svg/icon_ausbuchen_white.svg" width="30" className="py-n1 mx-n2 my-n2 mt-n3 pt-1 " alt="" />
                                        </span>
                                        <span className="ml-2  fs-14px">Ausbuchen</span>
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="mt-5">
                                <Col xl={6} lg={6} md={6} sm={6} className="px-0">
                                    <button className="btn btn-pink with-icon-first fs-14px" onClick={() => setState({ ...state, isDeleteModalOpen: true })}>
                                        <span className="svg-icon pr-1">
                                            <img src="/static/img/svg/icon_close_white.svg" width="" className="" alt="" />
                                        </span>
                                        Löschen
                                    </button>
                                </Col>
                                <Col xl={6} lg={6} md={6} sm={6} className="text-right px-0">
                                    <button className="btn btn-primary bg-border-gray text-blue border-border-gray fs-14px mr-xl-2 mr-lg-2 mr-md-2 mr-sm-0" onClick={() => setState({ ...state, isModalOpen: false })}
                                        submit-type="">
                                        Abbrechen
                                    </button>
                                    <Button variant="pink" className="with-icon-first align-items-center d-xl-inline-block d-lg-inline-block d-md-inline-block d-sm-none" onClick={() => setState({ ...state, isRemoveModalOpen: true })} disabled={!validRemoveForm}>
                                        <span className="svg-icon px-1">
                                            <img src="/static/img/svg/icon_ausbuchen_white.svg" width="30" className="py-n1 mx-n2 my-n2 mt-n3 pt-1 " alt="" />
                                        </span>
                                        <span className="ml-2  fs-14px">Ausbuchen</span>
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </div>
            </Modal>
            {state.isRemoveModalOpen &&
                <RemoveModal handleClose={handleRemoveModalOpen} portfolio={props.portfolio} entry={props.entry} amount={state.value || 0} date={state.purchaseDate.format()}
                    isOpen={state.isRemoveModalOpen} refreshTrigger={props.refreshTrigger} />
            }
            {state.isDeleteModalOpen &&
                <DeleteModal handleClose={handleDeleteModalOpen} portfolio={props.portfolio} entry={props.entry}
                    isOpen={state.isDeleteModalOpen} refreshTrigger={props.refreshTrigger} />
            }
        </>
    );
}

export function RemoveModal(props: RemovePositionModalProps & { isOpen: boolean, handleClose: () => void, amount: number, date: any }) {

    let [state, setState] = useState<RemoveModalState>({
        isDoneOpen: false,
        isModalOpen: true
    });

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(PORTFOLIO_ENTRY_REMOVE);

    return (
        <>
            <Modal show={props.isOpen && state.isModalOpen} onHide={props.handleClose} className="bottom modal-background modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title="Ausbuchen" close={props.handleClose} />
                    <Modal.Body className="bg-white w-100">
                        <p className="">Hiermit wird <span className="font-weight-bold">{props.entry?.instrument?.name ? props.entry?.instrument?.name : props.entry.name}</span> aus Ihrem Portfolio "<span
                            className="font-weight-bold">{props.portfolio.name}</span>" ausgebucht.<br />Möchten Sie fortfahren?</p>
                        <div className="button-row d-flex justify-content-end">
                            <button className="btn btn-primary bg-border-gray text-blue border-border-gray" onClick={props.handleClose}
                                submit-type="">
                                Abbrechen
                            </button>
                            <button className="btn btn-pink with-icon-first" onClick={() => {
                                const id = props.entry.id;
                                mutation({
                                    variables: {
                                        portfolioId: props.portfolio.id,
                                        portfolioEntryId: props.entry.id,
                                        amount: props.amount,
                                        date: props.date
                                    },
                                    update(cache) {
                                        const normalizedId = cache.identify({ id, __typename: 'PortfolioEntry' });
                                        cache.evict({ id: normalizedId });
                                        cache.gc();
                                    }
                                })
                                    .then(() => {
                                        setState({
                                            ...state,
                                            isModalOpen: false,
                                            isDoneOpen: true
                                        });
                                    });
                            }} submit-type="">
                                <span className="svg-icon pr-1">
                                    <img src="/static/img/svg/icon_ausbuchen_white.svg" width="30" className="py-n1 mx-0 my-n2 mt-n3 pt-1 " alt="" />
                                </span>
                                {mutationLoading && <Spinner animation="border" />}
                                Ausbuchen
                            </button>
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
            <ConfirmModal title="Ausbuchen" text="Ihr Wertpapier wurde erfolgreich ausgebucht." isOpen={state.isDoneOpen} handleClose={props.handleClose} refreshTrigger={props.refreshTrigger} />
        </>
    );
}

export function DeleteModal(props: RemovePositionModalProps & { isOpen: boolean, handleClose: () => void }) {

    let [state, setState] = useState<RemoveModalState>({
        isDoneOpen: false,
        isModalOpen: true
    });

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(PORTFOLIO_ENTRY_DELETE);

    return (
        <>
            <Modal show={props.isOpen && state.isModalOpen} onHide={props.handleClose} className="bottom modal-background modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title="Löschen bestätigen" close={props.handleClose} />
                    <Modal.Body className="bg-white w-100">
                        <p className="">Hiermit wird <span className="font-weight-bold">{props.entry?.instrument?.name ? props.entry?.instrument?.name : props.entry.name}</span> unwiderruflich aus Ihrem Portfolio "<span
                            className="font-weight-bold">{props.portfolio.name}</span>" gelöscht.<br />Möchten Sie fortfahren?</p>

                        <div className="button-row d-flex justify-content-end">
                            <button className="btn btn-primary bg-border-gray text-blue border-border-gray" onClick={props.handleClose}
                                submit-type="">
                                Abbrechen
                            </button>
                            <button className="btn btn-pink with-icon-first" onClick={() => {
                                const id = props.entry.id;
                                mutation({
                                    variables: {
                                        portfolioId: props.portfolio.id,
                                        portfolioEntryId: props.entry.id
                                    },
                                    update(cache) {
                                        const normalizedId = cache.identify({ id, __typename: 'PortfolioEntry' });
                                        cache.evict({ id: normalizedId });
                                        cache.gc();
                                    }
                                })
                                    .then(() => {
                                        setState({
                                            ...state,
                                            isModalOpen: false,
                                            isDoneOpen: true
                                        });
                                    });
                            }} submit-type="">
                                <span className="svg-icon pr-1">
                                    <img src="/static/img/svg/icon_close_white.svg" width="" className="" alt="" />
                                </span>
                                {mutationLoading && <Spinner animation="border" />}
                                Löschen
                            </button>
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
            <ConfirmModal title="Löschen" text="Ihr Wertpapier wurde erfolgreich gelöscht." isOpen={state.isDoneOpen} handleClose={props.handleClose} refreshTrigger={props.refreshTrigger} />
        </>
    );
}

interface RemovePositionModalProps {
    portfolio: Portfolio;
    entry: PortfolioEntry
    refreshTrigger?: () => void;
    handleClose?: () => void;
    children?: ReactNode
}

interface RemovePositionModalState {
    isRemoveModalOpen: boolean
    isDeleteModalOpen: boolean
    isModalOpen: boolean
    purchaseDate: moment.Moment
    value?: number
}

interface RemoveModalState {
    isDoneOpen: boolean
    isModalOpen: boolean
}