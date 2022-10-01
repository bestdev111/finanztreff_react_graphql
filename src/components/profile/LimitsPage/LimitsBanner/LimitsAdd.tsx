import { ReactNode, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ButtonVariant } from "react-bootstrap/types";
import { LimitEntry, Mutation, Query } from "generated/graphql";
import { CREATE_LIMIT_ENTRY } from "../../query";
import { Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, Modal, Row, Spinner } from "react-bootstrap";
import classNames from "classnames";
import { ProfileSelectInstrument } from "components/common/profile/common/ProfileSelectInstrument/ProfileSelectInstrument";
import { ProfileSelectInstrumentGroup } from "components/common/profile/common/ProfileSelectInstrumentGroup/ProfileSelectInstrumentGroup";
import { loader } from "graphql.macro";
import './Limits.scss';
import { formatDate, formatPrice, numberFormatWithSign } from "utils";
import { getAssetGroup, getColorOfAssetGroup, preformatFloat } from "components/profile/utils";
import SvgImage from "components/common/image/SvgImage";
import { AddLimitConfirmModal } from "./AddLimitConfirmModal";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { guessInfonlineSection, trigInfonline } from "../../../common/InfonlineService";


export const LimitsAdd = (props: LimitsAddProps) => {

    let [state, setState] = useState<LimitsAddState>({ opened: false, limitType: "", price: undefined, upper: undefined, quoteType: "TRADE", checked: false, newEntry: null });
    const [isDone, setDone] = useState(false);
    const handleDone = () => setDone(false);

    let { data: instrumentGroupData, loading: instrumentGroupLoading } = useQuery<Query>(
        loader('./getInstrumentGroupUserLimits.graphql'),
        { variables: { groupId: state.instrumentGroupId }, skip: !state.instrumentGroupId || !state.opened },
    );
    let { data: instrumentData, loading: instrumentLoading } = useQuery<Query>(
        loader('./getInstrumentUserLimits.graphql'),
        { variables: { instrumentId: state.instrumentId }, skip: !state.instrumentId || !state.opened },
    );

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(CREATE_LIMIT_ENTRY);
    const close = () => setState({ opened: false, limitType: "", price: 0, upper: undefined, quoteType: "TRADE", checked: false, newEntry: null, memo: undefined });

    let validForm = (state.instrumentId || props.instrumentId) && state.limitType != "" && state.price && state.price !== 0 && state.quoteType && state.upper !== undefined;
    useEffect(() => {
        if (state.opened) {
            trigInfonline(guessInfonlineSection(), "new_limit");
        }
    }, [state.opened])
    return (
        <>
            <Button variant={props.variant} className={props.className || undefined} onClick={() => {
                setState({
                    ...state,
                    opened: true, instrumentGroupId: undefined, instrumentId: undefined,
                    ...props
                });
                props.onOpen && props.onOpen();
            }}>
                {props.children}
            </Button>
            <Modal show={state.opened} onHide={close} size="lg" className="limit-add-modal modal-background fade modal-dialog-sky-placement">

                <ModalHeaderMeinFinanztreff title={
                    <>
                        <SvgImage icon="icon_add_limit_dark.svg" convert={false} width="25" />
                        <span className="align-middle fs-18px">Limit</span>
                    </>
                } close={close} />
                <Modal.Body className="border-0 bg-white modal-form input-bg ">
                    <Container className="px-0 px-sm-1">
                        <Row className="row-cols-lg-2 row-cols-sm-1 mt-sm-3">
                            <Col className="pl-0">
                                <Form.Group as={Row} className="row">
                                    <Form.Label className="col-sm-4 col-form-label col-form-label-sm text-right pr-0 fnt-size-15">Wertpapier</Form.Label>
                                    <Col className="col-8 pr-md-0 pr-sm-3">
                                        {
                                            instrumentGroupLoading ?
                                                <Form.Text><Spinner animation="border" size="sm" /></Form.Text> :
                                                <ProfileSelectInstrumentGroup
                                                    callback={value => value ? setState({ ...state, instrumentGroupId: value.id, instrumentId: undefined }) : undefined}
                                                    value={instrumentGroupData?.group?.name || undefined}
                                                />
                                        }
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="form-group row justify-content-lg-start">
                                    <Form.Label className="col-sm-4 col-form-label col-form-label-sm text-right pr-0 fnt-size-15">Börsenplatz</Form.Label>
                                    <Col className="col-8 pr-md-0 pr-sm-3">
                                        {
                                            instrumentLoading || instrumentGroupLoading ?
                                                <Form.Text><Spinner animation="border" size="sm" /></Form.Text> :
                                                <ProfileSelectInstrument
                                                    group={instrumentGroupData?.group || undefined}
                                                    value={(state.instrumentId && instrumentData?.instrument?.exchange?.name) || undefined}
                                                    instruments={instrumentGroupData?.group?.content || []} callback={value => value ? setState({ ...state, instrumentId: value.id }) : undefined}
                                                />
                                        }
                                    </Col>
                                </Form.Group>
                            </Col>
                            {instrumentData &&
                                <Col className="pr-0">
                                    <div className="left-side d-flex align-items-center mt-2">
                                        {instrumentData.instrument && instrumentData.instrument?.group.assetGroup &&
                                            <span className={"asset-type mr-2 py-1"} style={{ backgroundColor: getColorOfAssetGroup(instrumentData.instrument?.group.assetGroup) }}>{getAssetGroup(instrumentData?.instrument?.group.assetGroup)}</span>
                                        }
                                        <span className="wkn-info px-2 fs-13px"><span>WKN:</span> {instrumentGroupData?.group?.wkn}</span>
                                        <span className="isin-info px-2 fs-13px"><span>ISIN:</span> {instrumentGroupData?.group?.isin}</span>

                                    </div>
                                    <div className="mt-4">
                                        {instrumentData.instrument?.snapQuote?.quote?.value && instrumentData?.instrument?.currency?.alphaCode &&
                                            <span className="fs-18px font-weight-bold">
                                                {formatPrice(instrumentData.instrument?.snapQuote?.quote?.value, instrumentData?.instrument?.group?.assetGroup, instrumentData.instrument?.snapQuote?.quote?.value, instrumentData.instrument.currency.alphaCode,)}
                                            </span>
                                        }
                                        <span className={classNames("fs-18px font-weight-bold ml-4", instrumentData.instrument?.snapQuote?.quote?.percentChange && instrumentData.instrument?.snapQuote?.quote?.percentChange > 0 ? "text-green" : instrumentData.instrument?.snapQuote?.quote?.percentChange === 0 ? "" : " text-red")}>
                                            {numberFormatWithSign(instrumentData && instrumentData.instrument?.snapQuote?.quote?.percentChange, " %")}
                                        </span>
                                        {instrumentData.instrument?.snapQuote?.quote?.when &&
                                            <span className="fs-13px ml-4">
                                                {formatDate(instrumentData.instrument?.snapQuote?.quote?.when)}
                                            </span>
                                        }
                                    </div>
                                </Col>
                            }
                        </Row>
                        <Container className={(!instrumentData || !instrumentGroupData) ? "limits-inactive" : ""} >
                            <Row className="row-cols-lg-2 row-cols-sm-1 border-top pt-1 limit-options">
                                <Col>
                                    <h6 className="fnt-size-15 font-weight-bold mt-2 mb-3 ml-n3">Limit einstellen</h6>
                                    <Row className="justify-content-between limit-types">
                                        <Button onClick={() => setState({ ...state, limitType: "Absolut" })} style={{ height: "fit-content" }} className={state.limitType == "Absolut" ? "btn active text-nowrap" : "btn text-nowrap"}>
                                            <SvgImage icon="icon_absolute.svg" imgClass={state.limitType == "Absolut" ? "svg-white" : "svg-blue"} convert={true} width="20" />
                                            <span className="mx-1">Absolut</span>
                                        </Button>
                                        <Button onClick={() => setState({ ...state, limitType: "Relativ" })} style={{ height: "fit-content" }} className={state.limitType == "Relativ" ? "btn active text-nowrap" : "btn text-nowrap"}>
                                            <SvgImage icon="icon_percent.svg" imgClass={state.limitType == "Relativ" ? "svg-white" : "svg-blue"} convert={true} width="20" />
                                            <span className="mx-1">Relativ</span>
                                        </Button>
                                        <Button onClick={() => setState({ ...state, limitType: "Trailing" })} style={{ height: "fit-content" }} className={state.limitType == "Trailing" ? "btn active text-nowrap" : "btn text-nowrap"}>
                                            <SvgImage icon="icon_repeat.svg" imgClass={state.limitType == "Trailing" ? "svg-white" : "svg-blue"} convert={true} width="20" />
                                            <span className="mx-1">Trailing</span>
                                        </Button>
                                    </Row>
                                    <Row className="justify-content-between mt-4 upper-down-limit">
                                        <Button onClick={() => setState({ ...state, upper: true })} className={state.upper ? "btn upper active" : "btn"}>
                                            <SvgImage icon="icon_limit_top.svg" imgClass={state.upper ? "svg-white" : "svg-blue"} convert={true} width="20" />
                                            <span className="mx-1">Oberes Limit</span>
                                        </Button>
                                        <Button onClick={() => setState({ ...state, upper: false })} className={state.upper == false ? "btn down active" : "btn"}>
                                            <SvgImage icon="icon_limit_bottom.svg" imgClass={state.upper == false ? "svg-white" : "svg-blue"} convert={true} width="20" />
                                            <span className="mx-1">Unteres Limit</span>
                                        </Button>
                                    </Row>
                                    <Row className="mt-2 quote-types">
                                        <div className="" style={{ width: "48%" }}>
                                            <DropdownButton title={state.quoteType == "TRADE" ? "Kurs" : state.quoteType == "BID" ? "Bid (Kaufkurs)" : "Ask (Verkaufskurs)"} className="w-100">
                                                <Dropdown.Item className="fnt-size-15" onClick={() => setState({ ...state, quoteType: "TRADE" })} eventKey="Kurs">Kurs</Dropdown.Item>
                                                <Dropdown.Divider style={{ margin: "0" }} />
                                                <Dropdown.Item className="fnt-size-15" onClick={() => setState({ ...state, quoteType: "BID" })} eventKey="Bid (Kaufkurs)">Bid (Kaufkurs)</Dropdown.Item>
                                                <Dropdown.Divider style={{ margin: "0" }} />
                                                <Dropdown.Item className="fnt-size-15" onClick={() => setState({ ...state, quoteType: "ASK" })} eventKey="Ask (Verkaufskurs)">Ask (Verkaufskurs)</Dropdown.Item>
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
                                            {(instrumentData && instrumentData?.instrument?.currency.alphaCode) &&
                                                <div className="input-group-append">
                                                    <span className="input-group-text line-height-1 pl-0 border-0 rounded-0">
                                                        {state.limitType == "Absolut" ?
                                                            instrumentData.instrument.currency.alphaCode
                                                            : "%"
                                                        }
                                                    </span>
                                                </div>
                                            }
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
                                <Col md={6} xs={12} className="text-md-right text-sm-left px-0 mb-3">
                                    <Button variant="primary"
                                        className={classNames(validForm ? "" : "bg-border-gray text-kurs-grau border-border-gray")}
                                        onClick={() => {
                                            if (validForm) {
                                                trigInfonline(guessInfonlineSection(), "save_limit")

                                                mutation({
                                                    variables: {
                                                        entry: {
                                                            instrumentId: props.instrumentId || state.instrumentId,
                                                            trailing: state.limitType == "Trailing",
                                                            upper: state.upper,
                                                            percent: state.limitType == "Relativ",
                                                            quoteType: state.quoteType,
                                                            limitValue: state.price,
                                                            smsNotification: false,
                                                            mailNotification: state.checked,
                                                            memo: state.memo
                                                        }
                                                    },
                                                })
                                                    .then(entry => {
                                                        setState({ ...state, opened: false, currency:  "", memo: undefined, newEntry: entry.data?.addLimit, price: undefined });
                                                        setDone(true);
                                                        if (props.refreshTrigger && entry.data?.addLimit) {
                                                            props.refreshTrigger();
                                                        }
                                                    });
                                            }
                                        }}
                                    >
                                        {mutationLoading && <Spinner animation="border" />} Speichern
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Container>
                </Modal.Body>
            </Modal>
            {state.newEntry &&
                <AddLimitConfirmModal isOpen={isDone} handleClose={handleDone} entry={state.newEntry} currencyCode={state.currency} />
            }
        </>
    )
}

interface LimitsAddProps {
    instrumentGroupId?: number;
    instrumentId?: number;
    refreshTrigger?: () => void;
    onOpen?: () => void;
    children: ReactNode;

    variant?: ButtonVariant;
    className?: string;
    innerModal?: boolean;
}

interface LimitsAddState {
    opened: boolean;
    instrumentGroupId?: number;
    instrumentId?: number;
    newEntry: LimitEntry | any;
    currency?: string;

    limitType: string;
    upper?: boolean;
    quoteType: string;
    price?: number;
    memo?: string;
    checked: boolean;
}
