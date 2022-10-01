import {Button, Col, Container, Form, Modal, Row, Spinner} from "react-bootstrap";
import {ReactNode, useEffect, useState} from "react";
import {Mutation, Query, WatchlistEntry} from "../../../../generated/graphql";
import {useMutation, useQuery} from "@apollo/client";
import {loader} from "graphql.macro";
import {ProfileSelectInstrumentGroup} from "../common/ProfileSelectInstrumentGroup/ProfileSelectInstrumentGroup";
import {ProfileSelectInstrument} from "../common/ProfileSelectInstrument/ProfileSelectInstrument";

import classNames from "classnames";
import {ProfileSelectWatchList} from "./ProfileSelectWatchlist";
import {ButtonVariant} from "react-bootstrap/types";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { ConfirmModal } from "components/profile/modals/MainSettingsModals/ConfirmModal";
import {guessInfonlineSection, trigInfonline} from "../../InfonlineService";

export const WatchlistInstrumentAdd = (props: WatchlistInstrumentAddProps) => {
    let [state, setState] = useState<WatchlistInstrumentAddState>({opened: false,memo:''});
    let {data: watchlistData, loading: watchlistLoading} = useQuery<Query>(loader('./getUserWatchListsAdd.graphql'),{
    skip : !state.instrumentGroupId || !state.opened
    });
    let {data: instrumentGroupData, loading: instrumentGroupLoading} = useQuery<Query>(
        loader('./getInstrumentGroupUserWatchList.graphql'),
        {variables: {groupId: state.instrumentGroupId}, skip: !state.instrumentGroupId || !state.opened},
    );
    let {data: instrumentData, loading: instrumentLoading} = useQuery<Query>(
        loader('./getInstrumentUserWatchList.graphql'),
        {variables: {instrumentId: state.instrumentId}, skip: !state.instrumentId || !state.opened},
    );

    let [mutation, {loading: mutationLoading}] = useMutation<Mutation>(loader('./createWatchlistEntry.graphql'));


    if (instrumentData?.instrument?.snapQuote?.lastPrice && state.price !== ("" + instrumentData.instrument.snapQuote.lastPrice)) {
        setState({...state, price: instrumentData.instrument.snapQuote.lastPrice.toString()});
    }

    if (!watchlistLoading) {
        if (state.watchlistId) {
            let watchlist = watchlistData?.user?.profile?.watchlists?.find(current => current.id === state.watchlistId);
            if (watchlist) {
                if (state.watchlistName !== watchlist.name) {
                    setState({...state, watchlistName: watchlist.name || ""});
                }
            }
        }
    }

    let validForm = state.instrumentId && state.watchlistId && state.watchlistName;
    const [isDone, setDone] = useState(false);
    const handleDone = () => setDone(false);

    return (
        <>
            <Button variant={props.variant} className={props.className || undefined} onClick={() => {
                setState({
                    ...state,
                    opened: true, watchlistId: undefined, instrumentGroupId: undefined, instrumentId: undefined,
                    ...props
                });
                trigInfonline(guessInfonlineSection(), "add_to_watchlist")
            }}>
                {props.children}
            </Button>
            <Modal show={state.opened} onHide={() => setState({...state, opened: false})}
                   size="lg"
                   className="profile-modals portfolio-instrument-add modal-dialog-sky-placement">
                <ModalHeaderMeinFinanztreff title="Zu Watchlist hinzufügen" close={() => setState({...state, opened: false})} />
                <Modal.Body className="border-0 bg-white">
                    <section className="main-section mt-2">
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
                                                        <Form.Text><Spinner animation="border" size="sm"/></Form.Text> :
                                                        <ProfileSelectInstrumentGroup
                                                            callback={value => value ? setState({...state, instrumentGroupId: value.id, instrumentId: undefined}) : undefined}
                                                            value={instrumentGroupData?.group?.name || undefined}
                                                        />
                                                }
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="form-group row justify-content-sm-end justify-content-lg-start">
                                                <Form.Label className="col-sm-3 col-form-label col-form-label-sm text-right pr-0">Börsenplatz</Form.Label>
                                                <Col className="col-lg-9 col-sm-7">
                                                {
                                                    instrumentLoading || instrumentGroupLoading ?
                                                        <Form.Text><Spinner animation="border" size="sm"/></Form.Text> :
                                                        <ProfileSelectInstrument
                                                            group={instrumentGroupData?.group || undefined}
                                                            value={(state.instrumentId && instrumentData?.instrument?.exchange?.name) || undefined}
                                                            instruments={instrumentGroupData?.group?.content || []} callback={value => value ? setState({...state, instrumentId: value.id}) : undefined}
                                                        />
                                                }
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="form-group justify-content-sm-end justify-content-lg-start mt-5">
                                                <Form.Label className="col-sm-3 col-form-label col-form-label-sm text-right pr-0">Watchlist</Form.Label>
                                                <Col className="col-lg-9 col-sm-7">
                                                {watchlistLoading ?
                                                    <Spinner animation="border"/> :
                                                        watchlistData?.user?.profile?.watchlists &&
                                                            <ProfileSelectWatchList
                                                                watchlists={watchlistData?.user?.profile?.watchlists || []}
                                                                callback={value => setState({...state, watchlistId : value})}
                                                                watchlistId={state.watchlistId}
                                                                value={watchlistData?.user?.profile?.watchlists ? watchlistData?.user?.profile?.watchlists.find(current => current.id === state.watchlistId)?.name || "" : ""}
                                                            />
                                                }
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col> &nbsp; </Col>
                                    </Row>

                                    <div className="row">
                                        <div className="col-12">
                                            <label htmlFor="noteInfoTextArea" className="legend-label d-block font-weight-bold margin-top-15 fnt-size-15">
                                                <span className="svg-icon">
                                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className=""/>
                                                </span>
                                                Notiz
                                            </label>
                                            <div className="textarea-wrapper">
                                                <textarea maxLength={250} className="d-block w-100 font-italic" placeholder={"Hier können Sie Ihre Notiz eingeben. (max. 250 Zeichen)"} value={state.memo?.toString() || ""}
                                                 onChange={control => setState({...state, memo: control.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Form>

                                <div className="button-row margin-top-12 d-flex justify-content-end">
                                    <Button variant="primary"
                                            className={classNames(validForm ? "" :"bg-border-gray text-kurs-grau border-border-gray")}
                                            onClick={() => {
                                                trigInfonline(guessInfonlineSection(), "add_to_watchlist");
                                                if (validForm) {
                                                    mutation({
                                                        variables: {
                                                            watchlistId: state.watchlistId,
                                                            instrumentId: state.instrumentId,
                                                            price: Number.parseFloat(state.price || "0"),
                                                            memo: state.memo
                                                        }
                                                    })
                                                        .then(entry => {
                                                            setState({...state, opened: false});
                                                            setDone(true);
                                                            if (props.onComplete) {
                                                                props.onComplete(entry.data?.createWatchlistEntry || undefined);
                                                            }
                                                        });
                                                }
                                            }}
                                    >
                                        {mutationLoading && <Spinner animation="border"/>} Hinzufügen
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </section>
                </Modal.Body>
            </Modal>
            <ConfirmModal title="Zur Watchlist hinzufügen" text="Ihr Wertpapier wurde erfolgreich hinzugefügt." isOpen={isDone} handleClose={handleDone}/>
        </>
    )
}

interface WatchlistInstrumentAddProps {
    watchlistId?: number;
    instrumentGroupId?: number;
    instrumentId?: number;
    onComplete?: (value?: WatchlistEntry) => void;
    onOpen?: () => void;
    children: ReactNode;

    variant?: ButtonVariant;
    className?: string;
}


interface WatchlistInstrumentAddState {
    opened: boolean;
    watchlistId?: number;
    watchlistName?: string;
    instrumentGroupId?: number;
    instrumentId?: number;

    price?: string;
    memo?: string;
}
