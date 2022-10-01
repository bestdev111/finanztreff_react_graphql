import { ReactNode, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { ButtonVariant } from "react-bootstrap/types";
import { LimitEntry, Mutation, QuoteType } from "generated/graphql";
import { LIMIT_ENTRY_DELETE, LIMIT_ENTRY_EDIT } from "../../query";
import { Button, Col, Container, Dropdown, DropdownButton, FormControl, Modal, Row, Spinner } from "react-bootstrap";
import classNames from "classnames";
import './Limits.scss';
import { formatDate, formatPrice, numberFormatWithSign } from "utils";
import { getAssetGroup, getColorOfAssetGroup, preformatFloat } from "components/profile/utils";
import SvgImage from "components/common/image/SvgImage";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { ConfirmModal } from "components/profile/modals/MainSettingsModals/ConfirmModal";
import { guessInfonlineSection, trigInfonline } from "../../../common/InfonlineService";

export function LimitEditDelete(props: LimitEditDeleteProps) {

    const [isOpen, setOpen] = useState<boolean>(false);

    return (
        <>
            <Button variant={props.variant} className={props.className || undefined} onClick={() => {
                setOpen(true);
                props.onOpen && props.onOpen();
            }}>
                {props.children}
            </Button>
            {isOpen &&
                <LimitModal opened={isOpen} close={() => setOpen(false)} refreshTrigger={props.refreshTrigger} groupId={props.limit.instrument?.group.id || undefined} instrumentId={props.limit.instrument?.id} limit={props.limit} />
            }
        </>
    )
}

interface LimitEditDeleteProps {
    limit: LimitEntry;
    refreshTrigger?: () => void;
    onOpen?: () => void;
    children: ReactNode;

    variant?: ButtonVariant;
    className?: string;
}


interface LimitModalState {
    opened?: boolean;

    trailing: boolean;
    percent: boolean;
    upper: boolean;
    quoteType: string;
    price: number;
    memo: string;
    checked: boolean
}

interface LimitModalProps {
    opened: boolean;
    close: () => void;
    refreshTrigger?: () => void;
    groupId?: number;
    instrumentId?: number;
    limit: LimitEntry;

}

function LimitModal(props: LimitModalProps) {

    let [editLimit, { loading: editLimitLoading }] = useMutation<Mutation>(LIMIT_ENTRY_EDIT);

    let [deleteLimit, { loading: deleteLimitLoading }] = useMutation<Mutation>(LIMIT_ENTRY_DELETE);

    let [state, setState] = useState<LimitModalState>({
        price: props.limit.limitValue || 0,
        quoteType: props.limit.quoteType!,
        percent: props.limit.percent!,
        trailing: props.limit.trailing!,
        upper: props.limit.upper!,
        memo: props.limit.memo!,
        checked: props.limit.mailNotification!
    });

    useEffect(() => {
        if (props.opened) {
            trigInfonline(guessInfonlineSection(), "edit_limit")
        }
    }, [props.opened])


    const [isDeleteDone, setDelete] = useState(false);
    const handleDelete = () => { setDelete(false); props.close() };

    const [isEditDone, setEdit] = useState(false);
    const handleEdit = () => { setEdit(false); props.close() };

    const quote = props.limit && props.limit.instrument && props.limit.instrument.snapQuote &&
        (props.limit.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.Trade)
            || props.limit.instrument.snapQuote.quotes.find(current => current?.type === QuoteType.NetAssetValue));

    let validForm = state.price && (state.checked !== props.limit.mailNotification || state.price !== props.limit.limitValue || state.quoteType !== props.limit.quoteType ||
        state.memo != props.limit.memo || state.upper !== props.limit.upper || state.percent !== props.limit.percent || state.trailing !== props.limit.trailing);
    return (
        <>
            <Modal show={props.opened} onHide={!props.opened} size="lg" className="modal-limit-edit-delete modal-background modal-dialog-sky-placement">
                <ModalHeaderMeinFinanztreff title={
                    <>
                        <SvgImage icon="icon_add_limit_dark.svg" imgClass="svg-black" convert={true} width="25" />
                        <span className="align-middle fs-18px">Limit</span>
                    </>
                } close={props.close} />
                <Modal.Body className="border-0 bg-white modal-form input-bg">
                    <Container className="px-0 px-sm-1">
                        <Row className="row-cols-lg-2 row-cols-sm-1 mt-sm-3">
                            <Col className="pl-0">
                                <Row className="align-items-center mb-2">
                                    <Col className="col-sm-4 text-right pr-0 fs-15px">Wertpapier</Col>
                                    <Col className="col-7 bg-border-gray rounded ml-3 pl-2 py-1 pr-0 text-truncate">
                                        {props.limit.instrument?.name}
                                    </Col>
                                </Row>
                                <Row className="align-items-center justify-content-lg-start mb-4">
                                    <Col className="col-sm-4 text-right pr-0 fs-15px">Börsenplatz</Col>
                                    <Col className="col-7 bg-border-gray rounded ml-3 pl-2 py-1 pr-0">
                                        {props.limit.instrument?.exchange?.name}
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="pr-0">
                                <div className="left-side d-flex align-items-center mt-2 mt-sm-0">
                                    {props.limit.instrument?.group && props.limit.instrument?.group?.assetGroup &&
                                        <span className={"asset-type mr-2 py-1"} style={{ backgroundColor: getColorOfAssetGroup(props.limit.instrument?.group?.assetGroup) }}>{getAssetGroup(props.limit.instrument?.group?.assetGroup)}</span>
                                    }
                                    <span className="wkn-info px-2 fs-13px"><span>WKN:</span> {props.limit.instrument?.wkn}</span>
                                    <span className="isin-info px-2 fs-13px"><span>ISIN:</span> {props.limit.instrument?.isin}</span>

                                </div>
                                <div className="mt-4 mt-sm-2">
                                    {quote && quote.value && props.limit?.instrument?.currency?.alphaCode &&
                                        <span className="fs-18px font-weight-bold">
                                            {formatPrice(quote.value, props.limit?.instrument?.group?.assetGroup, null, props.limit.instrument.currency.alphaCode)}
                                        </span>
                                    }
                                    {quote && quote.percentChange &&
                                        <span className={quote.percentChange > 0 ? "fs-18px font-weight-bold text-green px-4 text-green" : " fs-18px font-weight-bold text-green px-4 text-red"}>
                                            {numberFormatWithSign(quote.percentChange, "%")}
                                        </span>
                                    }
                                    {quote && quote.when &&
                                        <span className="fs-13px">
                                            {formatDate(quote.when)}
                                        </span>
                                    }
                                </div>
                            </Col>
                        </Row>
                        <Container>
                            <Row className="row-cols-lg-2 row-cols-sm-1 border-top pt-1 limit-options">
                                <Col className="">
                                    <h6 className="fnt-size-15 font-weight-bold mt-2 mb-3 ml-n3">Limit einstellen</h6>
                                    <Row className="justify-content-between limit-types">
                                        <Button onClick={() => setState({ ...state, percent: false, trailing: false })} style={{ height: "fit-content" }} className={(state.percent == false && state.trailing == false) ? "btn active text-nowrap" : "btn text-nowrap"}>
                                            <SvgImage icon="icon_absolute.svg" imgClass={(state.percent == false && state.trailing == false) ? "svg-white" : "svg-blue"} convert={true} width="20" />
                                            <span className="mx-1">Absolut</span>
                                        </Button>
                                        <Button onClick={() => setState({ ...state, percent: true, trailing: false })} style={{ height: "fit-content" }} className={(state.percent == true && state.trailing == false) ? "btn active text-nowrap" : "btn text-nowrap"}>
                                            <SvgImage icon="icon_percent.svg" imgClass={(state.percent == true && state.trailing == false) ? "svg-white" : "svg-blue"} convert={true} width="20" />
                                            <span className="mx-1">Relativ</span>
                                        </Button>
                                        <Button onClick={() => setState({ ...state, trailing: true, percent: true })} style={{ height: "fit-content" }} className={state.trailing ? "btn active text-nowrap" : "btn text-nowrap"}>
                                            <SvgImage icon="icon_repeat.svg" imgClass={state.trailing ? "svg-white" : "svg-blue"} convert={true} width="20" />
                                            <span className="mx-1">Trailing</span>
                                        </Button>
                                    </Row>
                                    <Row className="justify-content-between mt-4 upper-down-limit">
                                        <Button onClick={() => setState({ ...state, upper: true })} className={state.upper ? "btn upper active" : "btn"}>
                                            <SvgImage icon="icon_limit_top.svg" style={{ marginBottom: "1px" }} imgClass={state.upper ? "svg-white" : "svg-blue"} convert={true} width="20" />
                                            <span className="mx-1">Oberes Limit</span>
                                        </Button>
                                        <Button onClick={() => setState({ ...state, upper: false })} className={!state.upper ? "btn down active" : "btn"}>
                                            <SvgImage icon="icon_limit_bottom.svg" style={{ marginBottom: "2px" }} imgClass={state.upper == false ? "svg-white" : "svg-blue"} convert={true} width="20" />
                                            <span className="mx-1"> Unteres Limit</span>
                                        </Button>
                                    </Row>
                                    <Row className="mt-2 quote-types">
                                        <div className="" style={{ width: "48%" }}>
                                            <DropdownButton title={state.quoteType == "TRADE" ? "Kurs" : state.quoteType == "BID" ? "Bid (Kaufkurs)" : "Ask (Verkaufskurs)"} className="w-100">
                                                <Dropdown.Item className="fnt-size-15" onClick={() => setState({ ...state, quoteType: "TRADE" })} eventKey="Kurs">Kurs</Dropdown.Item>
                                                <Dropdown.Divider style={{ margin: "0" }} />
                                                <Dropdown.Item className="fnt-size-15" onClick={() => setState({ ...state, quoteType: "BID" })} eventKey="Bid (Kaufkurs)">Bid (Kaufkurs)</Dropdown.Item>
                                                <Dropdown.Divider style={{ margin: "0" }} />
                                                <Dropdown.Item className="fnt-size-15" onClick={() => setState({ ...state, quoteType: "ASK" })} eventKey="Ask (Verkaufskurs)">Ask(Verkaufskurs)</Dropdown.Item>
                                            </DropdownButton>
                                        </div>
                                        <div className="ml-auto fs-18px" style={{ width: "50%", display: "inherit", fontSize: "16px !important" }}>
                                            <FormControl className={classNames("form-control form-control-sm text-right bg-border-gray border-0 rounded")}
                                                placeholder={"0"}
                                                value={state.price}
                                                type="number"
                                                min="0"
                                                onChange={control => setState({ ...state, price: Number.parseFloat(preformatFloat(control.target.value)) })}
                                            />
                                            <div className="input-group-append">
                                                <span className="input-group-text bg-border-gray line-height-1 pl-0 border-0 rounded-0">
                                                    {state.percent || state.trailing ?
                                                        "%"
                                                        : props.limit?.instrument?.currency.alphaCode || ""
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                    </Row>
                                </Col>
                                <Col className="pr-0 pl-md-3 pl-sm-0">
                                    <Row className="my-sm-3 mt-lg-1">
                                        <div className="col-12">
                                            <label htmlFor="noteInfoTextArea" className="legend-label d-block font-weight-bold fnt-size-15">
                                                <span className="svg-icon">
                                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                                                </span>
                                                Notiz
                                            </label>
                                            <div className="textarea-wrapper">
                                                <textarea rows={5} maxLength={250} className="d-block w-100 font-italic pt-2 pb-3  bg-border-gray border-0 pl-2" placeholder={state.memo || "Hier können Sie Ihre Notiz eingeben. (max. 250 Zeichen)"} value={state.memo?.toString() || ""}
                                                    onChange={control => setState({ ...state, memo: control.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="mt-md-3 mt-sm-0">
                                <Col md={6} xs={12} className="pl-0">
                                    <Button variant={""} className="pl-0" onClick={() => setState({ ...state, checked: !state.checked })}>
                                        {
                                            state.checked ?
                                                <img src="/static/img/svg/icon_checkbox_checked_dark.svg" width="20" alt="" className="" />
                                                :
                                                <img src="/static/img/svg/icon_checkbox_unchecked_dark.svg" width="20" alt="" className="" />
                                        }
                                        <span className="mt-2 align-middle">Per E-Mail benachrichtigen</span>
                                    </Button>
                                </Col>
                                <Col md={6} xs={12} className="text-md-right text-sm-left px-0 mb-2">
                                    <Button className="btn btn-pink with-icon-first mr-2" data-dismiss="modal"
                                        onClick={() => {
                                            const id = props.limit.id;
                                            deleteLimit({
                                                variables: {
                                                    limitId: id,
                                                },
                                                update(cache) {
                                                    const normalizedId = cache.identify({ id, __typename: 'LimitEntry' });
                                                    cache.evict({ id: normalizedId });
                                                    cache.gc();
                                                }
                                            })
                                                .then(() => {
                                                    setState({ ...state, opened: false, memo: "" });
                                                    setDelete(true);
                                                    if (props.refreshTrigger) {
                                                        props.refreshTrigger();
                                                    }
                                                });

                                        }
                                        }>
                                        <span className="svg-icon pr-1">
                                            <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_white.svg"} width="" className="" alt="" />
                                        </span>
                                        Löschen
                                    </Button>

                                    <Button variant="primary"
                                        className={classNames(validForm ? "" : "bg-border-gray text-kurs-grau border-border-gray")}
                                        onClick={() => {
                                            if (validForm) {
                                                editLimit({
                                                    variables: {
                                                        limitId: props.limit.id,
                                                        entry: {
                                                            instrumentId: props.limit.instrumentId,
                                                            trailing: state.trailing,
                                                            upper: state.upper,
                                                            percent: state.percent,
                                                            quoteType: state.quoteType,
                                                            limitValue: state.price,
                                                            smsNotification: false,
                                                            mailNotification: state.checked,
                                                            memo: state.memo
                                                        }
                                                    }
                                                })
                                                    .then(entry => {
                                                        setState({ ...state, opened: false, memo: "" });
                                                        setEdit(true);
                                                        if (props.refreshTrigger) {
                                                            props.refreshTrigger();
                                                        }
                                                    });
                                            }
                                        }}
                                    >
                                        {editLimitLoading && <Spinner animation="border" />} Änderungen speichern
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Container>
                </Modal.Body>
            </Modal>
            <ConfirmModal title="Limit bearbeiten" text="Ihr Limit wurde erfolgreich bearbeitet." isOpen={isEditDone} handleClose={handleEdit} />
            <ConfirmModal title="Limit löschen" text="Ihr Limit wurde erfolgreich gelöscht." isOpen={isDeleteDone} handleClose={handleDelete} />
        </>
    );
}
