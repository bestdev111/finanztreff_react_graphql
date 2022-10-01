import {useMediaQuery} from 'react-responsive';
import { Button, Row, Modal } from "react-bootstrap";
import SvgImage from "components/common/image/SvgImage";
import classNames from "classnames";

export default function EmailPasswordModalHeader({title , close, className, buttonClassName, buttonBottom = false}: {title?: string, close: any, className?: string, buttonClassName?: string, buttonBottom?: boolean}) {
    const isMobile = useMediaQuery({
        query: "(max-width: 767px)"
    })
    console.log(isMobile && buttonBottom)
    return (
        <Modal.Header className={classNames("px-2 px-sm-2 px-md-3 px-lg-3 px-xl-3 pt-2 pt-sm-2 pt-md-3 pt-lg-3 pt-xl-3 pb-0 border-0", className)}>
            <div className="bg-white w-100">
                <Row className="mx-0 flex-nowrap justify-content-between bg-white align-items-center rounded-top" style={{ minWidth: "inherit" }}>
                    <span className={"font-weight-bold roboto-heading my-auto text-truncate fs-18px"}>{title}</span>
                    <Button variant="" onClick={close} className={classNames("text-decoration-none d-flex text-blue fs-15px pt-0 pb-0 pr-0 mr-n2", buttonClassName, {'align-items-end': isMobile && buttonBottom})}>
                        <span className="pt-sm-1">schließen</span>
                        <SvgImage icon="icon_close_blue.svg" className="close-modal-butt" spanClass="mb-n1" convert={false} width="26" />
                    </Button>
                </Row>
            </div>
        </Modal.Header>
    )
}

