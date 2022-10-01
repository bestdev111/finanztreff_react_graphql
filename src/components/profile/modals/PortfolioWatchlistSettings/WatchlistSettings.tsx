import { Mutation, Watchlist } from 'graphql/types';
import {ReactNode, useEffect, useState} from 'react';
import { Button, Col, FormControl, Modal, Row } from 'react-bootstrap';
import classNames from "classnames";
import { useViewport } from "../../../../hooks/useViewport";
import { useMutation } from '@apollo/client';
import { DELETE_USER_WATCHLIST, RENAME_USER_WATCHLIST, UPDATE_USER_WATCHLIST } from '../../query';
import { ModalHeaderMeinFinanztreff } from '../ModalHeaderMeinFinanztreff';
import { PageHeaderFilterComponent } from 'components/layout/PageHeaderFilterComponent/PageHeaderFilterComponent';
import './PortfolioWatchlistSettings.scss';
import moment from 'moment';
import { CardHours, CardMinutes } from './TimeCards';
import SvgImage from 'components/common/image/SvgImage';
import { ConfirmModal } from '../MainSettingsModals/ConfirmModal';
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";


interface WatchlistSettingsState {
    isOpen: boolean
    isUpdateDoneOpen?: boolean
    isDeleteProcesingOpen?: boolean
    isRenameDoneOpen?: boolean
    isDeleteDoneOpen?: boolean

    name: string
    memo: string
    wd1: boolean,
    wd2: boolean,
    wd3: boolean,
    wd4: boolean,
    wd5: boolean,
    wd6: boolean,
    wd7: boolean,
    eom: boolean,
    wdTime?: moment.Moment
}

interface WatchlistSettingsProps {
    onComplete: () => void;
    watchlist: Watchlist;

    children?: ReactNode;
    className?: string;
}

