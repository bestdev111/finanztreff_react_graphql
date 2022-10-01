import { useMutation, useQuery } from "@apollo/client";
import classNames from "classnames";
import { PortfolioInstrumentAddPurchaseDate } from "components/common/profile/PortfolioInstrumentAdd/PortfolioInstrumentAddPurchaseDate";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { EDIT_ACCOUNT_ENTRY, GET_CURRENCY_HISTORY_QUOTE, GET_CURRENCY_PAIRS } from "components/profile/query";
import { compareByName, preformatFloat } from "components/profile/utils";
import { Query, Portfolio, Mutation, AccountEntry } from "graphql/types";
import moment from "moment";
import { ReactNode, useState } from "react";
import { Button, Col, Container, Dropdown, Form, FormControl, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { numberFormat } from "utils";
import { ConfirmModal } from "../ConfirmModal";
import { DeleteAccountEntry } from "./DeleteAccountEntry";

export function DividendEditModal(props: DividendEditModalProps) {

    const [isOpen, setOpen] = useState<boolean>(false);
    const handleClose = () => setOpen(false);

    return (
        <>
            <span onClick={() => setOpen(true)} className="cursor-pointer">{props.children}</span>
            <Modal show={isOpen} onHide={handleClose} className="modal bottom fade inner-modal modal-dialog-sky-placement">
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title={"Ertrag bearbeiten"} close={handleClose} />
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
    amount: number,
    exchangeRate: number,
    memo?: string | null
}

function ExposeModalBody({ entry, portfolio, onComplete, handleClose }: DividendEditModalProps & { handleClose: () => void }) {
    const [state, setState] = useState<ExposeModalBodyState>({
        entryTime: entry.entryTime,
        currency: "EUR",
        amount: entry.amount,
        exchangeRate: 1,
        memo: entry.memo,
    });

    const [isDoneOpen, setDoneOpen] = useState<boolean>(false);

    const handleDoneClose = () => { setDoneOpen(false); handleClose() };

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(EDIT_ACCOUNT_ENTRY);

    const handleDate = (date: any) => {
        setState({ ...state, entryTime: date });
        // refetchRate({ baseCode: "EUR", quoteCode: state.currency, time: date });
    }

    const handleCurrency = (e: any) => {
        setState({ ...state, currency: e });
        // refetchRate({ baseCode: state.currency, quoteCode: "EUR" });
    }

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

    let { loading: rateLoading, data: rateData, refetch: refetchRate } = useQuery<Query>(GET_CURRENCY_HISTORY_QUOTE, {
        variables: { baseCode: state.currency, quoteCode: "EUR", time: state.entryTime }
    }
    );

    let sum = state.amount * state.exchangeRate;

    let exchangeRate = 1;
    if (rateData && rateData.currencyHistory?.lastPrice) {
        exchangeRate = rateData.currencyHistory.lastPrice;
        sum = sum * exchangeRate;
    }

    const VALID_FORM: boolean = (state.amount !== entry.amount) || (state.entryTime !== entry.entryTime) || (state.memo !== entry.memo) || (state.currency!=="EUR");

    return (
        <>
            <Container className="px-0 pt-0">
                <Form className="modal-form input-bg mb-2 pt-0">
                    <Row className="row-cols-lg-2 row-cols-sm-1 pr-3 border-border-gray-2 border-top py-4">
                        <Col md={5} xs={12}>
                            <Form.Group as={Row} className="justify-content-end align-items-center">
                                <Form.Label as={Col} className="text-right pr-0">Datum</Form.Label>
                                <Col className="col-sm-7 pr-0">
                                    <PortfolioInstrumentAddPurchaseDate
                                        callback={date => handleDate(date.value)}
                                        value={moment(state.entryTime)}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="form-group justify-content-end align-items-center">
                                <Form.Label as={Col} className="text-right pr-0">Betrag</Form.Label>
                                <InputGroup as={Col} className="col-sm-4 pr-0">
                                    <FormControl className={classNames("form-control form-control-sm text-right", state.amount === 0 && "border-pink")}
                                        min='0'
                                        placeholder={numberFormat(state.amount).toString()}
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

                <Row className="justify-content-between my-2 pr-3">
                    <Col xs={3}>
                        <DeleteAccountEntry portfolio={portfolio} entry={entry} onComplete={() => { onComplete(); handleClose() }}>
                            <Button className="btn btn-pink with-icon-first mr-2 d-flex" data-dismiss="modal">
                                <span className="svg-icon pr-1">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_white.svg"} width="" className="" alt="" />
                                </span>
                                Löschen
                            </Button>
                        </DeleteAccountEntry>
                    </Col>
                    <Col xs={9} className="pr-0 text-right">
                        <Button variant='inline-inverse' className="mb-0 mr-1" onClick={handleClose}>
                            Abbrechen
                        </Button>
                        <Button variant="primary" disabled={!VALID_FORM}
                            onClick={() => {
                                if (VALID_FORM) {
                                    mutation({
                                        variables: {
                                            portfolioId: portfolio.id,
                                            accountEntryId: entry.id,
                                            entry: {
                                                accountTypeId: entry.accountTypeId,
                                                amount: state.amount * exchangeRate,
                                                entryTime: moment(state.entryTime).format(),
                                                memo: state.memo || ""                                         
                                            }                                            
                                        }
                                    })
                                        .then(() => {
                                            onComplete();
                                            setDoneOpen(true);
                                        });
                                }
                            }}
                        >
                            {mutationLoading && <Spinner animation="border" />}
                            Speichern
                        </Button>
                    </Col>
                </Row>
            </Container>
            {isDoneOpen &&
                <ConfirmModal title="Dividende" text="Ihre Dividendenzahlung wurde erfolgreich in Ihr Konto übertragen." isOpen={isDoneOpen} handleClose={handleDoneClose} />
            }
        </>
    );
}

interface DividendEditModalProps {
    children?: ReactNode
    portfolio: Portfolio
    entry: AccountEntry
    onComplete: () => void
}