import {ReactNode, useEffect, useState} from 'react';
import { Button, Col, Modal, Row } from "react-bootstrap";
import { Mutation, Watchlist, WatchlistEntry } from '../../../generated/graphql';
import { DeleteWatchlistEntry } from './DeleteWatchlistEntry';
import { ModalHeaderMeinFinanztreff } from './ModalHeaderMeinFinanztreff';
import { useMutation } from '@apollo/client';
import { WATCHLIST_ENTRY_EDIT } from '../query';
import classNames from 'classnames';
import {guessInfonlineSection, trigInfonline} from "../../common/InfonlineService";
import { CopyAssetToOtherWatchlist } from './MainSettingsModals/CopyAssetToOtherWatchlist';

// Bearbeiten Watchlist
export function EditWatchlistEntry(props: DeleteWatchlistEntryProps) {

    let [state, setState] = useState<DeleteWatchlistEntryState>({
        isDoneOpen: false,
        isOpen: false,
        memo: props.entry.memo || ""
    });

    useEffect(() => {
        if(state.isOpen) {
            trigInfonline(guessInfonlineSection(), "edit_watchlist")
        }
    }, [state.isOpen])

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const handleClose = () => {
        setDeleteModalOpen(false);
    }

    let [editWatchlistEntry, loading] = useMutation<Mutation>(WATCHLIST_ENTRY_EDIT);

    return (
        <>
            <div className="top d-flex justify-content-center" onClick={() => setState({ ...state, isOpen: true })}>
                {props.children}
            </div>
            <Modal show={state.isOpen} onHide={() => setState({ ...state, isOpen: false })} size="lg" className="limit-add-modal modal-dialog-sky-placement" style={{ backgroundColor: "rgba(56, 56, 56, 0.6)" }}>
                <ModalHeaderMeinFinanztreff title={
                    <>
                        <div className='text-truncate mt-1'>Watchlist <span className="d-md-inline d-sm-none">- Eintrag bearbeiten</span></div>
                        <div className='fs-15px text-gray text-truncate roboto-heading-without-slab'>{props.entry.name}</div>
                    </>
                } close={() => setState({ ...state, isOpen: false, memo: props.entry.memo || '' })} />
                <Modal.Body className="modal-body bg-white">
                    <Row className="mt-2 ml-sm-1">
                        <Col xl={9} lg={9} className="d-flex pl-0">
                            <span className="icon-note svg-icon top-move pr-2">
                                <img src="/static/img/svg/icon_note.svg" width="29" className="" alt="" />
                            </span>
                            <textarea className="d-block w-100 font-italic" maxLength={250} value={state.memo} placeholder={"Hier können Sie Ihre Notiz eingeben. (max. 250 Zeichen)"}
                                onChange={control => setState({ ...state, memo: control.target.value })}
                            />
                        </Col>
                    </Row>
                    <Row className="my-2 d-flex justify-content-between">
                        <div className='d-md-flex justify-content-between col-lg-9 col-md-6 w-50 pr-2 pl-xl-3 pl-sm-4'>
                            <CopyAssetToOtherWatchlist watchlist={props.watchlist} entry={props.entry} refreshTrigger={props.refreshTrigger} handleClose={handleClose}/>
                            <span className=''><Button className={classNames("btn btn-primary")} disabled={state.memo===props.entry.memo}
                                onClick={() => {
                                    if (props.watchlist.id && props.entry.id) {
                                        editWatchlistEntry({
                                            variables: {
                                                entry: {
                                                    watchlistId: props.watchlist.id,
                                                    watchlistEntryId: props.entry.id,
                                                    memo: state.memo
                                                }
                                            }
                                        })
                                            .then(entry => {
                                                if (props.refreshTrigger) {
                                                    props.refreshTrigger();
                                                }
                                                setState({ ...state, isOpen: false, memo: props.entry.memo || '' });
                                            });
                                    }
                                }} ><span className="d-none d-xl-inline">Notiz speichern</span> <span className="d-xl-none d-inline">Speichern</span>
                            </Button></span>
                        </div>
                        <div className='text-right col-lg-3 col-md-6 w-50'>
                            <button className="btn btn-pink with-icon-first text-nowrap" onClick={() => setDeleteModalOpen(true)}>
                                <span className="svg-icon pr-1">
                                    <img src="/static/img/svg/icon_close_white.svg" width="" className="" alt="" />
                                </span>
                                Eintrag löschen
                            </button>
                        </div>
                    </Row>
                </Modal.Body>
            </Modal>
            {deleteModalOpen &&
                <DeleteWatchlistEntry watchlistName={props.watchlist.name || ""} handleClose={handleClose} isOpen={deleteModalOpen} entry={props.entry} watchlistId={props.watchlist.id} />
            }
        </>
    );
}

interface DeleteWatchlistEntryState {
    isOpen: boolean,
    isDoneOpen: boolean,
    memo: string | undefined;
}
interface DeleteWatchlistEntryProps {
    watchlist: Watchlist
    entry: WatchlistEntry
    children: ReactNode
    refreshTrigger: () => void;
}
