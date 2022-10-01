import { trigInfonline } from "components/common/InfonlineService";
import { ModalHeaderMeinFinanztreff } from "components/profile/modals/ModalHeaderMeinFinanztreff";
import moment from "moment";
import { useState } from "react";
import { Modal } from "react-bootstrap";

export function ChangelogModal() {
    const [isOpen, setModalOpen] = useState(handleChangelogShowatDay);

    return (
        <>
            <div className='cursor-pointer' onClick={() => {setModalOpen(true); trigInfonline('homepage', 'layer_changelog')} }>
                Changelog - finanztreff.de beta
            </div>
            <Modal show={isOpen} onHide={() => setModalOpen(false)} size="lg" className="limit-add-modal fade modal-dialog-sky-placement">
                <ModalHeaderMeinFinanztreff title="Changelog - finanztreff.de beta" close={() => setModalOpen(false)} />
                <Modal.Body className="border-0 bg-white">
                    <iframe className="changelog-content" width="100%"
                        title={""}
                        key={0}
                        src={"/iframe/index.html"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                </Modal.Body>
            </Modal>
        </>
    );
}

// function handleChangelogShow() {
//     if (window.localStorage.getItem('changlelogDate') !== undefined) {
//         let oldDate = window.localStorage.getItem('changlelogDate') || "0";

//         if (moment().diff(oldDate, 'days') > 6) {
//             localStorage.setItem('changlelogDate', moment().toString());
//             return true;
//         }
//     }
//     else {
//         localStorage.setItem('changlelogDate', moment().toString());
//         return false;
//     }
// }

function handleChangelogShowatDay() {
    const startDate = moment([2022, 8, 21]); 

    if (moment().diff(startDate, 'days') % 14 == 0) {
        if (!window.localStorage.getItem('isChangelogShown') || window.localStorage.getItem('isChangelogShown') === "false") {
            window.localStorage.setItem('isChangelogShown', "true");
            return true;
        }
        return false;
    }
    else {
        window.localStorage.setItem('isChangelogShown', "false");
        return false;
    }
}
