import { useMutation } from "@apollo/client";
import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { Mutation } from "generated/graphql";
import { loader } from "graphql.macro";
import { useState } from "react";
import { Container, Form, Modal, Spinner } from "react-bootstrap";

interface ContactSupportAndScrollProps{
    className?: any
}

export function ContactSupportAndScrollSection(props: ContactSupportAndScrollProps) {

    const [showScroll, setShowScroll] = useState(false);
    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true)
        } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false)
        }
    };
    window.addEventListener('scroll', checkScrollTop);
    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <>
            <Container className={classNames("text-left pr-2 pb-2", props.className)} style={{ height: "0" }} id="contact-overlay">
                <ContactModal />
                <div className="go-to-top-button" onClick={scrollTop} style={showScroll == false ? { display: "none" } : {}}>
                    <SvgImage icon="icon_arrow_short_fullup_black.svg" convert={false} width="40" />
                </div>
            </Container>
        </>
    );
}

export function ContactModal() {

    const [isOpen, setOpen] = useState(false);
    const [state, setState] = useState({ email: "", message: "", show: true });
    const [showConfirmation, setShowConfirmation] = useState(false);

    let [mutation, {loading: mutationLoading}] = useMutation<Mutation>(loader('./feedback.graphql'));

    return (
        <>
            {state.show &&
                <div className="contact-button" onClick={(event: any) => setOpen(state.show)}>
                    <div className="d-flex justify-content-between">
                        <div className="font-weight-bold">Fragen?</div>
                        <SvgImage icon="icon_close_dark.svg" spanClass="top-move" width="22" imgClass="svg-black" convert={false} onClick={() => setState({ email: "", message: "", show: false })} />
                    </div>
                    <span className="text-nowrap">Schreiben Sie uns!</span>

                </div>
            }
            <Modal show={isOpen && state.show} onHide={() => setOpen(false)} size="lg" className="modal fade modal-dialog-sky-placement">
                    <ModalHeaderMeinFinanztreff title="Kontakt" close={() => { setState({ ...state, email: "", message: "" }); setOpen(false); setShowConfirmation(false) }}/>
                    <Modal.Body className="bg-white">
                        <div className="my-2">
                            <p>Haben Sie schon Fragen, Anregungen oder Hinweise zum neuen finanztreff? Ihr Feedback ist uns sehr wichtig.
                            </p>

                            {showConfirmation ?
                                <div className="expose-body my-4 d-flex justify-content-center">
                                    <div className="">
                                        <img src="/static/img/svg/icon_check_hook_green.svg" width="65" alt="" className="" />
                                    </div>
                                    <span className="d-inline-block">
                                        <br /><span className="fs-18px font-weight-bold mt-2">Danke für Ihr Feedback</span><br />
                                        <span className="fs-16px">Wir haben Ihre Nachricht erhalten.</span>
                                    </span>
                                </div>
                                :
                                <Form className="modal-form input-bg login-form mt-30" form-type="login">
                                    <div className="form-group">
                                        <label className="col-form-label col-form-label-sm pr-0 text-nowrap">Ihre E-Mail-Adresse (optional):</label>
                                        <input type="text" className="form-control form-control-sm" onChange={(e: any) => setState({ ...state, email: e.target.value })} placeholder="..." />
                                    </div>
                                    <div className="form-group">
                                        <label className="col-form-label col-form-label-sm pr-0 text-nowrap">Ihre Nachricht:</label>
                                        <textarea rows={4} className="form-control form-control-sm required" onChange={(e: any) => setState({ ...state, message: e.target.value })} placeholder="..." />
                                    </div>
                                </Form>
                            }
                            {showConfirmation == false && <div className="button-row d-flex justify-content-end">
                                <button id="mainLoginModalSubmit" className="btn btn-primary" 
                                        disabled={state.message !== "" ? false : true}
                                        onClick={() => {
                                            if (state.message!=="") {
                                                mutation({
                                                    variables: {
                                                        email: state.email,
                                                        body: state.message
                                                    }
                                                })
                                                    .then(entry => {
                                                        setShowConfirmation(true)
                                                    });
                                            }
                                        }} 
                                        >
                                    Abschicken
                                    { mutationLoading && <Spinner animation="border" role="status"/>}
                                </button>
                            </div>}
                        </div>
                    </Modal.Body>
            </Modal>
        </>
    );
}

