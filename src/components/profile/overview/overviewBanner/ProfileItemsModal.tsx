import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface ProfileItemsModalProps {
    isOpen: boolean;
    handleOpen: (isOpen: boolean) => void;
    items?: any[];
    handleWatchlists: (ids: number[]) => void;
    oldItems: any[];
    inWatchlist: boolean;
}

export function ProfileItemsModal(props: ProfileItemsModalProps) {

    const [idList, setList] = useState(props.oldItems.map(current => current.id));

    const handleLists = (value: number) => {
        let current = idList;
        idList.includes(value) ? setList(current.filter(current => current !== value)) : setList(current.concat(value))
    }

    let name = props.inWatchlist ? "Watchlists" : "Portfolios";

    return (<>
        <Modal show={props.isOpen} onHide={() => props.handleOpen(false)} size="lg" className="limit-add-modal fade items-include-modal modal-dialog-sky-placement" >
            <ModalHeaderMeinFinanztreff titleClassName='ml-n2' title={<><img src="/static/img/suitcase-icon-empty.png" width="25" className="m-2 mt-n1" alt="" />
                <span className="fs-24px">{name} auswählen</span></>} close={() => props.handleOpen(false)} />
            <Modal.Body className="modal-body bg-white">
                <div className="expose-body pl-xl-0 pl-lg-0 pl-md-0 pl-sm-2">
                    <div className='text-dark mt-3'>
                        Sie möchten nur ausgewählte {name} zusammenfassen?
                        Hier können Sie selbst auswählen, welche {name} Sie in der Gesamtansicht berücksichtigen möchten.
                    </div>
                    <div className="row pt-4 wl-pf-list border-bottom-2 border-gray-light">
                        <div className="col-lg-6 ">
                            <div className="pt-2 list">
                                {props.items && props.items.map((item: any, index: number) => {
                                    return (
                                        <p className="cursor-pointer" key={item.id} onClick={() => handleLists(item.id)}>
                                            {
                                                idList.includes(item.id) ?
                                                    <img src="/static/img/svg/icon_checkbox_checked_dark.svg" className="mb-1" width="20" alt=""/>
                                                    : <img src="/static/img/svg/icon_checkbox_unchecked_dark.svg" width="20" alt="" className="mb-1" />
                                            }
                                            <span>{item.name}</span>
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 list d-flex">
                        <p className="mr-2 cursor-pointer" onClick={() => setList(props.items && props.items.map(current => current.id) || [])}>
                            {
                                idList.length === props.items?.length ?
                                    <img src="/static/img/svg/icon_checkbox_checked_dark.svg" width="20" alt="" className="mb-1" />
                                    : <img src="/static/img/svg/icon_checkbox_unchecked_dark.svg" width="20" alt="" className="mb-1" />
                            }
                            Alle auswählen
                        </p>
                        <p className="cursor-pointer" onClick={() => setList([])}>
                            {
                                idList.length === 0 ?
                                    <img src="/static/img/svg/icon_checkbox_checked_dark.svg" width="20" alt="" className="mb-1"/>
                                    : <img src="/static/img/svg/icon_checkbox_unchecked_dark.svg" width="20" alt="" className="mb-1" />
                            }
                            Alle abwählen
                        </p>
                    </div>
                    <div className='text-right my-2'>
                        <Button variant="primary" onClick={() => { props.handleWatchlists(idList); props.handleOpen(false) }}>
                            Ausgewählte {name} anzeigen
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </>);
}