import SvgImage from "components/common/image/SvgImage";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { LimitEntry } from "generated/graphql";
import { Modal } from "react-bootstrap";
import { numberFormat } from "utils";

export function AddLimitConfirmModal(props: AddLimitModalProps) {
    return (
        <Modal show={props.isOpen} onHide={() => props.handleClose()} size="lg" className="limit-add-modal confirm-modal-limits modal-dialog-sky-placement" style={{ backgroundColor: "rgba(56, 56, 56, 0.6)" }}>
            <ModalHeaderMeinFinanztreff title={" "} titleClassName={"fs-18px"} close={() => { props.handleClose() }} />
            <Modal.Body className="modal-body bg-white">
                <div className="d-flex justify-content-center">
                    <img src="/static/img/svg/icon_check_hook_green.svg" className="ml-n2 mr-2" alt="" width={"40"} />
                    <span className="fs-18px font-weight-bold mx-2 py-2">Limit angelegt</span>
                </div>
                <div className="text-center mt-4">
                    <div className="fs-15px">
                        Für <b>{props.entry?.instrument?.name}</b>
                        <div>
                            wurden folgende Limits anlegt:
                        </div>
                    </div>
                    <div className="fs-15px font-weight-bold mt-3">
                        {
                            props.entry?.trailing ?
                                <>
                                    Trailing
                                    <SvgImage icon="icon_repeat.svg" convert={false} width="20" />
                                </>
                                : props.entry?.percent ?
                                    <>
                                        Relativ
                                        <SvgImage icon="icon_percent.svg" convert={false} width="20" />
                                    </>
                                    : <>
                                        Absolut
                                        <SvgImage icon="icon_absolute.svg" convert={false} width="20" />

                                    </>
                        }
                    </div>
                </div>
                <div className="text-center mt-3">
                    <span className="mx-2">
                        {
                            props.entry?.upper ?
                                <>
                                    <SvgImage icon="icon_limit_top_green.svg" convert={false} width="25" />
                                    Oberes Limit:
                                </>
                                :
                                <>
                                    <SvgImage icon="icon_limit_bottom_pink.svg" convert={false} width="25" />
                                    Unteres Limit:
                                </>
                        }
                    </span>
                    <span className="font-weight-bold mb-1">
                        {props.entry?.quoteType === "TRADE" ? "Kurs" : props.entry?.quoteType === "ASK" ? "Ask" : "Bid"} {numberFormat(props.entry?.effectiveLimitValue || 0)} {props.currencyCode}
                    </span>
                </div>

                <div className="my-3 d-flex justify-content-center">
                    <button className="btn btn-primary" onClick={() => props.handleClose()}>Fertig</button>
                </div>
            </Modal.Body>
        </Modal>
    );
}


interface AddLimitModalProps {
    isOpen: boolean
    handleClose: () => void;
    entry?: LimitEntry;
    currencyCode?: string;
}