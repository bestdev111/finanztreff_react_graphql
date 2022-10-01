import { useMutation, useQuery } from "@apollo/client";
import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";
import { loader } from "graphql.macro";
import { AccountEntry, AccountOperationType, Mutation, Portfolio, Query } from "graphql/types";
import { ReactNode, useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { ModalHeaderMeinFinanztreff } from "../ModalHeaderMeinFinanztreff";
import { guessInfonlineSection, trigInfonline } from "../../../common/InfonlineService";
import { PortfolioInstrumentAddPurchaseDate } from "components/common/profile/PortfolioInstrumentAdd/PortfolioInstrumentAddPurchaseDate";
import { isNegativeAmount, isNegativeAmountById, preformatFloat } from "components/profile/utils";
import moment, { Moment } from "moment";
import './AccountDeposit.scss';
import { ConfirmModal } from "../MainSettingsModals/ConfirmModal";
import { DeleteAccountEntry } from "../MainSettingsModals/AccountEntry/DeleteAccountEntry";
import { ADD_ACCOUNT_ENTRY, EDIT_ACCOUNT_ENTRY } from "components/profile/query";

export function AccountDeposit(props: AccountDepositProps) {

    let [open, setOpen] = useState<boolean>(false);

    let { data, loading } = useQuery<Query>(loader('./getOperationTypes.graphql'));

    useEffect(() => {
        if (open) {
            trigInfonline(guessInfonlineSection(), "deposit_modal")
        }
    }, [open])

    return (
        <>
            {
                props.children ?
                    <Button variant="green" onClick={() => setOpen(true)}>
                        {props.children}
                    </Button>
                    :
                    <Button variant="green" className="pl-n3" style={{ width: "29px" }} onClick={() => setOpen(true)}>
                        <SvgImage icon="icon_plus_borderless_white.svg" spanClass="m-n4" width="30" />
                    </Button>
            }
            {open && data && data.accountOperationTypes && <ExposeDepositModalBody onComplete={props.onComplete} accountOperationTypes={data.accountOperationTypes} handleClose={() => setOpen(false)} addToKonto={true} portfolio={props.portfolio} />}
        </>
    );

}

interface ExposeDepositModalBodyProps {
    handleClose: () => void,
    addToKonto?: boolean,
    accountOperationTypes: AccountOperationType[],
    portfolio: Portfolio,
    accountEntry?: AccountEntry,
    onComplete: () => void,
}

function getAdjustedPrice(entry?: AccountEntry): number | undefined {
    let result = entry ? entry.amount : undefined;
    if (result) 
    return (result < 0) && isNegativeAmount(entry) ? -result : result;
}

export function ExposeDepositModalBody({ handleClose, addToKonto, accountOperationTypes, portfolio, accountEntry, onComplete }: ExposeDepositModalBodyProps) {

    let [state, setState] = useState<AccountDepositState>({
        purchaseDate: accountEntry ? moment(accountEntry.entryTime) : moment(),
        isDoneOpen: false,
        type: accountEntry ? accountOperationTypes.find(current => current.id === accountEntry.accountTypeId) : accountOperationTypes.find(current => current.name === (addToKonto ? "Einzahlung" : "Auszahlung")),
        memo: accountEntry?.memo || undefined,
        price: getAdjustedPrice(accountEntry),
        portfolio: portfolio,
        portfolioName: portfolio.name!,
        portfolioId: portfolio.id
    });

    const setIsDoneOpen = (value: boolean) => setState({ ...state, isDoneOpen: value });

    let validForm = !!state.purchaseDate && !!state.portfolioName && !!state.portfolioId && !!state.type && !!state.price;

    return (
        <>
            <Modal show={true} onHide={handleClose} className='bottom modal-background modal-dialog-sky-placement'>
                <div className="modal-dialog modal-content inner-modal modal-lg modal-dialog-sky-placement-date align-self-center">
                    <ModalHeaderMeinFinanztreff title="Kontoeintrag hinzufügen" titleClassName={"fs-18px"} close={handleClose} />
                    <Modal.Body className="border-none bg-white py-4 instrument-add-to-portoflio w-100">
                        <section className="main-section">
                            <Container>
                                <div className="">
                                    <Form className="modal-form input-bg">
                                        <Row className="w-100">
                                            <Col md={5} sm={12} className="pr-1">
                                                <Form.Group as={Row} className="row justify-content-sm-end justify-content-lg-start mb-2">
                                                    <Form.Label className="col-sm-4 col-form-label col-form-label-sm pr-0 text-right">Typ</Form.Label>
                                                    <Col className="col-sm-8 pr-md-3 pr-sm-0">
                                                        <InputGroup className="text-left">
                                                            <DropdownButton title={state.type?.name} className={"select-type-konto w-100 bg-border-gray "} style={{ borderRadius: "3px" }}>
                                                                {accountOperationTypes.filter(current => current !== state.type || current.id!==12).map((current) =>
                                                                    <>
                                                                        <Dropdown.Item key={current.id} onClick={() => setState({ ...state, type: current })}>{current.name}</Dropdown.Item>
                                                                        <Dropdown.Divider style={{ margin: "0" }} />
                                                                    </>
                                                                )}
                                                            </DropdownButton>
                                                        </InputGroup>
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} className="justify-content-end mb-2 pb-1">
                                                    <Form.Label className="col-sm-4 col-form-label col-form-label-sm pr-0 text-right">Datum</Form.Label>
                                                    <Col className="col-sm-8 pr-md-3 pr-sm-0">
                                                        <PortfolioInstrumentAddPurchaseDate
                                                            callback={date => setState({ ...state, purchaseDate: date.value })}
                                                            value={state.purchaseDate}
                                                        />
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group className="row justify-content-end">
                                                    <Form.Label className="col-sm-4 col-form-label col-form-label-sm pr-0 text-right">Betrag</Form.Label>
                                                    <InputGroup className={classNames("pr-md-3 pr-sm-0", state.price && state.price > 0 ? "col-sm-8" : "col-sm-8 red-border")} style={{ width: "200px" }}>
                                                        <FormControl className="form-control form-control-sm text-right"
                                                            value={state.price}
                                                            type="number"
                                                            min={0}
                                                            placeholder={"0"}
                                                            onChange={control => setState({ ...state, price: Number.parseFloat(preformatFloat(control.target.value)) })}
                                                        />
                                                    </InputGroup>

                                                </Form.Group>
                                            </Col>
                                            <Col md={7} sm={12} className="mb-2 pr-1 pl-md-5 pl-sm-3">
                                                <Row>
                                                    <label htmlFor="noteInfoTextArea" className="d-flex justify-content-end col-md-2 col-sm-4 legend-label d-block fs-15px mt-1 pr-0">
                                                        <span className="svg-icon">
                                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="26" alt="" className="" />
                                                        </span>
                                                        Notiz
                                                    </label>
                                                    <div className="textarea-wrapper col-md-10 col-sm-8 text-right pr-0">
                                                        <textarea className="d-block w-100 font-italic" rows={5} maxLength={250} value={state.memo?.toString()} placeholder={state.memo?.toString() || "Hier können Sie Ihre Notiz eingeben. (max. 250 Zeichen)"}
                                                            onChange={control => setState({ ...state, memo: control.target.value })}
                                                        />
                                                    </div>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Form>
                                    <Row className={classNames("mb-2 mt-md-2 mt-sm-5 pr-3", !!accountEntry ? "justify-content-between" : "justify-content-end")}>
                                        {!!accountEntry &&
                                            <Col xs={4}>
                                                <DeleteAccountEntry portfolio={portfolio} entry={accountEntry} onComplete={() => {handleClose(); onComplete() }}>
                                                    <Button className="btn btn-pink with-icon-first mr-2 d-flex" data-dismiss="modal">
                                                        <span className="svg-icon pr-1">
                                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_white.svg"} width="" className="" alt="" />
                                                        </span>
                                                        Löschen
                                                    </Button>
                                                </DeleteAccountEntry>
                                            </Col>
                                        }
                                        <Col xs={8} className="text-right pr-0">
                                            <Button variant='inline-inverse' className="mb-0 mr-1" onClick={handleClose}>
                                                Abbrechen
                                            </Button>
                                            {accountEntry ?
                                                <EditAccountEntryButton variables={{
                                                    portfolioId: portfolio.id,
                                                    accountEntryId: accountEntry.id,
                                                    entry: {
                                                        accountTypeId: state.type?.id || 0,
                                                        amount: isNegativeAmountById(state.type?.id) && state.price ? -state.price : state.price || 0,
                                                        entryTime: state.purchaseDate,
                                                        memo: state.memo
                                                    }
                                                }} validForm={validForm} setIsDoneOpen={setIsDoneOpen} onComplete={onComplete} />
                                                :
                                                <AddAccountEntryButton variables={{
                                                    portfolioId: portfolio.id,
                                                    entry: {
                                                        accountTypeId: state.type?.id || 0,
                                                        amount: isNegativeAmountById(state.type?.id) && state.price ? -state.price : state.price || 0,
                                                        entryTime: state.purchaseDate,
                                                        memo: state.memo
                                                    }
                                                }} validForm={validForm} setIsDoneOpen={setIsDoneOpen} onComplete={onComplete} />

                                            }
                                        </Col>
                                    </Row>
                                </div>
                            </Container>
                        </section>
                    </Modal.Body>
                </div>
            </Modal>
            {state.isDoneOpen && <ConfirmModal title={state.type?.name || ""} text="Ihr Kontoeintrag war erfolgreich." isOpen={true} handleClose={() => { setIsDoneOpen(false); handleClose(); }} />}
        </>

    );
}

