import { Button, Container, Row } from "react-bootstrap";
import classNames from "classnames";
import SvgImage from "components/common/image/SvgImage";

export function ModalHeaderMeinFinanztreff({ title, close, titleClassName, closeFontSize, closeIconSize }: { title: any, close: any, titleClassName?: string, closeFontSize?: string, closeIconSize?: string }) {
    return (
        <div className="px-md-3 px-sm-2 bg-white w-100">
            <Row className="justify-content-between bg-white align-items-center px-xl-3 px-lg-2 px-md-2 px-sm-0 rounded-top mx-md-0 mx-sm-n1 mx-lg-n3" style={{ minWidth: "inherit" }}>
                <span className={classNames("font-weight-bold roboto-heading my-auto text-truncate fs-18px", titleClassName)}>{title}</span>
                <Button variant="" onClick={close} className={classNames("text-decoration-none d-flex text-blue fs-15px pr-0 mr-n2", closeFontSize)}>
                    <span className="pt-sm-1">schließen</span>
                    <SvgImage icon="icon_close_blue.svg" className="close-modal-butt pb-2" convert={false} width={closeIconSize ? closeIconSize : "26"} />
                </Button>
            </Row>
        </div>
    );
}