// Einstellungen
export const WatchlistSettings = (props: WatchlistSettingsProps) => {
    const watchlist: Watchlist = props.watchlist;
    let [state, setState] = useState<WatchlistSettingsState>(
        {
            isOpen: false, memo: watchlist.memo || "",
            name: watchlist.name || "",
            wd1: watchlist.wd1, wd2: watchlist.wd2,
            wd3: watchlist.wd3, wd4: watchlist.wd4,
            wd5: watchlist.wd5, wd6: watchlist.wd6, wd7: watchlist.wd7,
            eom: watchlist.eom, wdTime: watchlist.wdTime
        });

    useEffect(() => {
        if (state.isOpen) {
            trigInfonline(guessInfonlineSection(), "watchlist_settings_modal");
        }
    }, [state.isOpen])

    let { width } = useViewport();
    let [time, setTime] = useState<{ hours: number, minutes: number }>({ hours: moment(watchlist.wdTime).hour() || 8, minutes: moment(watchlist.wdTime).minute() || 0 });
    let validFormRename = state.name !== '' && state.name !== watchlist.name;
    let validFormUpdate =
        (state.memo !== watchlist.memo) ||
        watchlist.eom !== state.eom || watchlist.wd1 !== state.wd1 || watchlist.wd2 !== state.wd2 || watchlist.wd3 !== state.wd3 || watchlist.wd4 !== state.wd4
        || watchlist.wd5 !== state.wd5 || watchlist.wd6 !== state.wd6 || watchlist.wd7 !== state.wd7
        || moment(watchlist.wdTime).hour() !== time.hours || moment(watchlist.wdTime).minute() !== time.minutes;


    let [renameWatchlist, { loading: renameWatchlistLoading }] = useMutation<Mutation>(RENAME_USER_WATCHLIST);
    let [deleteWatchlist, { loading: deleteWatchlistLoading }] = useMutation<Mutation>(DELETE_USER_WATCHLIST);
    let [updateWatchlist, { loading: updateWatchlistLoading }] = useMutation<Mutation>(UPDATE_USER_WATCHLIST);

    const handleMinutes = (value: number) => setTime({ ...time, minutes: value });
    const handleHours = (value: number) => setTime({ ...time, hours: value });

    const handleClose = () => setState({ ...state, isOpen: false, isRenameDoneOpen: false })

    return (
        <>
            <Button variant="link" className={classNames("text-white svg-icon action-icons", props.className)} onClick={() => setState({ ...state, isOpen: true })}>
                {props.children}
            </Button>
            <Modal show={state.isOpen} onHide={!state.isOpen} size="lg" className={classNames("fade modal-dialog-sky-placement", width < 576 && 'bottom')}>
                <ModalHeaderMeinFinanztreff title={"Watchlist - Einstellungen"} close={handleClose} />
                <Modal.Body className="modal-body bg-white w-100">
                    <Row className="px-xl-3 px-lg-3 px-md-3 px-sm-0">
                        <Col className="col-lg-12 d-flex justify-content-between px-md-0 px-sm-2 pt-4">
                            <FormControl className="form-control form-control-sm bg-gray-light border-0 font-weight-bold"
                                value={state.name}
                                onChange={control => setState({ ...state, name: control.target.value })}
                            />

                            <Button variant="primary"
                                className={classNames(validFormRename ? "ml-2" : "bg-border-gray text-kurs-grau border-border-gray ml-2")}

                                onClick={() => {
                                    if (validFormRename) {
                                        renameWatchlist({
                                            variables: {
                                                watchlistId: watchlist.id,
                                                newName: state.name,
                                            }
                                        })
                                            .then(() => {
                                                setState({
                                                    ...state,
                                                    isRenameDoneOpen: true
                                                });
                                            });
                                    }
                                }
                                }>Umbenennen</Button>

                        </Col>
                    </Row>
                    {state.isRenameDoneOpen &&
                        <Row className="border-bottom-2 border-gray-light px-xl-3 px-lg-3 px-md-3 px-sm-2 pb-3">
                            <SvgImage icon="icon_check_hook_green.svg" convert={false}
                                spanClass="green-icon mr-1" imgClass="green-check-icon"
                                width="15" /><span className='fs-13px text-gray align-self-end'>Watchlist wurde erfolgreich umbenannt</span>

                        </Row>
                    }
                    <Col className="border-bottom-2 border-gray-light  px-xl-3 px-lg-3 px-md-3 px-sm-2 pt-4 pb-2">
                        <Row className="fs-18px font-weight-bold roboto-heading">
                            Benachrichtigung per E-Mail schicken
                        </Row>
                        <Row className="">
                            <Col className="col-lg-6 col-sm-12 px-0 pt-2 pb-2">
                                <Row className='d-flex weekly-buttons'>
                                    <Button onClick={() => setState({ ...state, wd1: !state.wd1 })}
                                        variant={'inline-inverse'} className={classNames("px-0 mr-1", state.wd1 && "active")}>
                                        Mo
                                    </Button>
                                    <Button onClick={() => setState({ ...state, wd2: !state.wd2 })}
                                        variant={'inline-inverse'} className={classNames("px-0 mr-1", state.wd2 && "active")}>
                                        Di
                                    </Button>
                                    <Button onClick={() => setState({ ...state, wd3: !state.wd3 })}
                                        variant={'inline-inverse'} className={classNames("px-0 mr-1", state.wd3 && "active")}>
                                        Mi
                                    </Button>
                                    <Button onClick={() => setState({ ...state, wd4: !state.wd4 })}
                                        variant={'inline-inverse'} className={classNames("px-0 mr-1", state.wd4 && "active")}>
                                        Do
                                    </Button>
                                    <Button onClick={() => setState({ ...state, wd5: !state.wd5 })}
                                        variant={'inline-inverse'} className={classNames("px-0 mr-1", state.wd5 && "active")}>
                                        Fr
                                    </Button>
                                    <Button onClick={() => setState({ ...state, wd6: !state.wd6 })}
                                        variant={'inline-inverse'} className={classNames("px-0 mr-1", state.wd6 && "active")}>
                                        Sa
                                    </Button>
                                    <Button onClick={() => setState({ ...state, wd7: !state.wd7 })}
                                        variant={'inline-inverse'} className={classNames("px-0", state.wd7 && "active")}>
                                        So
                                    </Button>
                                </Row>
                                {(state.wd1 || state.wd2 || state.wd3 || state.wd4 || state.wd5 || state.wd6 || state.wd7) &&
                                    <Row className="d-flex justify-content-center my-3">
                                        <span className='d-inline'>Immer um</span>
                                        <div className="time-card bg-gray-light mx-1">
                                            <PageHeaderFilterComponent
                                                variant={"inline-inverse"}
                                                toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}
                                                title={formatTime(time.hours)}
                                                toggleVariant={"inline-blue-dropdown"}>
                                                <CardHours hours={time.hours} handleHours={handleHours} />
                                            </PageHeaderFilterComponent>
                                        </div> :
                                        <div className="time-card bg-gray-light mx-1">
                                            <PageHeaderFilterComponent
                                                variant={"inline-inverse"}
                                                toggleIcon={process.env.PUBLIC_URL + "/static/img/svg/icon_direction_down_dark.svg"}
                                                title={<span className="font-weight-normal">{formatTime(time.minutes)}</span>}
                                                toggleVariant={"inline-blue-dropdown"}>
                                                <CardMinutes handleMinutes={handleMinutes} minutes={time.minutes} />
                                            </PageHeaderFilterComponent>
                                        </div>
                                        <div>Uhr</div>
                                    </Row>
                                }
                            </Col>
                            <Col className="pt-2 pb-2">
                                <Row className='justify-content-end'>
                                    <Button onClick={() => setState({ ...state, eom: !state.eom })}
                                        variant={'inline-inverse'} className={classNames("mr-0 montly-button", state.eom && "active")}>Monatlich</Button>
                                </Row>
                                {state.eom &&
                                    <Row className="d-flex justify-content-end my-3">
                                        <span className="mr-2 pr-1">Immer Monatsende nach US-Börsenschluss</span>
                                    </Row>
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Row>
                        <Col className="px-xl-3 px-lg-3 px-md-3 px-sm-2">
                            <label htmlFor="noteInfoTextArea" className="font-weight-bold mt-3 fs-18px">
                                <span className="svg-icon">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_note.svg"} width="28" alt="" className="" />
                                </span>
                                Watchlist - Notiz
                            </label>
                            <div className="">
                                <textarea className="w-100 font-italic textarea-wrapper bg-gray-light border-0" maxLength={250} value={state.memo?.toString()} placeholder={state.memo?.toString() || "Hier können Sie Ihre Notiz eingeben. (max. 250 Zeichen)"}
                                    onChange={control => setState({ ...state, memo: control.target.value })}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className="d-flex justify-content-between mt-4">
                        <Col className="pb-3 pb-md-1 px-xl-3 px-lg-3 px-md-3 px-sm-2">
                            <Button variant="pink d-flex"
                                onClick={() => setState({
                                    ...state,
                                    isDeleteProcesingOpen: true
                                })}>
                                <span className="svg-icon pr-1 align-middle">
                                    <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_white.svg"} width="" className="pt-n1" alt="" />
                                </span>
                                <span className='align-middle'>
                                    <span className="d-none d-lg-inline d-md-inline">Watchlist löschen</span>
                                    <span className="d-xl-none d-lg-none d-md-none d-sm-inline">WL löschen</span>
                                </span>
                            </Button>
                        </Col>
                        <Col className="pb-3 pb-md-1 d-flex justify-content-end px-xl-3 px-lg-3 px-md-3 px-sm-2">
                            <Button className="btn btn-primary bg-border-gray text-blue border-border-gray mr-2" onClick={() => setState({ ...state, isOpen: false })}>
                                Abbrechen
                            </Button>
                            <Button className="btn btn-primary" disabled={!validFormUpdate}
                                onClick={() => {
                                    updateWatchlist({
                                        variables: {
                                            entry: {
                                                watchlistId: watchlist.id,
                                                wd1: state.wd1,
                                                wd2: state.wd2,
                                                wd3: state.wd3,
                                                wd4: state.wd4,
                                                wd5: state.wd5,
                                                wd6: state.wd6,
                                                wd7: state.wd7,
                                                eom: state.eom,
                                                wdTime: moment().set({ hour: time.hours, minute: time.minutes, second: 0, millisecond: 0 }).toISOString(),
                                                memo: state.memo
                                            }
                                        }
                                    })
                                        .then(() => {
                                            setState({
                                                ...state,
                                                isOpen: false,
                                                isRenameDoneOpen: false,
                                                isUpdateDoneOpen: true
                                            });
                                        });

                                }}>
                                Speichern<span className="d-none d-lg-inline d-md-inline"> und schließen</span>
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            <Modal show={state.isDeleteProcesingOpen} size="lg" onHide={() => setState({ ...state, isOpen: false, isDeleteProcesingOpen: false })}
                className={classNames("modal-dialog-sky-placement modal-background", width < 576 && 'bottom')}>
                <ModalHeaderMeinFinanztreff title="Löschen bestätigen" close={() => setState({ ...state, isOpen: false, isDeleteProcesingOpen: false })} />
                <Modal.Body className="bg-white fs-15px">
                    <p>Hiermit wird Ihr Watchlist "<span className="font-weight-bold">{watchlist.name! || ""}</span>"  inkl. Konto, Transaktionen und sonstigen Auswertungen
                        <span className="font-weight-bold"> endgültig gelöscht</span>.</p>
                    <p>Möchten Sie fortfahren?</p>
                    <div className="button-row d-flex justify-content-end">
                        <button className="btn btn-primary bg-border-gray text-blue border-border-gray" onClick={() => setState({ ...state, isDeleteProcesingOpen: false })}>
                            Abbrechen
                        </button>
                        <button className="btn btn-pink with-icon-first" data-dismiss="modal"
                            onClick={() => {
                                const id = watchlist.id;
                                deleteWatchlist({
                                    variables: {
                                        watchlistId: id,
                                    },
                                    update(cache) {
                                        const normalizedId = cache.identify({ id, __typename: 'Watchlist' });
                                        cache.evict({ id: normalizedId });
                                        cache.gc();
                                    }
                                })
                                    .then(() => {
                                        setState({
                                            ...state,
                                            isDeleteProcesingOpen: false,
                                            isOpen: false,
                                            isRenameDoneOpen: false,
                                            isDeleteDoneOpen: true
                                        });
                                    });

                            }
                            }>
                            <span className="svg-icon pr-1">
                                <img src={process.env.PUBLIC_URL + "/static/img/svg/icon_close_white.svg"} width="" className="" alt="" />
                            </span>
                            Löschen
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
            <ConfirmModal title={<><img src="/static/img/svg/icon_check_hook_green.svg" width="16" alt="" className="mr-1" />Ihre Einstellungen wurden gespeichert</>}
                text={<></>}
                isOpen={state.isUpdateDoneOpen || false} handleClose={() => setState({ ...state, isUpdateDoneOpen: false })} />
            <ConfirmModal title={<><img src="/static/img/svg/icon_check_hook_green.svg" width="16" alt="" className="mr-1" />Löschen erfolgreich</>}
                text={<>Sie haben erfolgreich Ihre Watchlist zu <b>{state.name}</b> gelöscht!</>}
                isOpen={state.isDeleteDoneOpen || false} handleClose={() => setState({ ...state, isDeleteDoneOpen: false })} />
        </>
    );
}

function formatTime(value: number) {
    return value > 9 ? value.toString() : ("0" + value);
}
