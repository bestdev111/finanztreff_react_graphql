import { useMutation } from "@apollo/client";
import classNames from "classnames";
import { PortfolioInstrumentAddPurchaseDate } from "components/common/profile/PortfolioInstrumentAdd/PortfolioInstrumentAddPurchaseDate";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { PORTFOLIO_ENTRY_SPLIT } from "components/profile/query";
import { getAssetGroup, preformatFloat } from "components/profile/utils";
import { AssetGroup, Mutation, Portfolio, PortfolioEntry } from "graphql/types";
import moment from "moment";
import { useState } from "react";
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { numberFormat, quoteFormat } from "utils";
import { ConfirmModal } from "./ConfirmModal";

export function SplitAssetModal(props: SplitAssetModalProps) {

    const [isOpen, setOpen] = useState<boolean>(false);
    const handleClose = () => setOpen(false);
    return (
        <>
            <Button variant="inline-inverse" className=" mb-0 mr-2" onClick={() => setOpen(true)} >
                Split
            </Button>
            <Modal show={isOpen} onHide={handleClose} className="bottom modal-background modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title={getAssetGroup(props.entry.instrument?.group.assetGroup) + "split"} close={handleClose} />
                    <Modal.Body className="bg-white modal-body w-100">
                        <ExposeModalBody portfolio={props.portfolio} entry={props.entry} onComplete={props.onComplete} handleClose={handleClose} />
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
}
interface SplitAssetModalProps {
    portfolio: Portfolio;
    entry: PortfolioEntry;
    onComplete: () => void;
}

interface ExposeModalBodyState {
    from: number
    to: number
    splitTime: moment.Moment
}

function ExposeModalBody({ entry, portfolio, onComplete, handleClose }: SplitAssetModalProps & { handleClose: () => void }) {
    const [state, setState] = useState<ExposeModalBodyState>({
        from: 0,
        to: 0,
        splitTime: moment(),
    });

    const [isDoneOpen, setDoneOpen] = useState<boolean>(false);
    const handleDoneClose = () => { setDoneOpen(false); handleClose() };

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(PORTFOLIO_ENTRY_SPLIT);

    let validForm = state.to && state.from && state.to !== state.from;

    const buyRateAfterSplitting = state.to && state.from ? entry.price * state.from / state.to : 0;
    const volumeAfterSplit = state.to && state.from ? entry.quantity * state.to / state.from : 0;
    const sum = buyRateAfterSplitting * volumeAfterSplit;

    return (
        <>
            <Container className="px-3">
                <Form className="modal-form input-bg my-4">
                    <Row className="row-cols-lg-2 row-cols-sm-1">
                        <Col className="mb-4 px-0">
                            Sie haben am {quoteFormat(entry.entryTime)} <b>{entry.quantity} Stück</b> "{entry.name}" zu einem
                            <b> Kaufkurs von {entry.price} EUR</b> in Ihr Portfolio "{portfolio.name}" aufgenommen.
                            <br />Um einen Aktiensplit durchzuführen, nutzen Sie bitte das folgende Formular.
                        </Col>
                        <Col>
                            <Form.Group as={Row} className="form-group justify-content-end align-items-center">
                                <Form.Label as={Col} className="col-sm-5 text-right pr-0">Verhältnis</Form.Label>
                                <InputGroup as={Col} className="col-sm-3 pr-0">
                                    <FormControl className={classNames("form-control form-control-sm text-right", (state.from === state.to || state.from === 0) && "border-pink")}
                                        min='0'
                                        placeholder={numberFormat(state.from).toString()}
                                        value={state.from}
                                        type="number"
                                        onChange={control => setState({ ...state, from: Number.parseFloat(preformatFloat(control.target.value)) })}
                                    />
                                </InputGroup>
                                <Form.Label as={Col} className="col-sm-1 text-right pr-0">zu</Form.Label>
                                <InputGroup as={Col} className="col-sm-3 pr-0">
                                    <FormControl className={classNames("form-control form-control-sm text-right", (state.from === state.to || state.to === 0) && "border-pink")}
                                        min='0'
                                        placeholder={numberFormat(state.to).toString()}
                                        value={state.to}
                                        type="number"
                                        onChange={control => setState({ ...state, to: Number.parseFloat(preformatFloat(control.target.value)) })}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Row} className="justify-content-end align-items-center">
                                <Form.Label as={Col} className="text-right pr-0">Datum</Form.Label>
                                <Col className="col-sm-7 pr-0">
                                    <PortfolioInstrumentAddPurchaseDate
                                        callback={date => setState({ ...state, splitTime: date.value })}
                                        value={moment(state.splitTime)}
                                    />
                                </Col>
                            </Form.Group>
                            <Row className="justify-content-between font-weight-bold pt-2">
                                <Col className="col-sm-6">Kaufkurs nach Split</Col>
                                <Col className="col-sm-6 text-right">
                                    {numberFormat(buyRateAfterSplitting)} EUR
                                </Col>
                            </Row>
                            <Row className="justify-content-between font-weight-bold">
                                <Col className="col-sm-6">Stück nach Split</Col>
                                <Col className="col-sm-6 text-right">
                                    {volumeAfterSplit}
                                </Col>
                            </Row>
                            <Row className="justify-content-between font-weight-bold pt-2">
                                <Col className="col-sm-6">Summe</Col>
                                <Col className="col-sm-6 text-right">
                                    {numberFormat(sum)} EUR
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>

                <Row className="justify-content-end my-2">
                    <Button variant='inline-inverse' className="mb-0 mr-1" onClick={handleClose}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" disabled={!(validForm)}
                        onClick={() => {
                            mutation({
                                variables: {
                                    entry: {
                                        portfolioId: portfolio.id,
                                        portfolioEntryId: entry.id,
                                        from: state.from,
                                        to: state.to,
                                        splitTime: state.splitTime.format()
                                    }
                                }
                            })
                                .then(() => {
                                    onComplete();
                                    setDoneOpen(true);
                                });
                        }}
                    >
                        {mutationLoading && <Spinner animation="border" />}
                        Speichern
                    </Button>
                </Row>
            </Container>
            {isDoneOpen &&
                <ConfirmModal title="Split" text="Ihr Split wurde erfolgreich hinterlegt." isOpen={isDoneOpen} handleClose={handleDoneClose} />
            }
        </>
    );
}