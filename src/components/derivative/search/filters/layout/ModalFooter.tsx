import SvgImage from "../../../../common/image/SvgImage";
import {Button, Modal} from "react-bootstrap";

export function ModalFooter({apply}: { apply: any }) {
    return (
        <Modal.Footer className="d-flex justify-content-end border-0 bg-white">
            <Button variant="link" onClick={apply} className="pr-0">
                <SvgImage icon="icon_check_hook_green.svg" convert={false}
                          spanClass="green-icon mr-1" imgClass="green-check-icon"
                          width="15"/>
                Einstellung übernehmen
            </Button>
        </Modal.Footer>
    );
}