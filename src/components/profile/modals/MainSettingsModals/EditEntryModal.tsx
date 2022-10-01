import { useState } from 'react';
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { Mutation, Portfolio, PortfolioEntry } from 'graphql/types';
import { numberFormat } from 'utils';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { PortfolioInstrumentAddPurchaseDate } from 'components/common/profile/PortfolioInstrumentAdd/PortfolioInstrumentAddPurchaseDate';
import { PORTFOLIO_ENTRY_EDIT } from 'components/profile/query';
import { calculatePurchase, formatNumberDE, processNumeric} from 'components/profile/utils';
import { ModalHeaderMeinFinanztreff } from 'components/profile/modals/ModalHeaderMeinFinanztreff';
import classNames from 'classnames';
import { ConfirmModal } from './ConfirmModal';
import { compact } from 'underscore';

export function EditEntryModal(props: EditModalProps) {

    const [isOpen, setOpen] = useState<boolean>(false);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button variant="primary" className="mr-2" onClick={() => setOpen(true)} >
                Bearbeiten
            </Button>
            <Modal show={isOpen} onHide={handleClose} className="bottom modal-background modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title="Bearbeiten" close={handleClose} />
                    <Modal.Body className="bg-white w-100">
                        <ExposeModalBody portfolio={props.portfolio} entry={props.entry} onComplete={props.onComplete} handleClose={handleClose} />
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
}
interface EditModalProps {
    portfolio: Portfolio;
    entry: PortfolioEntry;
    onComplete: () => void;
}

interface ExposeModalBodyState {
    entryTime: any;
    price: number;
    priceBox: string;
    quantity: number;
    quantityBox: string;
    buyCharges: number;
    buyChargesBox: string;
    memo?: string;
}

function ExposeModalBody({ entry, portfolio, onComplete, handleClose }: EditModalProps & { handleClose: () => void }) {
    const [state, setState] = useState<ExposeModalBodyState>({
        entryTime: entry.entryTime,
        price: entry.price,
        priceBox: formatNumberDE(entry.price),
        quantity: entry.quantity,
        quantityBox: formatNumberDE(entry.quantity),
        buyCharges: entry.buyCharges,
        buyChargesBox: formatNumberDE(entry.buyCharges),
        memo: entry.memo ? entry.memo : undefined
    });

    const [isDoneOpen, setDoneOpen] = useState<boolean>(false);
    const handleDoneClose = () => { setDoneOpen(false); handleClose() };

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(PORTFOLIO_ENTRY_EDIT);

    let validForm = (state.entryTime !== entry.entryTime ||
        state.price !== entry.price ||
        state.quantity !== entry.quantity ||
        state.buyCharges !== entry.buyCharges || (state.memo && state.memo !== entry.memo)) && state.quantity !== 0 && state.price !== 0;

    return (
        <>
            <Container className="px-0">
                <Form className="modal-form input-bg">
                    <Row className="row-cols-lg-2 row-cols-sm-1 pr-3">
                        <Col>
                            <Form.Group as={Row} className="justify-content-end align-items-center">
                                <Form.Label as={Col} className="text-right pr-0">Börsenplatz</Form.Label>
                                <InputGroup as={Col} className="col-sm-7 pr-0">
                                    <FormControl disabled type="text" className="form-control form-control-sm text-right"
                                        value={entry.instrument?.exchange.name || ""}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Row} className="justify-content-end align-items-center">
                                <Form.Label as={Col} className="text-right pr-0">Kaufdatum</Form.Label>
                                <Col className="col-sm-7 pr-0">
                                    <PortfolioInstrumentAddPurchaseDate
                                        callback={date => setState({ ...state, entryTime: date.value })}
                                        value={moment(state.entryTime)}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group as={Row} className="form-group justify-content-end align-items-center">
                                <Form.Label as={Col} className="text-right pr-0">Kaufkurs</Form.Label>
                                <InputGroup as={Col} className="col-sm-7 pr-0">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="py-0">{entry?.instrument?.currency?.displayCode || ""}</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl className={classNames("form-control form-control-sm text-right", state.price === 0 && "border-pink")}
                                        id="editPrice"
                                        placeholder={numberFormat(state.price).toString()}
                                        value={state.priceBox}
                                        type="text"
                                        onChange={control => {
                                            const result = processNumeric(control.target.value);
                                            if (result[1] != null) {
                                                setState({ ...state, priceBox: result[0], price: result[1] });
                                            } else {
                                                setState({ ...state, priceBox: result[0] });
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Row} className="form-group font-weight-bold justify-content-end align-items-center">
                                <Form.Label as={Col} className="text-right pr-0">Stück</Form.Label>
                                <InputGroup as={Col} className="col-sm-7 pr-0">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="py-0">x</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl className={classNames("form-control form-control-sm text-right", state.quantity === 0 && "border-pink")}
                                        id="editQuantity"
                                        placeholder={numberFormat(entry.quantity).toString()}
                                        value={state.quantityBox}
                                        type="text"
                                        onChange={control => {
                                            const result = processNumeric(control.target.value);
                                            if (result[1] != null) {
                                                setState({ ...state, quantityBox: result[0], quantity: result[1] });
                                            } else {
                                                setState({ ...state, quantityBox: result[0] });
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="form-group row justify-content-end align-items-center">
                                <Form.Label as={Col} className="text-right pr-0">Spesen</Form.Label>
                                <InputGroup as={Col} className="col-sm-7 pr-0">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="py-0 text-pink">+</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl className="form-control form-control-sm text-right text-pink"
                                        id="editBuyCharges"
                                        placeholder={numberFormat(entry.buyCharges).toString()}
                                        value={state.buyChargesBox}
                                        type="text"
                                        onChange={control => {
                                            const result = processNumeric(control.target.value);
                                            if (result[1] != null) {
                                                setState({ ...state, buyChargesBox: result[0], buyCharges: result[1] });
                                            } else {
                                                setState({ ...state, buyChargesBox: result[0] });
                                            }
                                        }}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Row className="justify-content-end font-weight-bold align-items-center">
                                <Col className=" text-right pr-0">Kaufsumme</Col>
                                <Col className="col-sm-7 text-right pr-0">
                                    {numberFormat(calculatePurchase(state.price, state.quantity, state.buyCharges, entry.instrument?.currency?.displayCode || ""))} {entry.instrument?.currency?.displayCode || ""}</Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className="pr-3">
                        <Col className='pr-0 my-4'>
                            <textarea className="d-block w-100 font-italic" placeholder={"Hier können Sie Ihre Notiz eingeben. (max. 250 Zeichen)"} maxLength={250}
                                value={state.memo?.toString()}
                                onChange={control => setState({ ...state, memo: control.target.value })}
                            />
                        </Col>
                    </Row>
                </Form>

                <Row className="justify-content-end mb-2 pr-3">
                    <Button variant='inline-inverse' className="mb-0 mr-1" onClick={handleClose}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" disabled={!validForm}
                        onClick={() => {
                            mutation({
                                variables: {
                                    entry: {
                                        portfolioId: portfolio.id,
                                        portfolioEntryId: entry.id,
                                        instrumentId: entry.instrument?.id,
                                        price: state.price || 0,
                                        quantity: state.quantity || 0,
                                        charges: state.buyCharges || 0,
                                        entryTime: moment(state.entryTime).format(),
                                        memo: state.memo
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
                <ConfirmModal title="Bearbeiten" text=" Die Bearbeitung Ihres Wertpapiers war erfolgreich." isOpen={isDoneOpen} handleClose={handleDoneClose} />
            }
        </>
    );
}
