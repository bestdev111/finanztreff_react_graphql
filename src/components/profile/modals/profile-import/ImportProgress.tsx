import { useMutation, useQuery } from '@apollo/client';
import { IMPORT_PROFILE, IMPORT_PROFILE_CHECK } from 'components/profile/query';
import { Mutation, Query } from 'graphql/types';
import { useState } from 'react';
import { Modal, Spinner } from "react-bootstrap";
import { ModalHeaderMeinFinanztreff } from '../ModalHeaderMeinFinanztreff';

export function ImportProgress(props: ImportProgressProps) {

    const [state, setState] = useState<ImportProgressState>({ isPolling: false, isOpen: props.isOpen, isDone: false });

    const { loading, error, data, startPolling, stopPolling } = useQuery<Query>(IMPORT_PROFILE_CHECK, { fetchPolicy: "no-cache" });
    
    if (!state.isDone) {
        if (!state.isPolling) {
            startPolling(3000);
            setState({...state, isPolling: true});
        } else if (!loading && data) {
            if (data.checkProfile?.responseCode == 0) {
                stopPolling();
                // window.location.href = window.location.href;
                setState({ ...state, isOpen: false, isDone: true});
            }
        }
    }

    const closeModal = () => {
        setState({ ...state, isDone: false });
        window.location.href = window.location.href;
    };

    return (
        <>
            {/* className={state.portfolios !== [] || state.watchlists !== [] ? "btn btn-primary" : "btn btn-primary disabled"}  */}
            <Modal show={state.isOpen} className="modal fade profile-modals modal-dialog-sky-placement">
                <div className="modal-dialog portfolio-import-modal portfolio-progress profile-process modal-content ml-auto mr-auto">
                    <div className="w-100 d-flex justify-content-start bg-white py-1 pl-xl-3 pl-lg-2 pl-md-2 pl-sm-2 rounded-top" style={{minWidth: "inherit"}}>
                        <span className="font-weight-bold roboto-heading my-auto text-truncate fs-18px">Wir importieren...</span>
                    </div>
                    <Modal.Body className="bg-white w-100">
                        <div>
                            <b>Achtung!</b> Dieser Vorgang kann einige Minuten in Anspruch nehmen. <b>Bitte schließen Sie dieses Fenster nicht!</b>
                        </div>
                        <div className="text-center py-4" onClick={() => setState({...state,isDone: true, isOpen: false})}>
                            <Spinner animation="border" />
                        </div>
                    </Modal.Body>
                    </div>
            </Modal>
            <Modal show={state.isDone} className="modal fade profile-modals modal-dialog-sky-placement">
                <div className="modal-dialog portfolio-import-modal portfolio-progress profile-process modal-content ml-auto mr-auto">
                    <ModalHeaderMeinFinanztreff title="Import erfolgreich" close={closeModal} />
                    <Modal.Body className="bg-white">
                        <div>
                            <div className="success-title text-center font-weight-bold pb-4">
                                <img src="/static/img/svg/icon_check_hook_green.svg" width="60" alt="" className="" />
                                <span style={{fontSize: "18px"}}>Vorgang abgeschlossen</span>
                            </div>
                            <p className="fnt-size-13">
                              <b>Alles erledigt!</b> Sie können jetzt alle Funktionen Ihres neuen "Mein finanztreff" nutzen und testen. Wir freuen uns auf Ihr Feedback!                            </p>
                            <div className="button-row d-flex justify-content-end">
                                <button className="btn btn-primary" onClick={closeModal}>Fenster schließen</button>
                            </div>
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
}


interface ImportProgressState {
    isPolling: boolean;
    isOpen: boolean;
    isDone: boolean
}

interface ImportProgressProps {
    isOpen: boolean;
}