interface VarType {
    portfolioId: number;
    accountEntryId?: number;
    entry: { accountTypeId: any; amount: number; entryTime: Moment; memo: string | undefined; };
}

function EditAccountEntryButton({ variables, validForm, setIsDoneOpen, onComplete }: { variables: VarType, validForm: boolean, setIsDoneOpen: (value: boolean) => void, onComplete: () => void }) {

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(EDIT_ACCOUNT_ENTRY);

    return (
        <Button variant="primary" disabled={!validForm}
            onClick={() => {
                mutation({
                    variables: variables
                })
                    .then(() => {
                        onComplete();
                        setIsDoneOpen(true);
                    })
            }}
        >
            {mutationLoading && <Spinner animation="border" />}
            Speichern
        </Button>
    )
}

function AddAccountEntryButton({ variables, validForm, setIsDoneOpen, onComplete }: { variables: VarType, validForm: boolean, setIsDoneOpen: (value: boolean) => void, onComplete: () => void }) {

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(ADD_ACCOUNT_ENTRY);

    return (
        <Button variant="primary" disabled={!validForm}
            onClick={() => {
                mutation({
                    variables: variables
                })
                    .then(() => {
                        onComplete();
                        setIsDoneOpen(true);
                    })
            }}
        >
            {mutationLoading && <Spinner animation="border" />}
            Speichern
        </Button>
    )
}

interface AccountDepositState {
    isDoneOpen: boolean

    purchaseDate: moment.Moment;
    memo: string | undefined;
    price: number | undefined;
    type?: AccountOperationType;

    portfolioName: string
    portfolioId: number
    portfolio: Portfolio
}

interface AccountDepositProps {
    portfolio: Portfolio;
    children?: ReactNode;
    addToKonto?: boolean;
    onComplete: () => void;
    innerModal?: boolean;
}