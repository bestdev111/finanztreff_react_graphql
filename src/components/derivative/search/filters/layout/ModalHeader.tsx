import SvgImage from "../../../../common/image/SvgImage";
import {Button} from "react-bootstrap";

export function ModalHeader({title, close}: { title: string, close: any }) {
    return (
        <div className="d-flex justify-content-between bg-white py-3 pl-3">
            <span className="font-weight-bold roboto-heading">{title}</span>
            <Button variant="link" onClick={close}>
                schließen
                <SvgImage icon="icon_close_blue.svg" convert={false}
                          imgClass="svg-blue" style={{height: 20, width: 20}}/>
            </Button>
        </div>
    );
}