import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import {ReactNode, useEffect, useState} from "react";
import { Mutation, PortfolioEntry, Query, QuoteType } from "../../../../generated/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { ProfileSelectInstrumentGroup } from "../common/ProfileSelectInstrumentGroup/ProfileSelectInstrumentGroup";
import { ProfileSelectInstrument } from "../common/ProfileSelectInstrument/ProfileSelectInstrument";
import { PortfolioInstrumentAddPurchaseDate } from "./PortfolioInstrumentAddPurchaseDate";
import moment from "moment";
import classNames from "classnames";
import { ProfileSelectPortfolio } from "../common/ProfileSelectPortfolio/ProfileSelectPortfolio";
import { ButtonVariant } from "react-bootstrap/types";
import { ConfirmModal } from "components/profile/modals/MainSettingsModals/ConfirmModal";
import { calculatePurchase, processNumeric } from "components/profile/utils";
import { numberFormat, numberFormatDecimals } from "utils";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import {guessInfonlineSection, trigInfonline} from "../../InfonlineService";

export const PortfolioInstrumentAdd = (props: PortfolioInstrumentAddProps) => {
    const date = moment();
    let [state, setState] = useState<PortfolioInstrumentAddState>({ 
        overridePrice: false, 
        purchaseDate:date , 
        expenses: 0,
        expensesBox: "0", 
        size: 0,
        sizeBox: "0" 
    });
    const [isDone, setDone] = useState(false);
    const [open,setOpen] = useState<boolean>(false);
    console.log("open:", open);
    
    const handleDone = () => setDone(false);
    let { data: portfolioData, loading: portfoliosLoading } = useQuery<Query>(
        loader('./getUserPortfoliosAdd.graphql'), {skip: !open || !state.instrumentId}
    );
    let { data: instrumentGroupData, loading: instrumentGroupLoading } = useQuery<Query>(
        loader('./getInstrumentGroupUserPortfolios.graphql'),
        {   variables: { groupId: state.instrumentGroupId },
            skip: !state.instrumentGroupId,
            onCompleted: data => {console.log("DEBUG query getInstrumentGroupUserPortfolios ", data)} ,
            onError: error => {console.log("DEBUG query error getInstrumentGroupUserPortfolios ", error)},
            errorPolicy: "all",
            pollInterval: 500,
        }

    );
    let { data: instrumentData, loading: instrumentLoading } = useQuery<Query>(
        loader('./getInstrumentUserPortfolios.graphql'),
        {   variables: { instrumentId: state.instrumentId },
            skip: !state.instrumentId || !open,
            onCompleted: data => {console.log("DEBUG query getInstrumentUserPortfolios ", data)},
            onError: error => {console.log("DEBUG query error getInstrumentUserPortfolios ", error)},
            errorPolicy: "all",
            pollInterval: 500,
        }
    );

    const quote = (instrumentData && instrumentData.instrument && instrumentData.instrument.snapQuote &&
        (instrumentData?.instrument?.snapQuote.quotes.find(current => current?.type === QuoteType.Trade)
            || instrumentData?.instrument?.snapQuote.quotes.find(current => current?.type === QuoteType.NetAssetValue))
    ) || undefined;

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(loader('./createPortfolioEntry.graphql'));

    if (!state.overridePrice && quote && quote.value && state.price !== quote.value) {
        setState({ ...state, price: quote.value});
    }

    if (!portfoliosLoading) {
        if (state.portfolioId) {
            let portfolio = portfolioData?.user?.profile?.portfolios?.filter(current => current.id === state.portfolioId)[0] || null;
            if (portfolio) {
                if (state.portfolioName !== portfolio.name) {
                    setState({ ...state, portfolioName: portfolio.name || "" });
                }
            }
        }
    }

    let validForm = state.instrumentId && state.portfolioId && state.portfolioName && state.price && state.size;



    return (
        <>
            <Button variant={props.variant} className={props.className} onClick={() => {
                trigInfonline(guessInfonlineSection(), "buy_stock");
                setState({
                    ...state,
                    price: 0,purchaseDate: date,
                    ...props
                });
                setOpen(!open)
            }}>
                {props.children}
            </Button>
            <Modal show={open} size="lg" onHide={() => open && setOpen(!open)} className="modal-dialog-sky-placement">
                <ModalHeaderMeinFinanztreff title="Wertpapier kaufen" close={()=>setOpen(!open)} />
                <Modal.Body className="border-none bg-white py-4 instrument-add-to-portoflio">
                    <section className="main-section">
                        <Container>
                            <div className="">
                                <Form className="modal-form input-bg">
                                    <Row className="row-cols-lg-2 row-cols-sm-1">
                                        <Col>
                                            <Form.Group as={Row} className=" row justify-content-sm-end justify-content-lg-start">
                                                <Form.Label className="col-sm-3 col-form-label col-form-label-sm text-right pr-0">Wertpapier</Form.Label>
                                                <Col className="col-lg-9 col-sm-7">
                                                    {
                                                        instrumentGroupLoading ?
                                                            <Form.Text>
                                                                <Spinner animation="border" size="sm" />
                                                            </Form.Text> :
                                                            <ProfileSelectInstrumentGroup
                                                                callback={value => value ? setState({ ...state, instrumentGroupId: value.id, instrumentId: undefined }) : undefined}
                                                                value={instrumentGroupData?.group?.name || ''}
                                                            />
                                                    }
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="form-group row justify-content-sm-end justify-content-lg-start">
                                                <Form.Label className="col-sm-3 col-form-label col-form-label-sm text-right pr-0">Börsenplatz</Form.Label>
                                                <Col className="col-lg-9 col-sm-7">
                                                    {
                                                        instrumentLoading || instrumentGroupLoading ?
                                                            <Form.Text><Spinner animation="border" size="sm" /></Form.Text> :
                                                            <ProfileSelectInstrument
                                                                value={(state.instrumentId && instrumentData?.instrument?.exchange?.name) || ''}
                                                                group={instrumentGroupData?.group || undefined}
                                                                instruments={instrumentGroupData?.group?.content || []} callback={value => value ? setState({ ...state, instrumentId: value.id, overridePrice: false }) : undefined}
                                                            />
                                                    }
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="form-group justify-content-sm-end justify-content-lg-start mt-5">
                                                <Form.Label className="col-sm-3 col-form-label col-form-label-sm text-right font-weight-bold pr-0">Portfolio</Form.Label>
                                                <Col className="col-lg-9 col-sm-7">
                                                    {portfoliosLoading ?
                                                        <Form.Text><Spinner animation="border" size="sm" /></Form.Text> :
                                                        portfolioData?.user?.profile?.portfolios &&
                                                        <ProfileSelectPortfolio
                                                            portfolios={portfolioData?.user?.profile?.portfolios || []}
                                                            callback={value => setState({ ...state, portfolioId: value })}
                                                            portfolioId={state.portfolioId}
                                                            value={portfolioData?.user?.profile?.portfolios ? portfolioData?.user?.profile?.portfolios.find(current => current.id === state.portfolioId)?.name || "" : ""}
                                                        />
                                                    }
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group as={Row} className="justify-content-end">
                                                <Form.Label className="col-sm-4 col-form-label col-form-label-sm text-right pr-0">Kaufdatum</Form.Label>
                                                <Col className="col-sm-7">
                                                    <PortfolioInstrumentAddPurchaseDate
                                                        callback={date => setState({ ...state, purchaseDate: date.value })}
                                                        value={state.purchaseDate}
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group className="form-group row justify-content-end">
                                                <Form.Label className="col-sm-4 col-form-label col-form-label-sm text-right pr-0">Kaufkurs</Form.Label>
                                                <InputGroup className={state.price && state.price > 0 ? "col-sm-7" : "col-sm-6 px-0 mx-3 red-border my-0"} style={{ width: "200px" }}>
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text className="py-0">{instrumentData?.instrument?.group.assetGroup==="BOND" ? "%" : instrumentData?.instrument?.currency?.displayCode || ""}</InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <FormControl className="form-control form-control-sm text-right"
                                                        value={state.priceBox}
                                                        type="text"
                                                        placeholder={(instrumentData && instrumentData.instrument && instrumentData.instrument.snapQuote && instrumentData.instrument.snapQuote.lastPrice) ? numberFormatDecimals(instrumentData.instrument.snapQuote.lastPrice) : "0"}
                                                        onChange={control => {
                                                            const result = processNumeric(control.target.value);
                                                            if (result[1] != null) {
                                                                setState({ ...state, priceBox: result[0], price: result[1], overridePrice: true });
                                                            } else {
                                                                setState({ ...state, priceBox: result[0] });
                                                            }
                                                        }}
                                                    />
                                                </InputGroup>

                                            </Form.Group>
                                            <Form.Group className="form-group row font-weight-bold justify-content-end">
                                                <Form.Label className="col-sm-4 col-form-label col-form-label-sm text-right pr-0">Stück</Form.Label>
                                                <InputGroup className={state.size && state.size > 0 ? "col-sm-7" : "col-sm-6 px-0 mx-3 red-border my-0"} style={{ width: "200px" }}>
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text className="py-0">x</InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <FormControl className="form-control form-control-sm text-right"
                                                        placeholder="0"
                                                        type="text"
                                                        value={state.sizeBox}
                                                        onChange={control => {
                                                            const result = processNumeric(control.target.value);
                                                            if (result[1] != null) {
                                                                setState({ ...state, sizeBox: result[0], size: result[1] });
                                                            } else {
                                                                setState({ ...state, sizeBox: result[0] });
                                                            }
                                                        }}
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                            <Form.Group className="form-group row justify-content-end">
                                                <Form.Label className="col-sm-4 col-form-label col-form-label-sm text-right pr-0">Spesen</Form.Label>
                                                <InputGroup className="col-sm-7 with-floating-label">
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text className="py-0 text-pink">+</InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <FormControl className="form-control form-control-sm text-right text-pink"
                                                        placeholder="0"
                                                        type="text"
                                                        value={state.expensesBox}
                                                        onChange={control => {
                                                            const result = processNumeric(control.target.value);
                                                            if (result[1] != null) {
                                                                setState({ ...state, expensesBox: result[0], expenses: result[1] });
                                                            } else {
                                                                setState({ ...state, expensesBox: result[0] });
                                                            }
                                                        }}
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                            <div className="form-group empty-row invisible row">
                                                <div className="col">
                                                    <input type="text" className="form-control form-control-sm" />
                                                </div>
                                            </div>
                                            <div className="summary-info d-flex justify-content-end">
                                                <span className="font-weight-bold">Kaufsumme</span>
                                                <span className="col-sm-7 font-weight-bold text-right pr-0">
                                                    {numberFormat(calculatePurchase(state.price, state.size, state.expenses, instrumentData?.instrument?.currency?.displayCode || "" ))} { instrumentData?.instrument?.group.assetGroup==="BOND" ? instrumentData?.instrument?.group?.bond?.nominalCurrencyCode : instrumentData?.instrument?.currency?.displayCode || ""}</span>
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className="row">
                                        <div className="col-12">
                                            <label htmlFor="noteInfoTextArea" className="legend-label d-block font-weight-bold margin-top-15 fnt-size-15">
                                                <span className="svg-icon">
                                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                                                </span>
                                                Notiz
                                            </label>
                                            <div className="textarea-wrapper">
                                                <textarea className="d-block w-100 font-italic" maxLength={250} value={state.memo?.toString()} placeholder={state.memo?.toString() || "Hier können Sie Ihre Notiz eingeben. (max. 250 Zeichen)"}
                                                    onChange={control => setState({ ...state, memo: control.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Form>

                                <div className="button-row margin-top-12 d-flex justify-content-end">
                                    <Button variant="primary"
                                        className={classNames(validForm ? "" : "bg-border-gray text-kurs-grau border-border-gray")}
                                        onClick={() => {
                                            if (validForm) {
                                                mutation({
                                                    variables: {
                                                        portfolioId: state.portfolioId,
                                                        instrumentId: state.instrumentId,
                                                        price: state.price,
                                                        quantity: state.size,
                                                        charges: state.expenses===0 ? 0 : state.expenses,
                                                        entryTime: state.purchaseDate.format(),
                                                        memo: state.memo,
                                                        currencyCode: instrumentData?.instrument?.currency?.displayCode
                                                    }
                                                })
                                                    .then(entry => {
                                                        setState({ ...state, opened: false });
                                                        if (props.onComplete) {
                                                            props.onComplete(entry.data?.createPortfolioEntry || undefined);
                                                        }
                                                        setDone(true);
                                                       open && setOpen(!open)
                                                    });
                                            }
                                        }}
                                    >
                                        {mutationLoading && <Spinner animation="border" size="sm" />} Kauf abschließen
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </section>
                </Modal.Body>
            </Modal>
            <ConfirmModal title="Wertpapierkauf" text="Ihr Wertpapierkauf war erfolgreich." isOpen={isDone} handleClose={handleDone} />
        </>
    )
}

interface PortfolioInstrumentAddProps {
    onOpen?: () => void;
    portfolioId?: number;
    instrumentGroupId?: number;
    instrumentId?: number;
    onComplete?: (value?: any) => void;

    className?: string;
    variant?: ButtonVariant;
    children?: ReactNode;
}


interface PortfolioInstrumentAddState {
    opened ?: boolean;
    portfolioId?: number;
    portfolioName?: string;
    instrumentGroupId?: number;
    instrumentId?: number;

    price?: number;
    priceBox?: string;
    overridePrice: boolean;

    size?: number;
    sizeBox?: string;
    expenses?: number;
    expensesBox?: string;
    purchaseDate: moment.Moment;

    memo?: String;
}
