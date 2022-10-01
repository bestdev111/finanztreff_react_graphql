import { ReactNode, useState } from 'react';
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { Mutation, Portfolio, PortfolioEntry, Query } from 'graphql/types';
import classNames from 'classnames';
import { ProfileSelectInstrument } from 'components/common/profile/common/ProfileSelectInstrument/ProfileSelectInstrument';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { loader } from 'graphql.macro';
import { ButtonVariant } from 'react-bootstrap/esm/types';
import { PortfolioInstrumentAddPurchaseDate } from 'components/common/profile/PortfolioInstrumentAdd/PortfolioInstrumentAddPurchaseDate';
import { ConfirmModal } from './ConfirmModal';
import { calculatePurchase, preformatFloat } from 'components/profile/utils';
import { numberFormat, numberFormatDecimals } from 'utils';
import { ModalHeaderMeinFinanztreff } from '../ModalHeaderMeinFinanztreff';

export function SaleAssetModal(props: SaleAssetModalProps) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const handleClose = () => setOpen(false);

    return (
        <>
            <span onClick={() => setOpen(true)}>
                {props.children}
            </span>
            <Modal show={isOpen} onHide={handleClose} className='bottom modal-background modal-dialog-sky-placement'>
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title={<>
                        <span className="svg-icon top-move pr-1">
                            <img src="/static/img/svg/icon_minus_pink.svg" width="17" alt="" className="" />
                        </span>
                        Verkauf
                    </>} close={handleClose} />
                    <Modal.Body className="border-none bg-white w-100">
                        <ExposeModalBody entry={props.entry} portfolio={props.portfolio} onComplete={props.onComplete} handleClose={handleClose} />
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
}

interface SaleAssetModalProps {
    portfolio: Portfolio;
    instrumentGroupId?: number;
    onComplete?: (value?: PortfolioEntry) => void;

    className?: string;
    variant?: ButtonVariant;
    children?: ReactNode;
    entry: PortfolioEntry
}


interface ExposeSalesModalState {
    portfolioId?: number;
    portfolioName?: string;
    instrumentGroupId?: number;
    instrumentId?: number;

    price?: number;
    overridePrice: boolean;

    quantity?: number;
    expenses?: number;
    purchaseDate: moment.Moment;

    memo?: String;
}

interface ExposeModalBodyProps {
    entry: PortfolioEntry,
    portfolio: Portfolio,
    handleClose: () => void,
    onComplete?: () => void;
}

