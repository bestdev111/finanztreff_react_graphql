import { useState } from 'react';
import { Modal, Spinner } from "react-bootstrap";
import { WATCHLIST_ENTRY_DELETE } from '../query';
import { useMutation } from '@apollo/client';
import { Mutation, WatchlistEntry } from '../../../generated/graphql';
import { ModalHeaderMeinFinanztreff } from './ModalHeaderMeinFinanztreff';
import { ConfirmModal } from './MainSettingsModals/ConfirmModal';

export function DeleteWatchlistEntry(props: DeleteWatchlistEntryProps) {

    let [state, setState] = useState<DeleteWatchlistEntryState>({
        isDoneOpen: false,
        isModalOpen: true
    });

    let [mutation, { loading: mutationLoading }] = useMutation<Mutation>(WATCHLIST_ENTRY_DELETE);

    return (
        <>
            <Modal show={props.isOpen && state.isModalOpen} onHide={props.handleClose} className="modal bottom fade inner-modal modal-dialog-sky-placement" style={{ backgroundColor: "rgba(56, 56, 56, 0.62)" }}>
                <div className="modal-dialog modal-content inner-modal modal-lg" style={{ alignSelf: "center", borderRadius: "0.3em" }}>
                    <ModalHeaderMeinFinanztreff title="Löschen bestätigen" close={props.handleClose}/>
                    <Modal.Body className="modal-body bg-white">
                        <div>Hiermit wird der Wert
                            <b> "{props.entry.name}" </b>aus Ihrer Watchlist <b>"{props.watchlistName}"</b> gelöscht.<br/><br/>Möchten Sie fortfahren?</div>

                        <div className="button-row d-flex justify-content-end">
                            <button className="btn btn-primary bg-border-gray text-blue border-border-gray" onClick={props.handleClose}
                                submit-type="">
                                Abbrechen
                            </button>
                            <button className="btn btn-pink with-icon-first" onClick={() => {
                                const id = props.entry.id;
                                mutation({
                                    variables: {
                                        watchlistId: props.watchlistId,
                                        watchlistEntryId: id
                                    },
                                    update(cache) {
                                        const normalizedId = cache.identify({ id, __typename: 'WatchlistEntry' });
                                        cache.evict({ id: normalizedId });
                                        cache.gc();
                                    }
                                })
                                    .then(() => {
                                        setState({
                                            ...state,
                                            isDoneOpen: true
                                        });
                                    });
                            }} submit-type="">
                                <span className="svg-icon pr-1">
                                    <img src="/static/img/svg/icon_close_white.svg" width="" className="" alt="" />
                                </span>
                                {mutationLoading && <Spinner animation="border" />}
                                Löschen
                            </button>
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
            <ConfirmModal title="Löschen" text="Ihr Watchlist wurde erfolgreich gelöscht." isOpen={state.isDoneOpen} handleClose={props.handleClose} />
        </>
    );
}

interface DeleteWatchlistEntryProps {
    entry: WatchlistEntry
    watchlistId: number
    watchlistName: string
    handleClose: () => void;
    isOpen: boolean;
}

interface DeleteWatchlistEntryState {
    isDoneOpen: boolean
    isModalOpen: boolean
}