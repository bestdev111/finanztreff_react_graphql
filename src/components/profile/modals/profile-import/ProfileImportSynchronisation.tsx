import { useQuery, useMutation } from '@apollo/client';
import { FETCH_USER_PROFILE_OVERVIEW, IMPORT_PROFILE } from 'components/profile/query';
import { Query, Mutation } from 'generated/graphql';
import { useState } from 'react';
import { Modal, Spinner } from "react-bootstrap";
import { ModalHeaderMeinFinanztreff } from '../ModalHeaderMeinFinanztreff';
import './profile-import.scss';

export function ProfileImportSynchronisation(props: ProfileImportSynchronisationProps) {
    const [state, setState] = useState<ProfileImportSynchronisationState>({
        isOpen: true,
        isLimitsOn: false,
        isProgressOpen: false,
        includedPF: [],
        includedWL: [],
        includeLimits: false 
    });

    let [importProfile, { loading: mutationLoading }] = useMutation<Mutation>(IMPORT_PROFILE);

    let runImport = () => {
        if (props.username && (props.username.length > 0) && props.password && (props.password.length > 0)) {
            importProfile({ variables: 
                { 
                    userName: props.username, 
                    password: props.password,
                    portfolioFilter: state.includedPF,
                    watchlistFilter: state.includedWL,
                    includeLimits: state.includeLimits
                }
            })
                .then(entry => {
                    if (entry && entry.data) {
                        if (entry.data.importProfile.responseCode >= 100) {
                            alert(entry.data?.importProfile.responseMessage);
                        } else if (entry.data.importProfile.responseCode == 0) {
                            alert(entry.data?.importProfile.responseMessage);
                        } else if (entry.data.importProfile.responseCode != 0) {
                            setState({ ...state, isProgressOpen: true, isOpen: false }); 
                            props.handleOpen(false);
                            if (props.handleClose) props.handleClose();
                        }
                    }
                });
        }
    }

    let { loading, data } = useQuery<Query>(FETCH_USER_PROFILE_OVERVIEW, { variables: { userName: props.username, password: props.password } });

    const portfolios = data?.fetchProfileOverview.data?.portfolios || [];
    const watchlists = data?.fetchProfileOverview.data?.watchlists || [];
    
    const handleLists = (value: number, isWatchlist: boolean) => {
        if (isWatchlist){
            let current = state.includedWL;
            state.includedWL.includes(value) ? current=current.filter(current => current!=value) : current.push(value)
            setState({...state, includedWL: current}) ;
        }
        else{
            let current = state.includedPF;
            state.includedPF.includes(value) ? current=current.filter(current => current!=value) : current.push(value)
            setState({...state, includedPF: current}) ;
        }
    }

    const handleLimits = () => {
        const newValue = !state.includeLimits;
        setState({...state, includeLimits: newValue});
    }

    const close = () => { setState({ ...state, isLimitsOn: false, isProgressOpen: false }); props.handleOpen(false); props.handleOuterModalOpen(false) };

    return (
        <>
            <Modal show={state.isOpen} onHide={() => props.handleOpen(false)} className="modal fade profile-modals modal-dialog-sky-placement">
                <div className="modal-dialog portfolio-import-modal profile-process modal-content ml-auto mr-auto bottom-modal">
                    <ModalHeaderMeinFinanztreff title="Daten auswählen" close={close} />
                    <Modal.Body className="bg-white w-100">
                        {!loading && data?.fetchProfileOverview.result.responseCode != 0 ?

                            <>
                                <div>{data?.fetchProfileOverview.result.responseMessage}</div>
                                <div className="d-flex justify-content-end pt-4">
                                    <button className="btn btn-primary text-nowrap px-2" 
                                    onClick={() => { props.handleOpen(false); props.handleOuterModalOpen(true) }}>
                                        Zurück
                                    </button>
                                </div>
                            </>
                            :
                            loading ?
                                <div className="text-center mt-10px" style={{ height: "40px" }}>
                                    <Spinner animation="border" role="status">
                                    </Spinner>
                                </div> :
                                <>
                                    <div className="expose-body">
                                        <h6 className="font-weight-bold">
                                            <img className="px-1 font-weight-bold pb-2" src="/static/img/svg/icon_check_hook_green.svg" width="30" alt="" />
                                        Anmeldung erfolgreich. Wir haben folgende Daten gefunden: {state.includedPF}
                                        </h6>
                                        <div className="row py-4 wl-pf-list">
                                            <div className="col-lg-6">
                                                <img src="/static/img/suitcase-icon-empty.png" width="18" className="pb-1" alt="" />
                                                <span className="font-weight-bold text-center" style={{ fontSize: "18px" }}> Portfolios </span>
                                                <div className="pt-2 list">
                                                    {portfolios.map(portfolio => {
                                                        return (
                                                            <p key={portfolio.id} onClick={()=> handleLists(portfolio.id, false)}>
                                                                {
                                                                    state.includedPF.includes(portfolio.id) ?
                                                                    <img src="/static/img/svg/icon_checkbox_checked_dark.svg" width="20" alt="" className="" />
                                                                    :
                                                                    <img src="/static/img/svg/icon_checkbox_unchecked_dark.svg" width="20" alt="" className="" /> 
                                                                }
                                                                {portfolio.name}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <img src="/static/img/svg/icon_watchlist_dark.svg" width="22" className="" alt="" />
                                                <span className="font-weight-bold text-center" style={{ fontSize: "18px", paddingTop: "6px" }}> Watchlist</span>
                                                <div className="pt-2 list">
                                                    {watchlists.map(watchlist => {
                                                        return (
                                                            <p key={watchlist.id} onClick={()=> handleLists(watchlist.id, true)}>
                                                                {
                                                                    state.includedWL.includes(watchlist.id) ?
                                                                    <img src="/static/img/svg/icon_checkbox_checked_dark.svg" width="20" alt="" className="" />
                                                                    :
                                                                    <img src="/static/img/svg/icon_checkbox_unchecked_dark.svg" width="20" alt="" className="" /> 
                                                                }
                                                                {watchlist.name}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-weight-bold py-3" style={{ fontSize: "18px" }} onClick={() => handleLimits()}>
                                            {
                                                state.includeLimits ?
                                                <img src="/static/img/svg/icon_checkbox_checked_dark.svg" width="22" alt="" className="" />
                                                :
                                                <img src="/static/img/svg/icon_checkbox_unchecked_dark.svg" width="22" alt="" className="" />
                                            }
                                            <img src="/static/img/svg/icon_bell_dark.svg" width="26" alt="" className="" />
                                            Limits
                                        </div>
                                        <div style={{ paddingBottom: "70px" }}>
                                            Bitte beachten Sie, dass Änderungen im "neuen" finanztreff.de in dieser Test-Phase
                                            keine Auswirkungen auf die bestehenden Portfolios des "alten" finanztreff.de haben.
                                            Sie können den "neuen finanztreff" also nach Herzenslust testen und ausprobieren.
                                            Diesen Import können Sie später auch erneut durchführen.
                                        </div>
                                        <div className="button-row d-flex justify-content-between fs-13">
                                            <span className="btn btn-border-gray px-2" style={{ color: "#326EAC" }} onClick={() => { setState({ ...state, isLimitsOn: false, isProgressOpen: false }); props.handleOpen(false); }}>
                                                Abbrechen
                                            </span>
                                            <button className="btn btn-primary text-nowrap px-2" onClick={() => { 
                                                runImport();
                                            }}>
                                                {mutationLoading && <Spinner animation="border" role="status" />}
                                                Ausgewählte Daten importieren
                                            </button>
                                        </div>
                                    </div>
                                </>
                        }
                    </Modal.Body>
                </div>
            </Modal>
        </>
    );
}

interface ProfileImportSynchronisationState {
    isOpen: boolean;
    isLimitsOn: boolean;
    isProgressOpen: boolean;
    includedPF: number[];
    includedWL: number[];
    includeLimits: boolean;
}

interface ProfileImportSynchronisationProps {
    isOpen: boolean;
    username: string;
    password: string;
    handleOpen: (isOpen: boolean) => void;
    handleOuterModalOpen: (isOpen: boolean) => void;
    handleClose?: () => void;
}