export function ExposeModalBody(props: ExposeModalBodyProps) {
    const [isDoneOpen, setDoneOpen] = useState<boolean>(false);
    const handleDoneClose = () => { setDoneOpen(false); props.handleClose() };

    let [state, setState] = useState<ExposeSalesModalState>({
        overridePrice: false,
        purchaseDate: moment(),
        expenses: undefined,
        portfolioId: props.portfolio.id,
        portfolioName: props.portfolio.name || undefined,
        price: props.entry.snapQuote?.lastPrice!,
        quantity: undefined,
        instrumentId: props.entry.instrumentId!,
        instrumentGroupId: props.entry.instrumentGroupId || undefined,
        memo: props.entry.memo || ""
    });

    let { data: instrumentGroupData, loading: instrumentGroupLoading } = useQuery<Query>(
        loader('../../../common/profile/PortfolioInstrumentAdd/getInstrumentGroupUserPortfolios.graphql'),
        { variables: { groupId: state.instrumentGroupId }, skip: !state.instrumentGroupId },
    );
    let { data: instrumentData, loading: instrumentLoading } = useQuery<Query>(
        loader('../../../common/profile/PortfolioInstrumentAdd/getInstrumentUserPortfolios.graphql'),
        { variables: { instrumentId: state.instrumentId }, skip: !state.instrumentId },
    );

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(loader('../../../common/profile/PortfolioInstrumentAdd/closePortfolioEntry.graphql'));

    if (!state.overridePrice && instrumentData?.instrument?.snapQuote?.lastPrice && state.price !== instrumentData.instrument.snapQuote.lastPrice) {
        setState({ ...state, price: instrumentData.instrument.snapQuote.lastPrice });
    }

    let validForm = state.instrumentId && state.portfolioId && state.portfolioName && state.price && state.quantity && state.quantity > 0 && state.quantity <= props.entry.quantity;

    return (
        <>
            <Container className="px-0">
                <p>Verkaufen von "<b>{props.entry.instrument?.name}</b>" in "<b>{props.portfolio?.name!}</b>"</p>

                <Form className="modal-form input-bg">
                    <Row className="row-cols-lg-2 row-cols-sm-1 pr-3">
                        <Col>
                            <Form.Group as={Row} className="justify-content-end">
                                <Form.Label className="col-sm-4 col-form-label col-form-label-sm text-right pr-0">Börsenplatz</Form.Label>
                                <Col className="col-sm-7 pr-0">
                                    <ProfileSelectInstrument
                                        value={(state.instrumentId && props.entry?.instrument?.exchange?.name) || undefined}
                                        instruments={instrumentGroupData?.group?.content || []} callback={value => value ? setState({ ...state, instrumentId: value.id, overridePrice: false }) : undefined}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="justify-content-end">
                                <Form.Label className="col-sm-4 col-form-label col-form-label-sm text-right pr-0">Verkaufsdatum</Form.Label>
                                <Col className="col-sm-7 pr-0">
                                    <PortfolioInstrumentAddPurchaseDate
                                        callback={date => setState({ ...state, purchaseDate: date.value })}
                                        value={state.purchaseDate}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="form-group row justify-content-end">
                                <Form.Label className="col-sm-4 col-form-label col-form-label-sm text-right pr-0">Verkaufskurs</Form.Label>
                                <InputGroup as={Col} className="col-sm-7 pr-0">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="py-0 pr-0">{props.entry.instrument?.currency?.displayCode || ""}</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl className={classNames("form-control form-control-sm text-right", state.price === 0 && "border-pink")}
                                        value={state.price}
                                        type="number"
                                        placeholder={(instrumentData && instrumentData.instrument && instrumentData.instrument.snapQuote) ? numberFormatDecimals(instrumentData.instrument.snapQuote.lastPrice) : "0"}
                                        onChange={control => setState({ ...state, price: Number.parseFloat(preformatFloat(control.target.value)), overridePrice: true })}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Row} className="form-group font-weight-bold justify-content-end align-items-center">
                                <Form.Label as={Col} className="text-right pr-0">Stück</Form.Label>
                                <InputGroup as={Col} className="col-sm-7 pr-0">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="py-0">x</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl className={classNames("form-control form-control-sm text-right", (state.quantity === 0 || (state.quantity && state.quantity > props.entry.quantity)) && "border-pink")}
                                        placeholder={"maximal " + numberFormat(props.entry.quantity).toString()}
                                        value={state.quantity}
                                        type="number"
                                        min="0"
                                        onChange={control => setState({ ...state, quantity: Number.parseFloat(preformatFloat(control.target.value)) })}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="form-group row justify-content-end">
                                <Form.Label className="col-sm-4 col-form-label col-form-label-sm text-right pr-0">Spesen</Form.Label>
                                <InputGroup className="col-sm-7 with-floating-label pr-0">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="py-0 text-pink">-</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl className="form-control form-control-sm text-right text-pink"
                                        placeholder="0"
                                        value={state.expenses}
                                        type="number"
                                        min="0"
                                        onChange={control => setState({ ...state, expenses: Number.parseFloat(preformatFloat(control.target.value)) })}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Row className="justify-content-end font-weight-bold align-items-center mt-5">
                                <Col className=" text-right pr-0">Verkaufssumme</Col>
                                <Col className="col-sm-7 text-right pr-0">
                                    {numberFormat(calculatePurchase(state.price, state.quantity, state.expenses && state.expenses*(-1) || undefined, props.entry.instrument?.currency?.displayCode || ""))} {props.entry.instrument?.currency?.displayCode || ""}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className='pr-3'>
                        <Col className="pr-0 my-2">
                            <h6 className="modal-title fs-18px" id="">
                                <span className="svg-icon">
                                    <img src="/static/img/svg/icon_note.svg" width="20" alt="" className="" />
                                </span>
                                <span>Notiz</span>
                            </h6>
                            <textarea className="d-block w-100 font-italic" placeholder={"Hier können Sie Ihre Notiz eingeben. (max. 250 Zeichen)"}
                                value={state.memo?.toString()} maxLength={250}
                                onChange={control => setState({ ...state, memo: control.target.value })}
                            />
                        </Col>
                    </Row>
                </Form>

                <Row className="justify-content-end my-2 pr-3">
                    <Button variant='inline-inverse' className="mb-0 mr-1" onClick={props.handleClose}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" disabled={!validForm}
                        onClick={() => {
                            if (validForm) {
                                mutation({
                                    variables: {
                                        portfolioId: state.portfolioId,
                                        portfolioEntryId: props.entry.id,
                                        price: state.price,
                                        quantity: state.quantity,
                                        charges: state.expenses || 0,
                                        closeTime: state.purchaseDate.format(),
                                        memo: state.memo,
                                        currencyCode: instrumentData?.instrument?.currency?.displayCode
                                    }
                                })
                                    .then(() => {
                                        if (props.onComplete) {
                                            props.onComplete();
                                        }
                                        setDoneOpen(true);
                                    });
                            }
                        }}
                    >
                        {mutationLoading && <Spinner animation="border" />}
                        Speichern
                    </Button>
                </Row>
            </Container>
            {isDoneOpen &&
                <ConfirmModal title="Wertpapierverkauf" text="Ihr Wertpapierverkauf war erfolgreich." isOpen={isDoneOpen} handleClose={handleDoneClose} />
            }
        </>
    )

}