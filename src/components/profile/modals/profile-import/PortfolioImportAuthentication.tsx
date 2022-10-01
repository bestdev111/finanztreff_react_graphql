import {ReactNode, useEffect, useRef, useState} from 'react';
import { Form, Modal } from "react-bootstrap";
import { ProfileImportSynchronisation } from '.';
import { ModalHeaderMeinFinanztreff } from '../ModalHeaderMeinFinanztreff';
import {guessInfonlineSection, trigInfonline} from "../../../common/InfonlineService";

export function PortfolioImportAuthentication(props: PortfolioImportProps) {
    const [state, setState] = useState<PortfolioImportState>({
        isOpen: props.isOpen ? props.isOpen : false,
        isCheckListOpen: false,
        username: "",
        password: "",
        skip: true
    });

    const handleOpenInnerModal = (value: boolean) => setState({ ...state, isCheckListOpen: value });
    const handleOpen = (value: boolean) => setState({ ...state, isOpen: value, username: "", password: "", isCheckListOpen: false });

    const inputName = useRef<HTMLInputElement>(null);
    const inputPassword = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (state.isOpen) {
            trigInfonline(guessInfonlineSection(), "import_portfolios")
        }
    }, [state.isOpen])

    return (
        <>
            <Modal show={state.isOpen} size="lg" className="modal fade profile-modals modal-dialog-sky-placement">
                    <ModalHeaderMeinFinanztreff title={
                        <>
                            <div>
                                <div className="fs-20px line-height-1">finanztreff.de Import</div>
                                <div className="fs-14px line-height-1">Beta</div>
                            </div>
                        </>
                    } close={() => { handleOpen(false); props.handleAbort(); }} />
                    <Modal.Body className="bg-white w-100">
                        <div className="expose-body my-2">
                            <p>Zum Import der Portfolios, Watchlisten oder Limits eines bestehenden finanztreff.de Accounts,
                            geben Sie hier bitte Ihre "alten" Zugangsdaten ein. Nach erfolgreicher Anmeldung startet der Import-Vorgang.
                            </p>

                            <Form className="modal-form input-bg login-form mt-30" form-type="login">
                                <div className="form-group row justify-content-end">
                                    <label className="col-sm-4 col-form-label col-form-label-sm pr-0">Benutzername</label>
                                    <div className="col-sm-8 d-flex justify-content-end">
                                        <input type="text" className="form-control form-control-sm required" id="loginAcc" placeholder="..."
                                            ref={inputName} value={state.username} onChange={(e: any) => setState({ ...state, username: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group row justify-content-end">
                                    <label className="col-sm-4 col-form-label col-form-label-sm pr-0">Passwort</label>
                                    <div className="col-sm-8 d-flex justify-content-end">
                                        <input type="password" className="form-control form-control-sm required" id="loginPw" placeholder="..."
                                            ref={inputPassword} value={state.password} onChange={(e: any) => setState({ ...state, password: e.target.value })} />
                                    </div>
                                </div>
                            </Form>

                            <div className="button-row d-flex justify-content-end">
                                <button id="mainLoginModalSubmit" disabled={state.username == "" || state.password == ""}
                                    className="btn btn-primary" data-dismiss="modal" onClick={(e) => { 
                                        // setState({ ...state, isCheckListOpen: true, isOpen: false });
                                        setState({ ...state, isOpen: false });
                                        if (props.handleClose) { props.handleClose(state.username, state.password) };
                                    }}>
                                    Login
                                </button>
                            </div>
                            <div id="importingProgress" style={{ backgroundColor: "#cccccc", padding: "5px", display: "none" }}>
                                Importing ... <b><span id="seconds-counter">0</span></b>  sec.
                    </div>
                        </div>
                    </Modal.Body>
            </Modal>
            {state.isCheckListOpen && state.username !== "" && state.password !== "" &&
                <ProfileImportSynchronisation isOpen={state.isCheckListOpen}
                    username={state.username} password={state.password}
                    handleOuterModalOpen={handleOpen} handleOpen={handleOpenInnerModal} />
            }
        </>
    );
}

interface PortfolioImportProps {
    handleClose: (u: string, p: string) => void;
    handleAbort: () => void;
    isOpen?: boolean;
}

interface PortfolioImportState {
    isOpen: boolean;
    isCheckListOpen: boolean;
    username: string;
    password: string;
    skip: boolean
}
