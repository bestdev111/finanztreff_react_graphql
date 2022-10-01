import { useMutation, useQuery } from "@apollo/client";
import classNames from "classnames";
import { PortfolioInstrumentAddPurchaseDate } from "components/common/profile/PortfolioInstrumentAdd/PortfolioInstrumentAddPurchaseDate";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { GET_CURRENCY_HISTORY_QUOTE, GET_CURRENCY_PAIRS, PORTFOLIO_DIVIDEND } from "components/profile/query";
import { compareByName, preformatFloat } from "components/profile/utils";
import { Query, Portfolio, PortfolioEntry, Mutation, AssetGroup } from "graphql/types";
import moment from "moment";
import { ReactNode, useState } from "react";
import { Button, Col, Container, Dropdown, Form, FormControl, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { numberFormat } from "utils";
import { ConfirmModal } from "../ConfirmModal";

export function DividendModal(props: DividendModalProps) {

    const [isOpen, setOpen] = useState<boolean>(false);
    const handleClose = () => setOpen(false);
    const BUTTON_LABEL: string = props.entry.instrument?.group.assetGroup == AssetGroup.Share ? "Dividende" :
        (props.entry.instrument?.group.assetGroup == AssetGroup.Fund || props.entry.instrument?.group.assetGroup == AssetGroup.Etf) ? "Ausschüttung" :
            props.entry.instrument?.group.assetGroup == AssetGroup.Bond ? "Zinsen" :
                "";


    return (
        <>{props.children ?
            <span onClick={() => setOpen(true)}>{props.children}</span>
            :
            <Button variant="inline-inverse" className="mb-0 mr-1" onClick={() => setOpen(true)}>
                {BUTTON_LABEL}
            </Button>
        }
            <Modal show={isOpen} onHide={handleClose} className="modal bottom fade inner-modal modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title={"Ertrag hinzufügen"} close={handleClose} />
                    <Modal.Body className="bg-white w-100">
                        <ExposeModalBody portfolio={props.portfolio} entry={props.entry} onComplete={props.onComplete} handleClose={handleClose} />
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
}

interface ExposeModalBodyState {
    entryTime: any,
    currency: string,
    amount?: number,
    exchangeRate: number,
    memo?: string
}

function ExposeModalBody({ entry, portfolio, onComplete, handleClose }: DividendModalProps & { handleClose: () => void }) {
    const [state, setState] = useState<ExposeModalBodyState>({
        entryTime: moment(),
        currency: "EUR",
        amount: undefined,
        exchangeRate: 1,
        memo: "",
    });

    const [isDoneOpen, setDoneOpen] = useState<boolean>(false);
    const handleDoneClose = () => { setDoneOpen(false); handleClose() };

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(PORTFOLIO_DIVIDEND);

    const handleDate = (date: any) => {
        setState({ ...state, entryTime: date });
        // refetchRate({ baseCode: "EUR", quoteCode: state.currency, time: date });
    }

    const handleCurrency = (e: any) => {
        setState({ ...state, currency: e });
        // refetchRate({ baseCode: "EUR", quoteCode: e, time: state.entryTime });
    }

    let sum = state.amount ? state.amount * state.exchangeRate : 0;

    let { loading: currencyLoading, data: currencies } = useQuery<Query>(GET_CURRENCY_PAIRS,
        {
            variables: { baseCode: "EUR" }
        }
    );

    let currencyPairs = currencies?.currencyPairs.filter(currency =>
        ["EUR", "USD", "CHF", "RUB", "HKD", "JPY", "AUD"].indexOf(currency.quoteCurrency.alphaCode!) === -1)
        .sort(function (a, b) {
            return compareByName(a.quoteCurrency.alphaCode!, b.quoteCurrency.alphaCode!) || -1;
        });

    let { loading: rateLoading, data: rateData, refetch: refetchRate} = useQuery<Query>(GET_CURRENCY_HISTORY_QUOTE, {
        variables: { baseCode: state.currency, quoteCode: "EUR", time: state.entryTime }
    }
    );
    
    let exchangeRate = 1;
    if (rateData && rateData.currencyHistory?.lastPrice) {
        exchangeRate = rateData.currencyHistory.lastPrice;
        sum = sum * exchangeRate;
    }

    const validForm: boolean = !!state.amount && state.amount!==0;

    return (
        <>
            <Container className="px-0">
                <Row>
                    <Col className="pt-4 mx-3 px-0 border-border-gray-2 border-top">
                        <span className="fs-18px font-weight-bold pr-2">
                            +
                        </span>
                        <span className="fs-15-18-18 font-weight-bold">Neue Dividenden, Ausschüttungen oder sonstige Erträge hinzufügen:</span>
                    </Col>
                </Row>
                <Form className="modal-form input-bg mb-4">
                    <Row className="row-cols-lg-2 row-cols-sm-1 pr-3">
                        <Col md={5} xs={12}>
                            <Form.Group as={Row} className="justify-content-end align-items-center">
                                <Form.Label as={Col} className="text-right pr-0">Datum</Form.Label>
                                <Col className="col-sm-7 pr-0">
                                    <PortfolioInstrumentAddPurchaseDate
                                        callback={date => handleDate(date.value)}
                                        value={state.entryTime}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="form-group justify-content-end align-items-center">
                                <Form.Label as={Col} className="text-right pr-0">Betrag</Form.Label>
                                <InputGroup as={Col} className="col-sm-4 pr-0">
                                    <FormControl className={classNames("form-control form-control-sm text-right", state.amount === 0 && "border-pink")}
                                        min='0'
                                        placeholder={"0"}
                                        value={state.amount}
                                        type="number"
                                        onChange={control => setState({ ...state, amount: Number.parseFloat(preformatFloat(control.target.value)) })}
                                    />
                                </InputGroup>
                                <Col className="col-sm-3 pr-0 pl-1">
                                    {currencyLoading && !currencies && <Spinner animation="border" size="sm" />}
                                    {currencies && currencyPairs &&
                                        <Dropdown className="dropdown-menu-dividend" onSelect={value => handleCurrency && handleCurrency(value)}>
                                            <Dropdown.Toggle className="dropdown-choice text-right">{state.currency}</Dropdown.Toggle>

                                            <Dropdown.Menu role="menu" >
                                                <Dropdown.Item eventKey="EUR">EUR (Euro)</Dropdown.Item>
                                                <Dropdown.Item eventKey="USD">USD (US-Dollar)</Dropdown.Item>
                                                <Dropdown.Item eventKey="CHF">CHF (Schweizer Franken)</Dropdown.Item>
                                                <Dropdown.Item eventKey="RUB">RUB (Russischer Rubel)</Dropdown.Item>
                                                <Dropdown.Item eventKey="HKD">HKD (HongKong-Dollar)</Dropdown.Item>
                                                <Dropdown.Item eventKey="JPY">JPY (Japanischer Yen)</Dropdown.Item>
                                                <Dropdown.Item eventKey="AUD">AUD (Australischer Dollar)</Dropdown.Item>
                                                {
                                                    currencyPairs.map(currency => {
                                                        return <Dropdown.Item eventKey={currency.quoteCurrency.alphaCode!}>{currency.quoteCurrency.alphaCode} ({currency.quoteCurrency.name})</Dropdown.Item>
                                                    })
                                                }

                                            </Dropdown.Menu>
                                        </Dropdown>
                                    }
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="form-group justify-content-start align-items-center">
                                <Form.Label as={Col} className="text-right pr-0 col-sm-5">Wechselkurs</Form.Label>
                                <InputGroup as={Col} className="col-sm-4 pr-0">
                                    {rateLoading || !rateData ? <Spinner animation="border" size="sm" /> :
                                        <FormControl className={classNames("form-control form-control-sm text-right", state.exchangeRate === 0 && "border-pink")}
                                            disabled
                                            value={exchangeRate}
                                            onChange={control => setState({ ...state, exchangeRate: Number.parseInt(control.target.value) || 0 })}
                                        />
                                    }
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col md={7} xs={12}>
                            <Row className="font-weight-bold mt-md-0 mt-sm-3 mt-xs-3">
                                <Col xs={3} className="text-nowrap text-right d-block fs-15px pr-0">
                                    <span className="svg-icon">
                                        <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                                    </span>
                                    Notiz
                                </Col>
                                <Col xs={9} className="pr-0">
                                    <div className="textarea-wrapper">
                                        <textarea className="d-block w-100 font-italic" maxLength={250} value={state.memo?.toString()} placeholder={state.memo?.toString() || "Hier können Sie Ihre Notiz eingeben. (max. 250 Zeichen)"}
                                            onChange={control => setState({ ...state, memo: control.target.value })}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>

                <Row className="justify-content-end my-2 pr-3">
                    <Button variant='inline-inverse' className="mb-0 mr-1" onClick={handleClose}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" disabled={!validForm}
                        onClick={() => {
                            mutation({
                                variables: {
                                    portfolioId: portfolio.id,
                                    portfolioEntryId: entry.id,
                                    amount: state.amount,
                                    entryTime: state.entryTime.format(),
                                    currencyCode: state.currency,
                                    memo: state.memo
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
                <ConfirmModal title="Dividende" text="Ihre Dividendenzahlung wurde erfolgreich in Ihr Konto übertragen." isOpen={isDoneOpen} handleClose={handleDoneClose} />
            }
        </>
    );
}

interface DividendModalProps {
    children?: ReactNode
    portfolio: Portfolio
    entry: PortfolioEntry
    onComplete: () => void
}