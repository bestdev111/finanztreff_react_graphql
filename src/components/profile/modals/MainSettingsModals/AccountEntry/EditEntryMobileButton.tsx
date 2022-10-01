import { Portfolio, PortfolioEntry } from "graphql/types";
import { useState } from "react"
import { Button, Modal } from "react-bootstrap";
import { ModalHeaderMeinFinanztreff } from "../../ModalHeaderMeinFinanztreff";
import { CopyAssetToOtherPortfolio } from "../CopyAssetToOtherPortfolio";
import { EditEntryModal } from "../EditEntryModal";
import { RemovePositionModal } from "../RemovePositionModal";
import { SplitAssetModal } from "../SplitAssetModal";
import { DevidendEntriesModal } from "./DividendEntriesModal";

export function EditEntryMobileButton(props: EditEntryMobileButtonProps) {

    const [isOpen, setOpen] = useState<boolean>(false);

    const handleClose = () => {setOpen(false); props.handleClose() };
    return (
        <>
            <Button variant="primary" className="mr-2" onClick={() => setOpen(true)} >
                Bearbeiten
            </Button>
            <Modal show={isOpen} onHide={handleClose} className="bottom modal-background modal-dialog-sky-placement">
                <ModalHeaderMeinFinanztreff title="Bearbeiten" close={() => setOpen(false)} />
                <Modal.Body className="modal-body">
                    <EditEntryModal portfolio={props.portfolio} entry={props.entry} onComplete={props.refreshTrigger} />
                    <DevidendEntriesModal portfolio={props.portfolio} entry={props.entry} onComplete={props.refreshTrigger} />
                    <SplitAssetModal portfolio={props.portfolio} entry={props.entry} onComplete={props.refreshTrigger} />
                    <RemovePositionModal portfolio={props.portfolio} entry={props.entry} refreshTrigger={props.refreshTrigger} handleClose={handleClose}>
                        <Button variant="pink" className="mr-2 mt-2">
                            <span className="svg-icon pr-1">
                                <img src="/static/img/svg/icon_close_white.svg" width="" className="" alt="" />
                            </span>
                            Löschen
                        </Button>
                    </RemovePositionModal>
                    <CopyAssetToOtherPortfolio portfolio={props.portfolio} entry={props.entry} refreshTrigger={props.refreshTrigger} handleClose={handleClose}/>
                </Modal.Body>
            </Modal>
        </>
    )
}

interface EditEntryMobileButtonProps {
    portfolio: Portfolio;
    instrumentGroupId?: number;
    entry: PortfolioEntry;
    refreshTrigger: () => void;
    handleClose: () => void;
}
